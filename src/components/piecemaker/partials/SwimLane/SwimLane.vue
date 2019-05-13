<template lang="pug">
  .swim-lane-component.fit.relative-position(ref="wrapper", :class="[cursorGlobalResize, cursorGlobalGrabbing]")
    q-resize-observable(@resize="onWrapperResize")

    .row.full-height

      marker-context-menu(:root="self")
      marker-details-hover(:root="self")

      // ----------------------------------------------------------------------------------------------------- left side

      div.shadow-10.q-pa-md.scroll(
      v-if="showDetails",
      :style="{width: dimensions.details.width.current + '%', minWidth: dimensions.details.width.min + '%', maxWidth: dimensions.details.width.max + '%', borderRight: '1px solid #333', maxHeight: '100%'}")
        q-resize-observable(@resize="onDetailsResize")
        .full-width.row.relative-position

          div
            // go to prev/next annotation

              q-btn.q-mr-xs(icon="navigate_before", round, size="sm", flat, :disabled="!selectedAnnotation")
              q-btn(icon="navigate_next", round, size="sm", flat, :disabled="!selectedAnnotation")

            // icon + timestamp

            .row.q-mt-xs
              .q-mt-xs.q-mr-sm(v-if="selectedAnnotation")
                annotation-icon.cursor-pointer(:annotation="selectedAnnotation",
                @click.native="onTimecodeLabel(selectedAnnotation)")

              div(v-if="selectedAnnotation", :class="{'row': !timecodeLabelBreakpoint}")
                timecode-label(
                v-if="selectedAnnotation",
                @click.native="onTimecodeLabel(selectedAnnotation)",
                :millis="selectedAnnotation.target.selector._valueMillis",
                :videoDate="getVideoDate()"
                )

                // duration
                template(v-if="selectedAnnotation.target.selector._valueDuration")
                  .timecode-label-duration-spacer(v-if="!timecodeLabelBreakpoint")
                  .timecode-label-duration-spacer-vertical(v-else)
                  timecode-label(
                  @click.native="onTimecodeLabel(selectedAnnotation, true)",
                  :millis="getEndMillisFromDuration(selectedAnnotation)",
                  :videoDate="getVideoDate()"
                  )

              .q-caption.q-mt-xs(v-else) empty

          // button hide details

          q-btn.absolute-top-right(@click="handlerToggle('markerDetails')",
          icon="clear", size="sm", round, flat, color="white", style="margin: 0 -6px 0 0;")

        // details content

        .q-mt-md.text-white
          marker-details-selected(v-if="showDetails", :root="self", :resizable="resizable")

      // ---------------------------------------------------------------------------------------------------- right side

      div.q-pa-md(
      :style="{width: dimensions.swimlanes.width.current + '%', minWidth: dimensions.swimlanes.width.min + '%', maxWidth: dimensions.swimlanes.width.max + '%'}"
      )

        // settings

        div.row.q-mb-md

          // fix: mouse up in offset from resizeX button

          .fit.bg-transparent.absolute-top-left(v-if="hideSwimlanes", @mouseup="onMouseUp")

          // button show details

          q-btn.q-px-sm.q-mr-xs(
          v-if="!showDetails",
          @click="handlerToggle('markerDetails')", icon="keyboard_backspace",
          :class="[showDetails ? '' : 'rotate-180']", size="sm", round, flat)

          // button change horizontal dimensions from details (affects swimlane width, too)

          q-btn.q-px-sm.q-mr-xs(
          v-if="showDetails", v-touch-pan="handlerResizeX",
          @mousedown.native="onMouse", @mouseup.native="onMouseUp",
          size="sm", icon="code", round, flat)

          // setting buttons

          .settings
            settings(ref="settings")

          // resize (y) and hide swimlanes

          .absolute-top-right.text-right.q-ma-md(v-if="resizable")
            q-btn.q-ml-lg(@mousedown.native="onMouse", @mouseup.native="onMouseUp", v-touch-pan="handlerResizeY",
            round, size="sm", flat)
              q-icon.rotate-90(name="code")
            q-btn.q-ml-sm(@click="handlerToggle('swimlanes')", icon="clear", round, size="sm", flat)

        // swim lane

        div.full-width(
        ref="swimlanewrap",
        v-if="!hideSwimlanes",
        style="background-color: #4C494A;"
        )
          .swim-lane-wrapper.wrapper(:style="{height: dimensions.swimlanes.height.current + 'px'}")

            // hovering timecode

            .timecode-display-hover.no-select.no-event.p-abs.q-caption(
              ref="timecodeDisplayHover",
              :class="(isFocused('timecodeBar') && !isDragged()) || isDragged('timecodeBar') ? '' : 'is-hidden'",
              :style="{left: timecodeBar.displayHover.x + 'px'}"
              ) {{ timecode.hoverText }}

            // --------------------------------------------------------------------------------------------- Outer SVG
            //
              svg.swim-lane(
              @mousedown.left.prevent,
              width="100%", height="50vh",
              ref="root"
              )
            svg.swim-lane(
              @mousedown.left.prevent,
              width="100%", height="100%",
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
              marker-map(
                :root="self",
                :annotations="annotations"
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
  import AnnotationIcon from '../AnnotationIcon'
  import TimecodeLabel from '../TimecodeLabel'
  import MarkerMap from './MarkerMap/MarkerMap'

  export default {
    components: {
      MarkerMap,
      AnnotationIcon,
      SwimLaneMarker,
      Graph,
      Settings,
      NavigationBar,
      TimecodeBar,
      MarkerDetailsHover,
      MarkerDetailsSelected,
      MarkerContextMenu,
      TimecodeLabel
    },
    props: ['timelineUuid', 'markerDetails', 'resizable', 'start', 'duration', 'annotations', 'video', 'map',
      'currentAnnotation', 'forceRendererMarker'],
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
        // annotations: [],
        // store all marker for collision detection later on
        markerList: [],
        hideSwimlanes: false,
        dimensions: {
          details: {
            height: {
              min: undefined,
              current: undefined,
              max: undefined
            },
            width: {
              min: 20,
              current: undefined,
              max: 50
            }
          },
          swimlanes: {
            height: {
              min: undefined,
              current: undefined,
              max: undefined
            },
            width: {
              min: 50,
              current: 100,
              max: 80
            }
          }
        },
        selectedAnnotationTime: undefined,
        dirtyAnnotation: undefined
      }
    },
    mounted () {
      this.setupScreen()

      // await this.loadData()

      this.timeline.duration = this.duration
      this.timeline.start = this.start

      // this.annotations = this.annotationsTemp

      window.addEventListener('mousemove', this.onGlobalMove)
      window.addEventListener('mouseup', this.onGlobalUp)
      window.addEventListener('resize', this.onResize)
      window.addEventListener('keydown', this.onKeyDown)
      window.addEventListener('keyup', this.onKeyUp)

      this.$root.$on('UIDown', this.onUIDown)
      this.$root.$on('UIEnter', this.onUIEnter)
      this.$root.$on('UILeave', this.onUILeave)

      // this.$root.$on('markerDown', this.onMarkerDown)

      this.$root.$on('timecodeChange', this.setTimecode)
      this.$root.$on('scrollPositionChange', this.setScrollPosition)
      this.$root.$on('scaleFactorChange', this.setScaleFactor)
      this.$root.$on('annotationChange', this.onAnnotationChange)

      this.timecode.hoverText = this.millisToText(0)

      // this.cacheDimensions()
      // FIXME ugly fix because the call above seems to be fired to early
      setTimeout(() => { this.cacheDimensions() }, 500)
      this.$root.$emit('afterComponentMounted')
      this.cacheDimensions()
      // this.setScaleFactor(0.2)
      // console.log('video start', this.start, this.duration)
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
        groupAnnotationsBy: 'swimLaneSettings/getGroupAnnotationsBy',
        selectedAnnotation: 'swimLaneSettings/getSelectedAnnotation',
        detailsWidth: 'swimLaneSettings/getDetailsWidth',
        timecodeLabelBreakpoint: 'swimLaneSettings/getTimecodeLabelBreakpoint',
        expandedMode: 'swimLaneSettings/getExpandedMode'
      }),
      storeCursorTop () {
        return this.$store.state.swimLaneSettings.cursorTop
      },
      showDetails () {
        return this.$store.state.swimLaneSettings.visibilityDetails
      },
      cursorGlobalResize () {
        return this.isDragged(['navHandleRight', 'navHandleLeft']) ? 'global-ew-resize' : ''
      },
      cursorGlobalGrabbing () {
        return (this.isDragged() && !this.isDragged(['navHandleRight', 'navHandleLeft'])) ? 'global-grabbing' : ''
      },
      annotationsGrouped () {
        let groups
        let filtered = {}

        if (this.annotations) {
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
        }
        return filtered
      },
      timecodeMarkerCurrentX () {
        if (this.timecodeCurrent && this.scrollPosition) {
          let r = this.millisToRelGraph(this.timecodeCurrent) - this.scrollPosition.x
          let p = this.toAbsGraphX(r)
          if (isFinite(p)) return Math.floor(p) + 0.5
          else return 0
          // return p
        }
        return 0
      }
    },
    watch: {
      expandedMode () {
        this.setScrollPosition({y: 0})
      },
      forceRendererMarker () {
        // alert('bla')
        // this.setScrollPosition({x: this.millisTotaltoRelGraph(val) - this.scaleFactor / 2, y: 0})
        // this.jumpToMarker()
      },
      currentAnnotation (val) {
        // this.setScrollPosition({x: this.millisTotaltoRelGraph(val), y: 0})
        this.setScrollPosition({x: this.millisTotaltoRelGraph(val) - this.scaleFactor / 2, y: 0})
      },
      timecodeCurrent (tc) {
        this.timecode.currentText = this.millisToText(tc)
      },
      selectedAnnotation (obj) {
        if (obj) {
          let ms = this.millisTotalToTimeline(DateTime.fromISO(obj.target.selector.value).toMillis())
          this.selectedAnnotationTime = this.millisToText(ms)
        }
      }
    },
    methods: {
      getEndMillisFromDuration (annotation) {
        // FIXME: use the function in annotate.vue via $root
        // this.$root.$emit('annotationEndMillis', annotation)
        // this.$root.$emit('emitSelector', annotation.target.selector)
        return annotation.target.selector._valueMillis + annotation.target.selector._valueDuration
      },
      jumpToMarker (val, useDuration) {
        let jumpingPoint
        if (!useDuration) {
          // if (!val) jumpingPoint = this.currentAnnotation
          if (!val) jumpingPoint = this.selectedAnnotation
          else jumpingPoint = val
        }
        else {
          jumpingPoint = val
        }
        this.setScrollPosition({x: this.millisTotaltoRelGraph(jumpingPoint), y: 0})
      },
      onTimecodeLabel (annotation, useDuration) {
        this.$root.$emit('emitSelector', annotation.target.selector, useDuration)
        this.$store.commit('swimLaneSettings/setSelectedAnnotation', annotation)
        this.jumpToMarker(annotation.target.selector, useDuration)
      },
      getVideoDate () {
        return DateTime.fromMillis(this.video.target.selector._valueMillis)
      },
      setupScreen () {
        let selectedA = this.selectedAnnotation
        if (selectedA) {
          let ms = this.millisTotalToTimeline(DateTime.fromISO(selectedA.target.selector.value).toMillis())
          this.selectedAnnotationTime = this.millisToText(ms)
        }
        else this.selectedAnnotationTime = '–'

        if (this.showDetails) this.dimensions.swimlanes.width.max = 80
        else this.dimensions.swimlanes.width.max = 100

        if (this.showDetails && this.detailsWidth) {
          this.dimensions.details.width.current = this.detailsWidth
          this.dimensions.swimlanes.width.current = 100 - this.dimensions.details.width.current
        }
        else if (this.showDetails && !this.detailsWidth) {
          this.dimensions.details.width.current = 30
          this.dimensions.swimlanes.width.current = 70
        }
      },
      onWrapperResize (obj) {
        this.dimensions.details.height.current = obj.height
        this.dimensions.swimlanes.height.current = obj.height - 85
      },
      onDetailsResize (obj) {
        this.dimensions.details.height.currentPx = obj.width
        // console.log(this.dimensions.details.height.currentPx)

        // if (this.dimensions.details.height.currentPx < 280) this.timecodeLabelBreakpoint = true
        // else this.timecodeLabelBreakpoint = false
        if (this.dimensions.details.height.currentPx < 280) {
          this.$store.commit('swimLaneSettings/setTimecodeLabelBreakpoint', true)
        }
        else this.$store.commit('swimLaneSettings/setTimecodeLabelBreakpoint', false)
      },
      onMouse () {
        this.hideSwimlanes = !this.hideSwimlanes
      },
      onMouseUp () {
        this.$emit('forceRenderer')
      },
      handlerResizeY (obj) {
        this.$store.commit('swimLaneSettings/setCursorTop', obj.position.top - 16 - 15)
      },
      handlerResizeX (obj) {
        let
          clWidth = this.$refs.wrapper.clientWidth,
          cursorPosLeft = obj.position.left - 16 - 15
        this.dimensions.details.width.current = cursorPosLeft / clWidth * 100
        this.dimensions.swimlanes.width.current = (clWidth - cursorPosLeft) / clWidth * 100
        this.$store.commit('swimLaneSettings/setDetailsWidth', this.dimensions.details.width.current)
      },
      handlerToggle (val) {
        switch (val) {
        case 'markerDetails':
          this.$store.commit('swimLaneSettings/setVisibilityDetails')
          break
        case 'swimlanes':
          // this.$emit('emitHandler')
          this.$store.commit('swimLaneSettings/setVisibilitySwimlanes')
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

        // scale swim lane to first and last annotation loaded

        // const duration = annotations[0].getDurationTo(annotations[annotations.length - 1])
        // // TODO: find better way to set a padding so that annotations don't sit on the edges of the graph
        // const padding = 120000 // 2 seconds
        // this.timeline.duration = duration.as('milliseconds') + padding * 2
        // this.timeline.start = DateTime.fromISO(annotations[0].target.selector.value).toMillis() - padding

        this.timeline.duration = this.duration
        this.timeline.start = this.start

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

        // for (let a in this.annotations) {
        //   let ann = this.annotations[a]
        //   console.debug('a:', ann)
        // }
        // console.log('annotations', this.annotations.length, DateTime.fromMillis(this.timeline.duration).toFormat('HH:mm:ss.SSS'), this.timelineUuid)
      },
      // -------------------------------------------------------------------------------------------------- E Input Move
      onGlobalMove: function (event) {
        this.inputPosition = this.getInputPosition(event)
        let tc = this.getTimecodeFromInputPosition()
        this.$root.$emit('inputPositionChange', this.inputPosition)

        if (this.isDragged('graphBackground')) {
          this.$refs.graph.update()
        }
        else if (this.isDragged(['navHandleBackground', 'navBackground', 'navHandleLeft', 'navHandleRight'])) {
          this.$refs.nav.update()
        }
        else if (this.isDragged(['timecodeBar'])) {
          this.$root.$emit('timecodeChange', tc)
        }
        else if (this.isDragged('marker')) {
          this.$root.$emit('markerUpdate')
        }
        this.timecode.hoverText = this.millisToText(tc)
        this.timecode.hover = tc

        // TODO: make own component
        let el = this.$refs.timecodeDisplayHover

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

        // has dirty annotation => trigger updateAnnotation in parent
        if (this.dirtyAnnotation) {
          this.$emit('updateAnnotation', this.dirtyAnnotation)
          this.dirtyAnnotation = undefined
        }
        this.$root.$emit('globalUp')
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

        if (!isNaN(sp.x) && this.$refs.nav) {
          x = this.restrict(sp.x, 0, this.toRelCompX(this.el.width - this.$refs.nav.navHandleWidth))
        }
        if (!isNaN(sp.y) && this.$refs.graph && this.el) {
          y = this.restrict(sp.y, 0, this.toRelGraphY(this.$refs.graph.height - this.el.height))
        }
        this.$store.commit('swimLaneSettings/setScrollPosition', {x: x, y: y})
      },
      setTimecode (tc) { // int ms
        // this.$store.commit('swimLaneSettings/setTimecode', tc)
        this.$emit('timecodeChange', tc)
      },
      setScaleFactor (sf) {
        // this.$forceUpdate()
        this.$store.commit('swimLaneSettings/setScaleFactor', this.restrict(sf, 0, 1))
        // console.log('time frame', this.millisToText(this.getVisibleTimeFrame().millis / 5))
      },
      onAnnotationChange (annotation) {
        this.dirtyAnnotation = annotation
      },
      // ----------------------------------------------------------------------------------------------------------- Get
      getVisibleTimeFrame () {
        let d = Math.floor(this.toRelGraphX(this.el.width) * this.timeline.duration)
        return {
          millis: d,
          text: this.millisToText(d)
        }
      },
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
        if (this.inputPosition && this.$refs.graph) {
          let tc = Math.round(this.toRelGraphX(this.inputPosition.x - this.$refs.graph.x) * this.timeline.duration)
          return this.restrict(tc, 0, this.timeline.duration)
        }
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
        return rel * this.el.width
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
      millisToRelGraph (ms) {
        let res = ms / this.timeline.duration
        if (isFinite(res)) return res
        else return 0
      },
      millisToAbsGraph (ms) {
        return ms / this.timeline.duration * this.$refs.graph.width
      },
      millisToAbsComp (ms) {
        return ms / this.timeline.duration * this.el.width || 0
      },
      millisTotaltoRelGraph (ms) {
        return (ms - this.timeline.start) / this.timeline.duration
      },
      millisTotaltoAbsGraph (ms) {
        if (this.$refs.graph) return (ms - this.timeline.start) / this.timeline.duration * this.$refs.graph.width
        else return 0
      },
      millisTotaltoAbsComp (ms) {
        if (this.$refs.graph) return (ms - this.timeline.start) / this.timeline.duration * this.el.width
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
        if (!isNaN(ms)) {
          format = format || 'HH:mm:ss.SSS'
          return DateTime.fromMillis(ms, { zone: 'utc' }).toFormat(format)
        }
      },
      isoToMillis (iso) {
        return DateTime.fromISO(iso).toMillis()
      },
      millisToIso (ms) {
        return DateTime.fromMillis(ms).toISO()
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
  @import '~variables'
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
    height: 20px
    line-height: 20px
    background: $neutral
    color: $dark
    padding: 0 6px
    top: 4px
    z-index: 99

  /*
  .details
    .details-buttons
      opacity 0
    &:hover .details-buttons
      opacity 1
  */

  .settings
    margin-top -2px

  .timecode-label-duration-spacer
    border-bottom: 1px solid $faded
    width: 8px
    height: 10px

  .timecode-label-duration-spacer-vertical
    border-right 1px solid $faded
    width 47px
    height 10px
    margin-bottom -1px

</style>
