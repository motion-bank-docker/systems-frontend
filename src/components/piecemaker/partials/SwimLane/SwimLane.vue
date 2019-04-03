<template lang="pug">
  .swim-lane-component(:class="[cursorGlobalResize, cursorGlobalGrabbing]", style="position: relative;")
    div
      q-btn.q-mr-sm(slot="", @click="createMarker", label="Add annotation", color="primary")
      q-btn.q-mr-sm(slot="", @click="", label="Jump to selected annotation", color="primary")
      q-btn.q-mr-sm(slot="", @click="", label="Jump to current timecode", color="primary")

      .float-right(v-if="resizable")
        q-btn.q-ml-lg.q-px-sm(@click="", v-touch-pan="handlerResize", color="dark")
          q-icon.rotate-90(name="code")
        q-btn.q-ml-sm.q-px-sm(@click="handlerToggle('swimlanes')", color="dark", icon="clear")
      <!--q-btn.float-right(@click="handlerToggle('markerDetails')", :label="[markerDetails ? 'hide details' : 'show details']", color="primary")-->
      q-btn.float-right(@click="handlerToggle('markerDetails')", label="details", color="primary")

      // TODO: use input field here to set the timecode to an exact value
      <!--q-input.timecode-display-current.no-select(v-model="timecode.currentText")-->
      <!--.timecode-display-current.no-select Selected timecode: {{timecode.currentText}}-->
      marker-context-menu(:root="self")
      marker-details-selected.q-mt-md(v-if="markerDetails", :root="self")
      marker-details-hover(:root="self")
      .row.justify-between.q-my-md
        div.q-pt-xs
          | Selected timecode: {{ timecode.currentText }}
        div
          settings(ref="settings")
    .swim-lane-wrapper.wrapper
      .timecode-display-hover.no-select.no-event.p-abs(
        ref="timecodeDisplayHover",
        :class="(isFocused('timecodeBar') && !isDragged()) || isDragged('timecodeBar') ? '' : 'is-hidden'",
        :style="{left: timecodeBar.displayHover.x + 'px'}"
        ) {{timecode.hoverText}}
      // ----------------------------------------------------------------------------------------------------- Outer SVG
      svg.swim-lane(
        @mousedown.left.prevent,
        width="100%", height="50vh",
        ref="root"
        )
        graph(
          ref="graph",
          :annotationsGrouped="annotationsGrouped",
          :root="self"
          )
        timecode-bar(
          ref="timecodeBar",
          :root="self"
          )
        // TODO: own component
        line.sl-graph-timecode-current.stroke-neutral.no-event(
          :x1="timecodeMarkerCurrentX", y1="0",
          :x2="timecodeMarkerCurrentX", y2="100%"
          )
        navigation-bar(
          ref="nav",
          :root="self"
          )

</template>

