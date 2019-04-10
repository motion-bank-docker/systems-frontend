<template lang="pug">
  .swim-lane-component.bg-orange(ref="wrapper", :class="[cursorGlobalResize, cursorGlobalGrabbing]", style="position: relative;")
    q-resize-observable(@resize="onViewportResize")
    .row.q-my-md
      //
        q-btn.q-mr-sm(slot="", @click="createMarker", label="Add annotation", color="primary")
        q-btn.q-mr-sm(slot="", @click="", label="Jump to selected annotation", color="primary")
        q-btn.q-mr-sm(slot="", @click="", label="Jump to current timecode", color="primary")

      marker-context-menu(:root="self")
      marker-details-hover(:root="self")

      .col-8.row
        div(:class="{'col-6' : showDetails}")

          // button show/hide details

          q-btn.q-px-sm.q-mr-sm(@click="handlerToggle('markerDetails')", icon="expand_more",
          :class="[showDetails ? 'rotate-90' : 'rotate-270 text-white']", size="sm", round)

          // button change horizontal dimensions

          q-btn.q-px-sm.q-mr-sm.float-right(
          v-if="showDetails", v-touch-pan="handlerResizeX",
          @mousedown.native="onMousedown", @mouseup.native="onMousedown",
          size="sm", icon="code", round)

          //
            TODO: use input field here to set the timecode to an exact value
            | Selected timecode: {{ timecode.currentText }}

        // settings

        .q-pl-xs
          settings(ref="settings")

      // resize and hide swimlanes

      .col-4.text-right(v-if="resizable")
        q-btn.q-ml-lg(@click="", v-touch-pan="handlerResize", color="dark", round, size="sm")
          q-icon.rotate-90(name="code")
        q-btn.q-ml-sm(@click="handlerToggle('swimlanes')", color="dark", icon="clear", round, size="sm")

    .row

      // details

      div.bg-green(
      :class="[showDetails ? '' : 'hidden']",
      :style="{width: detailsWidth + 'px', minWidth: '100px'}"
      )
        marker-details-selected(v-if="showDetails", :root="self", :resizable="resizable")

      // swim lane

      div.bg-black(
      ref="swimlanewrap",
      v-if="!hideSwimlanes",
      :style="{width: swimlaneWidth + 'px', minWidth: '100px'}"
      )
        .swim-lane-wrapper.wrapper

          // hovering timecode

          .timecode-display-hover.no-select.no-event.p-abs.q-caption(
            ref="timecodeDisplayHover",
            :class="(isFocused('timecodeBar') && !isDragged()) || isDragged('timecodeBar') ? '' : 'is-hidden'",
            :style="{left: timecodeBar.displayHover.x + 'px'}"
            ) {{ timecode.hoverText }}

          // ----------------------------------------------------------------------------------------------------- Outer SVG
          svg.swim-lane(
            @mousedown.left.prevent,
            width="100%", height="50vh",
            ref="root"
            )
            // swimlanes
            graph(
              ref="graph",
              :annotationsGrouped="annotationsGrouped",
              :root="self",
              :offset="offset"
              )
            // sections bar
            timecode-bar(
              ref="timecodeBar",
              :root="self",
              :offset="offset"
              )
            // TODO: own component
            line.sl-graph-timecode-current.stroke-neutral.no-event(
              :x1="timecodeMarkerCurrentX", y1="0",
              :x2="timecodeMarkerCurrentX", y2="100%"
              )
            // scroll and zoom bar
            navigation-bar(
              ref="nav",
              :root="self",
              :offset="offset"
              )

</template>