<script>
  import { mapGetters } from 'vuex'
  import { DateTime } from 'luxon'
  import { EventHub } from '../SwimLane/EventHub'
  import SwimLaneMarker from './Graph/GraphMarker'
  import NavigationBar from './NavigationBar/NavigationBar'
  import TimecodeBar from './TimecodeBar/TimecodeBar'
  import Graph from './Graph/Graph'
  import Settings from './Settings'
  import MarkerDetailsHover from './MarkerDetailsHover'
  import MarkerDetailsSelected from './MarkerDetailsSelected'
  import MarkerContextMenu from './MarkerContextMenu'

  export default {
    components: {
      SwimLaneMarker,
      Graph,
      Settings,
      NavigationBar,
      TimecodeBar,
      MarkerDetailsHover,
      MarkerDetailsSelected,
      MarkerContextMenu
    },
    props: ['timelineUuid', 'markerDetails', 'resizable'],
    data () {
      return {
        self: this,
        el: {
          width: 0, height: 0
        },
        timeline: {
          duration: 0, start: 0
        },
        // states
        activeEl: null,
        focusedEl: null,
        // global
        // TODO check if still needed here
        inputOffset: {
          x: 0,
          y: 0
        },
        inputPosition: {
          x: 0, y: 0, clientX: 0, clientY: 0, screenX: 0, screenY: 0
        },
        scaleFactorMin: 0.02,
        timecode: {
          hover: 0, currentText: '00', hoverText: ''
        },
        timecodeBar: {
          displayHover: {
            // width: 120,
            x: 0
          }
        },
        currentKeyDown: null,
        annotations: [],
        // store all marker for collision detection later on
        markerList: []
      }
    },
    async mounted () {
      await this.loadData()

      window.addEventListener('mousemove', this.onGlobalMove)
      window.addEventListener('mouseup', this.onGlobalUp)
      window.addEventListener('resize', this.onResize)
      window.addEventListener('keydown', this.onKeyDown)
      window.addEventListener('keyup', this.onKeyUp)

      EventHub.$on('UIDown', this.onUIDown)
      EventHub.$on('UIEnter', this.onUIEnter)
      EventHub.$on('UILeave', this.onUILeave)

      EventHub.$on('timecodeChange', this.setTimecode)
      EventHub.$on('scrollPositionChange', this.setScrollPosition)
      EventHub.$on('scaleFactorChange', this.setScaleFactor)

      this.timecode.hoverText = this.millisToText(0)
      EventHub.$emit('timecodeChange', 0)

      this.cacheDimensions()
      EventHub.$emit('afterComponentMounted')
    },
    beforeDestroy () {
      this.setScrollPosition(0)
      this.setScaleFactor(1)
      window.removeEventListener('mousemove', this.onGlobalMove)
      window.removeEventListener('mouseup', this.onGlobalUp)
      window.removeEventListener('resize', this.onResize)
      window.removeEventListener('keydown', this.onKeyDown)
      window.removeEventListener('keyup', this.onKeyUp)

      EventHub.$off()
    },
    computed: {
      ...mapGetters({
        timecodeCurrent: 'swimLaneSettings/getTimecode',
        scrollPosition: 'swimLaneSettings/getScrollPosition',
        scaleFactor: 'swimLaneSettings/getScaleFactor',
        groupAnnotationsBy: 'swimLaneSettings/getGroupAnnotationsBy'
      }),
      cursorGlobalResize () {
        return this.isDragged(['navHandleRight', 'navHandleLeft']) ? 'global-ew-resize' : ''
      },
      cursorGlobalGrabbing () {
        return (this.isDragged() && !this.isDragged(['navHandleRight', 'navHandleLeft'])) ? 'global-grabbing' : ''
      },
      annotationsGrouped () {
        let groups
        let filtered = {}

        if (this.groupAnnotationsBy === 'type') {
          groups = this.annotations.reduce((sum, annotation) => {
            if (sum.indexOf(annotation.body.type) === -1) sum.push(annotation.body.type)
            return sum
          }, [])
          for (let group of groups) {
            filtered[group] = this.annotations.filter(annotation => annotation.body.type === group)
          }
        }
        else if (this.groupAnnotationsBy === 'author') {
          groups = this.annotations.reduce((sum, annotation) => {
            if (sum.indexOf(annotation.author.name) === -1) sum.push(annotation.author.name)
            return sum
          }, [])
          for (let group of groups) {
            filtered[group] = this.annotations.filter(annotation => annotation.author.name === group)
          }
        }
        return filtered
      },
      timecodeMarkerCurrentX () {
        if (this.timecodeCurrent) {
          let r = this.millisToRelGraph(this.timecodeCurrent) - this.scrollPosition.x
          let p = this.toAbsGraph(r)
          return p
        }
        return 0
      }
    },
    watch: {
      timecodeCurrent (tc) {
        this.timecode.currentText = this.millisToText(tc)
      }
    },
    methods: {
      handlerResize (obj) {
        console.log(obj.position.top)
        this.$emit('emitResize', obj.position.top)
      },
      handlerToggle (val) {
        switch (val) {
        case 'markerDetails':
          this.markerDetails = !this.markerDetails
          break
        case 'swimlanes':
          this.$emit('emitHandler')
          break
        }
      },
      // ----------------------------------------------------------------------------------------------------- Load Data
      async loadData () {
        const timeline = await this.$store.dispatch('maps/get', this.timelineUuid)
        const result = await this.$store.dispatch('annotations/find', {
          type: 'Annotation',
          'target.type': 'Timeline',
          'target.id': timeline.id
        })

        // TODO: clean this up, use/add helper methods
        const annotations = result.items.sort(this.$sort.onRef)
        // this.annotations = annotations

        // sort annotations earliest to latest
        // TODO: does not account for possible duration of annotations
        // annotations.sort((obj1, obj2) => {
        //   return this.isoToMillis(obj1.target.selector.value) - this.isoToMillis(obj2.target.selector.value)
        // })

        const duration = annotations[0].getDurationTo(annotations[annotations.length - 1])
        // TODO: find better way to set a padding so that annotations don't sit on the edges of the graph
        const padding = 120000 // 2 seconds
        this.timeline.duration = duration.as('milliseconds') + padding * 2
        this.timeline.start = DateTime.fromISO(annotations[0].target.selector.value).toMillis() - padding

        this.annotations = annotations

        // Add fake duration
        // let idx = 0
        // this.annotations = result.items.map(a => {
        //   a = a.toObject()
        //   if (idx % 2 === 0) a.body.duration = Math.round(60000 + Math.random() * 60000)
        //   idx++
        //   return a
        // })

        // TODO: add latest end point of annotation to timeline.duration so it will not lie beyond the visible graph

        for (let a in this.annotations) {
          let ann = this.annotations[a]
          console.debug('a:', ann, ann.body.duration)
        }
        console.log('annotations', this.annotations.length, DateTime.fromMillis(this.timeline.duration).toFormat('HH:mm:ss.SSS'), this.timelineUuid)
      },
      // -------------------------------------------------------------------------------------------------- E Input Move
      onGlobalMove: function (event) {
        this.inputPosition = this.getInputPosition(event)
        let tc = this.getTimecodeFromInputPosition()
        EventHub.$emit('inputPositionChange', this.inputPosition)

        if (this.isDragged('graphBackground')) {
          this.$refs.graph.update()
        }
        else if (this.isDragged(['navHandleBackground', 'navBackground', 'navHandleLeft', 'navHandleRight'])) {
          this.$refs.nav.update()
        }
        else if (this.isDragged(['timecodeBar'])) {
          EventHub.$emit('timecodeChange', tc)
        }
        else if (this.isDragged('marker')) {
          EventHub.$emit('markerUpdate')
        }
        this.timecode.hoverText = this.millisToText(tc)
        this.timecode.hover = tc

        // TODO: make own component
        let el = this.$refs.timecodeDisplayHover
        if (el) {
          this.timecodeBar.displayHover.x = this.restrict(this.inputPosition.x, 0, this.el.width - el.clientWidth)
        }
      },
      // ---------------------------------------------------------------------------------------------------- E Input Up
      onGlobalUp () {
        this.activeEl = null
        this.inputOffset.x = 0
        EventHub.$emit('globalUp')
        // console.log(this.$refs.root.clientHeight)
      },
      // ---------------------------------------------------------------------------------------------------------- E UI
      onUIDown (el) {
        this.activeEl = el
      },
      onUIEnter (el) {
        this.focusedEl = el
      },
      onUILeave (el) {
        if (this.focusedEl === el) this.focusedEl = null
      },
      // ---------------------------------------------------------------------------------------------------- E Keyboard
      onKeyUp () {
        this.currentKeyDown = null
        // TODO: is there another way to set this? How to setup event listening inside of EventHub?
        EventHub.currentKeyPressed = null
        switch (event.key) {
        case 'Control':
          document.body.style.overflow = 'auto'
          break
        }
      },
      onKeyDown (event) {
        console.log(event.key)
        this.currentKeyDown = event.key
        EventHub.currentKeyPressed = event.key
        if (event.key === ' ' && !this.resizable) event.preventDefault()
        switch (event.key) {
        case 'Control':
          // prevent scrolling
          // TODO: only apply when mouseover component?
          document.body.style.overflow = 'hidden'
          break
        }
      },
      // ----------------------------------------------------------------------------------------------------- E Actions
      createMarker () {
        // TODO create marker here
        this.setTimecode(Math.floor(this.timeline.duration * Math.random()))
        let d = DateTime.fromMillis(this.getTimecodeCurrentTotal()).toISO()
        let m = {
          created: d,
          author: {
            name: 'Author TEMP'
          },
          type: 'immer annotation',
          body: {
            src: '',
            purpose: 'Purpose TEMP',
            type: 'TEMP',
            duration: Math.random() > 0.5 ? Math.round(Math.random() * 120000) : 0
          },
          target: {
            selector: {
              value: d
            }
          }
        }
        this.annotations.push(m)
      },
      // ------------------------------------------------------------------------------------------------------- E Other
      onResize () {
        // TODO: throttle this: emit custom event here and use event.throttle with inline declaration ?
        this.cacheDimensions()
      },
      // ----------------------------------------------------------------------------------------------------------- Set
      setScrollPosition (sp) { // 0 - 1
        let x = this.restrict(sp, 0, this.toRelComp(this.el.width - this.$refs.nav.navHandleWidth))
        let y = 0
        this.$store.commit('swimLaneSettings/setScrollPosition', x, y)
      },
      setTimecode (tc) { // int ms
        this.$store.commit('swimLaneSettings/setTimecode', tc)
      },
      setScaleFactor (sf) {
        // this.$forceUpdate()
        this.$store.commit('swimLaneSettings/setScaleFactor', this.restrict(sf, 0, 1))
      },
      // ----------------------------------------------------------------------------------------------------------- Get
      // TODO: make single input or inputPosition object that holds all values?
      // TODO: rethink this
      getInputPosition (event) {
        if (event) {
          return {
            x: event.pageX - this.el.bounds.left,
            y: event.pageY - this.el.bounds.top,
            clientX: event.clientX,
            clientY: event.clientY,
            screenX: event.screenX,
            screenY: event.screenY
          }
        }
        else return this.inputPosition
      },
      getInputPositionAbsGraph () {
        return {x: this.inputPosition.x - this.$refs.graph.x, y: this.inputPosition.y - this.$refs.graph.y}
      },
      // TODO add y value
      getInputPositionRelGraph () {
        return {x: this.toRelGraph(this.getInputPositionAbsGraph().x)}
      },
      getTimecodeFromInputPosition () {
        let tc = Math.round(this.toRelGraph(this.inputPosition.x - this.$refs.graph.x) * this.timeline.duration)
        return this.restrict(tc, 0, this.timeline.duration)
      },
      getTimecodeFromInputPositionTotal () {
        return this.getTimecodeFromInputPosition() + this.timeline.start
      },
      getTimecodeFromGraphPositionAbs (pos) {
        let tc = Math.round(this.toRelGraph(pos) * this.timeline.duration)
        return this.restrict(tc, 0, this.timeline.duration)
      },
      getTimecodeCurrentTotal () {
        return this.timecodeCurrent + this.timeline.start
      },
      getMinutesInTimeline () {
        return Math.ceil(this.timeline.duration / 60000)
      },
      getGraphStepMin () {
        if (this.timeline.duration) return 60 / this.timeline.duration * 1000
        return 0
      },
      getVisibleTimecodeRange () {
        let t0 = this.relToMillis(this.scrollPosition.x)
        let t1 = this.relToMillis(this.toRelGraph(this.el.width))
        return {start: t0, length: t1}
      },
      // ---------------------------------------------------------------------------------------------------------- Misc
      registerMarker (m) {
        this.markerList.push(m)
      },
      // --------------------------------------------------------------------------------------------------------- Cache
      cacheDimensions () {
        this.el.width = this.$refs.root.clientWidth
        this.el.height = this.$refs.root.clientHeight
        this.el.bounds = this.$refs.root.getBoundingClientRect()
      },
      // -------------------------------------------------------------------------------------------------------- States
      isDragged (el) {
        return this.checkStateString(this.activeEl, el)
      },
      isFocused (el) {
        return this.checkStateString(this.focusedEl, el)
      },
      checkStateString (prop, el) {
        // has some value
        if (prop) {
          // multiple strings
          if (Array.isArray(el)) {
            for (let arg in el) {
              // just one has to match
              if (prop === el[arg]) return true
            }
            // nothing matched. probably unknown string passed or none string
            return false
          }
          // single string
          else {
            if (el) return prop === el
            // el was empty but prop is set. was called to check if anything is dragged.
            else return true
          }
        }
        else {
          return false
        }
      },
      // checking for visibility seems to be slower than just rendering everything D=
      isVisible (bounds) {
        let spa = this.toAbsGraph(this.scrollPosition.x)
        let offset = bounds.offset || 0
        return bounds.left - spa >= -offset && bounds.right - spa <= this.el.width + offset
      },
      // ---------------------------------------------------------------------------------------------------- Conversion
      toAbsComp (rel) {
        return rel * this.el.width
      },
      toAbsGraph (rel) {
        if (this.$refs.graph) return rel * this.$refs.graph.width
        else return rel * 1
      },
      toRelComp (abs) { // return 0 - 1
        return abs / this.el.width
      },
      toRelGraph (abs) { // return 0 - 1
        if (this.$refs.graph) {
          if (this.$refs.graph.width > 0) return abs / this.$refs.graph.width
          else return 0
        }
        else return 0
      },
      // relCompToRelGraph (rel) {
      //   return rel + this.scroll
      // },
      millisToRelGraph (ms) {
        return ms / this.timeline.duration
      },
      millisTotalToRelGraph (ms) {
        return (ms - this.timeline.start) / this.timeline.duration
      },
      millisTotalToAbsGraph (ms) {
        if (this.$refs.graph) return (ms - this.timeline.start) / this.timeline.duration * this.$refs.graph.width
        else return 0
      },
      millisTotalToTimeline (ms) {
        return ms - this.timeline.start
      },
      millisTimelineToTotal (ms) {
        return ms + this.timeline.start
      },
      relToMillis (rel) {
        return Math.round(rel * this.timeline.duration)
      },
      absToMillis (abs) {
        return Math.round(this.toRelGraph(abs) * this.timeline.duration)
      },
      // ---------------------------------------------------------------------------------------------------- Formatting
      // formatTimecode (tc) {
      //   let v = tc
      //   let mil = this.tripleDigit(v % 1000)
      //   let sec = this.doubleDigit(Math.floor(v / 1000) % 60)
      //   let min = this.doubleDigit(Math.floor(v / 1000 / 60) % 60)
      //   let hou = this.doubleDigit(Math.floor(v / 1000 / 60 / 60) % 24)
      //   let time = hou + ':' + min + ':' + sec + '.' + mil
      //   return {
      //     total: time,
      //     ms: mil,
      //     s: sec,
      //     m: min,
      //     h: hou
      //   }
      // },
      millisToText (ms, format) {
        format = format || 'HH:mm:ss.SSS'
        return DateTime.fromMillis(ms, { zone: 'utc' }).toFormat(format)
      },
      isoToMillis (iso) {
        return DateTime.fromISO(iso).toMillis()
      },
      // doubleDigit (v) {
      //   return (v < 10) ? '0' + v : v.toString()
      // },
      // tripleDigit (v) {
      //   v = v.toString()
      //   if (v < 10) v = '00' + v
      //   else if (v < 100) v = '0' + v
      //   return v
      // },

      // time scale on timecode bar
      formatGraphTimeMarker (i) {
        let s
        if (i === 0) {
          s = '00:'
        }
        else if (i < 10) {
          s = '0' + i + ':'
        }
        else {
          s = i + ':'
        }
        return s
      },
      restrict (p, min, max) {
        return Math.min(Math.max(p, min), max)
      }
    }
  }

</script>

<style scoped lang="stylus">
  @import 'swimLane'

  svg.swim-lane
    position: relative

  .wrapper
    position: relative

  /*
  .timecode-display-current
    height: 25px
    line-height: 25px
  */

  .timecode-display-hover
    height: 25px
    line-height: 25px
    background: $neutral
    color: $dark
    padding: 0 8px
    top: 0px
    z-index: 99

</style>