<script>
  import { mapGetters } from 'vuex'
  import { DateTime } from 'luxon'
  import { EventHub } from './EventHub'
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
    props: ['timelineUuid', 'markerDetails', 'resizable', 'visibilityDetails', 'detailsW'],
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
        markerList: [],
        showMarkerDetails: undefined,
        offset: {
          gutter: undefined,
          swimlanewrap: undefined
        },
        showDetails: this.visibilityDetails,
        cursorPos: {x: 0, y: 0},
        swimlaneWidth: 0,
        detailsWidth: 0,
        hideSwimlanes: false
      }
    },
    async mounted () {
      this.showDetails = this.visibilityDetails
      // console.log('this.detailsW', this.detailsW)
      if (this.visibilityDetails && this.detailsW) {
        this.detailsWidth = this.detailsW
        this.swimlaneWidth = this.$refs.wrapper.clientWidth - this.detailsWidth
      }
      else if (this.visibilityDetails && !this.detailsW) {
        this.swimlaneWidth = this.$refs.wrapper.clientWidth - (this.$refs.wrapper.clientWidth / 4)
      }
      if (!this.visibilityDetails || this.detailsW === 0) {
        this.swimlaneWidth = this.$refs.wrapper.clientWidth
      }
      // console.log(this.swimlaneWidth)

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
      this.setScrollPosition({x: 0, y: 0})
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
          let r = this.millistoRelGraph(this.timecodeCurrent) - this.scrollPosition.x
          let p = this.toAbsGraphX(r)
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
      onMousedown () {
        this.hideSwimlanes = !this.hideSwimlanes
      },
      onViewportResize (obj) {
        this.parentWidth = obj.width
        if (this.detailsWidth === 0 && this.showDetails) {
          this.detailsWidth = this.parentWidth / 4
          this.swimlaneWidth = this.parentWidth / 4 * 3
        }
      },
      handlerResize (obj) {
        this.$emit('emitResize', obj.position.top)
      },
      handlerResizeX (obj) {
        this.cursorPos.x = obj.position.left
        // this.swimlaneWidth = this.parentWidth - this.cursorPos.x
        this.swimlaneWidth = this.parentWidth - this.detailsW
        this.detailsWidth = this.cursorPos.x
        this.$emit('detailsWidth', this.detailsWidth)
        console.log('detailsW', this.detailsW)
      },
      handlerToggle (val) {
        switch (val) {
        case 'markerDetails':
          this.showMarkerDetails = !this.showMarkerDetails
          if (!this.resizable) this.showDetails = this.showMarkerDetails
          // alert(this.visibilityDetails)
          // if (!this.visibilityDetails) this.swimlaneWidth = this.parentWidth
          this.$emit('emitToggleDetails', this.showMarkerDetails)
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

        // if (this.showDetails) {
        //   this.offset.gutter = 16
        // }
        // else this.offset.gutter = 0
        // this.offset.swimlanewrap = this.$refs.swimlanewrap.offsetLeft

        if (el) {
          this.timecodeBar.displayHover.x = this.restrict(
            this.inputPosition.x,
            0,
            this.el.width - el.clientWidth)
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
        let x = null
        let y = null

        if (!isNaN(sp.x)) {
          x = this.restrict(sp.x, 0, this.toRelCompX(this.el.width - this.$refs.nav.navHandleWidth))
        }
        if (!isNaN(sp.y)) {
          y = this.restrict(sp.y, 0, this.toRelGraphY(this.$refs.graph.height - this.el.height))
        }

        this.$store.commit('swimLaneSettings/setScrollPosition', {x: x, y: y})
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
        return {x: this.toRelGraphX(this.getInputPositionAbsGraph().x), y: this.toRelGraphY(this.getInputPositionAbsGraph().y)}
      },
      getTimecodeFromInputPosition () {
        let tc = Math.round(this.toRelGraphX(this.inputPosition.x - this.$refs.graph.x) * this.timeline.duration)
        return this.restrict(tc, 0, this.timeline.duration)
      },
      getTimecodeFromInputPositionTotal () {
        return this.getTimecodeFromInputPosition() + this.timeline.start
      },
      getTimecodeFromGraphPositionAbs (pos) {
        let tc = Math.round(this.toRelGraphX(pos) * this.timeline.duration)
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
        let t1 = this.relToMillis(this.toRelGraphX(this.el.width))
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
        let spa = this.toAbsGraphX(this.scrollPosition.x)
        let offset = bounds.offset || 0
        return bounds.left - spa >= -offset && bounds.right - spa <= this.el.width + offset
      },
      // ---------------------------------------------------------------------------------------------------- Conversion
      toAbsCompX (rel) {
        // let offset = this.offset.swimlanewrap + this.offset.gutter
        return rel * this.el.width
        // return rel * this.$refs.swimlanewrap.clientWidth
      },
      toAbsGraphX (rel) {
        if (this.$refs.graph) return rel * this.$refs.graph.width
        else return rel * 1
      },
      toRelCompX (abs) { // return 0 - 1
        return abs / this.el.width
      },
      toRelCompY (abs) { // return 0 - 1
        return abs / this.el.height
      },
      toRelGraphX (abs) { // return 0 - 1
        if (this.$refs.graph) {
          if (this.$refs.graph.width > 0) return abs / this.$refs.graph.width
          else return 0
        }
        else return 0
      },
      toRelGraphY (abs) { // return 0 - 1
        if (this.$refs.graph) {
          if (this.$refs.graph.height > 0) return abs / this.$refs.graph.height
          else return 0
        }
        else return 0
      },
      // relComptoRelGraphX (rel) {
      //   return rel + this.scroll
      // },
      millistoRelGraph (ms) {
        return ms / this.timeline.duration
      },
      millisTotaltoRelGraph (ms) {
        return (ms - this.timeline.start) / this.timeline.duration
      },
      millisTotaltoAbsGraph (ms) {
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
        return Math.round(this.toRelGraphX(abs) * this.timeline.duration)
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
      },
      disableWindowScroll () {
        document.body.style.overflow = 'hidden'
      },
      enableWindowScroll () {
        document.body.style.overflow = 'auto'
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
