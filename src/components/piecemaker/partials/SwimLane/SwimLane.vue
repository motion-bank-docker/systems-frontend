<template lang="pug">
  .swim-lane-component.fit.relative-position(ref="wrapper", :class="[cursorGlobalResize, cursorGlobalGrabbing]")
    q-resize-observable(@resize="onWrapperResize")

    .row.no-wrap.full-height

      marker-context-menu(:root="self")
      marker-details-hover(:root="self")

      // ----------------------------------------------------------------------------------------------------- left side

      .ui-border-right.q-pa-md.scroll(
        v-if="visibilityDetails",
        :style="selectedAnnotationContainerStyles"
        )
        q-resize-observable(@resize="onDetailsResize")
        .full-width.row.relative-position

          //div
            // go to prev/next annotation

              q-btn.q-mr-xs(icon="navigate_before", round, size="sm", flat, :disabled="!selectedAnnotation")
              q-btn(icon="navigate_next", round, size="sm", flat, :disabled="!selectedAnnotation")

            // icon + timestamp

          .row.items-center
            .q-mr-sm(v-if="selectedAnnotation")
              annotation-icon.cursor-pointer(
                :annotation="selectedAnnotation",
                :isSelected="true",
                @click.native="onTimecodeLabelClick()"
                )

            div(v-if="selectedAnnotation", :class="{'row': !timecodeLabelBreakpoint}")
              timecode-label(
                v-if="selectedAnnotation",
                @click.native="onTimecodeLabelClick()",
                :millis="selectedAnnotation.target.selector._valueMillis",
                :videoDate="getVideoDate()"
                )

              // duration
              template(v-if="selectedAnnotation.target.selector._valueDuration")
                .timecode-label-duration-spacer(v-if="!timecodeLabelBreakpoint")
                .timecode-label-duration-spacer-vertical(v-else)
                timecode-label(
                  @click.native="onTimecodeLabelClick(true)",
                  :millis="getEndMillisFromDuration(selectedAnnotation)",
                  :videoDate="getVideoDate()"
                  )

            .q-caption.q-mt-xs(v-else) No annotation selected

        // details content

        .q-mt-md.text-white
          marker-details-selected(v-if="visibilityDetails", :root="self", :resizable="resizable")

      // ---------------------------------------------------------------------------------------------------- right side

      div.column.q-pl-md.q-pr-md.q-pt-xs(:style="swimLaneContainerStyles")

        // settings

        div.row.q-mb-xs

          // fix: mouse up in offset from resizeX button

          .bg-transparent.absolute-top-left

          // button change horizontal dimensions from details (affects swimlane width, too)

          q-btn.q-px-sm.q-mr-xs(
            v-if="visibilityDetails", v-touch-pan="handlerResizeX",
            @mousedown.native="onResizerDown",
            size="xs", icon="code", round, flat
            )

          // setting buttons

          settings(ref="settings")

          // resize (y) and hide swimlanes

          .absolute-top-right.text-right.q-mt-xs.q-mr-md(v-if="resizable")
            q-btn.q-ml-lg(
              @mousedown.native="onResizerDown",
              v-touch-pan="handlerResizeY",
              round, size="xs", flat
              )
              q-icon.rotate-90(name="code")

        // swim lane

        div.full-width.flex-fit-column(
          ref="swimlanewrap",
          v-if="!hideSwimlanes",
          style="background-color: #4C494A;"
          )
          .swim-lane-wrapper.wrapper

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
              line.sl-graph-timecode-current.stroke-neutral.no-event(
                :x1="timecodeMarkerCurrentX", y1="0",
                :x2="timecodeMarkerCurrentX", y2="100%"
                )
              marker-map(
                :root="self",
                :annotations="annotations"
                )
              // scroll and zoom bar
              navigation-bar(
                ref="nav",
                :root="self",
                :offset="offset",
                :annotations="annotations"
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
    props: [
      'markerDetails',
      'resizable',
      'start',
      'duration',
      'annotations',
      'media',
      'map',
      'selectedMillis',
      'mode'
    ],
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
        isResizing: false,
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

      this.$root.$emit('afterComponentMounted')
      this.cacheDimensions()
      // FIXME ugly fix because the call above seems to be fired to early
      setTimeout(() => { this.cacheDimensions() }, 500)
    },
    beforeDestroy () {
      this.setScrollPosition({x: 0, y: 0})
      this.setScaleFactor(1)

      window.removeEventListener('mousemove', this.onGlobalMove)
      window.removeEventListener('mouseup', this.onGlobalUp)
      window.removeEventListener('resize', this.onResize)
      window.removeEventListener('keydown', this.onKeyDown)
      window.removeEventListener('keyup', this.onKeyUp)

      this.$root.$off('UIDown', this.onUIDown)
      this.$root.$off('UIEnter', this.onUIEnter)
      this.$root.$off('UILeave', this.onUILeave)

      this.$root.$off('timecodeChange', this.setTimecode)
      this.$root.$off('scrollPositionChange', this.setScrollPosition)
      this.$root.$off('scaleFactorChange', this.setScaleFactor)
      this.$root.$off('annotationChange', this.onAnnotationChange)

      EventHub.$off()
    },
    computed: {
      ...mapGetters({
        timecodeCurrent: 'swimLane/getTimecode',
        scrollPosition: 'swimLane/getScrollPosition',
        scaleFactor: 'swimLane/getScaleFactor',
        groupAnnotationsBy: 'swimLane/getGroupAnnotationsBy',
        selectedAnnotation: 'swimLane/getSelectedAnnotation',
        detailsWidth: 'swimLane/getDetailsWidth',
        timecodeLabelBreakpoint: 'swimLane/getTimecodeLabelBreakpoint',
        expandedMode: 'swimLane/getExpandedMode',
        cursorTop: 'swimLane/getCursorTop',
        visibilityDetails: 'swimLane/getVisibilityDetails'
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

        if (this.annotations) {
          if (this.groupAnnotationsBy === 'type') {
            groups = this.annotations.reduce((sum, annotation) => {
              const type = annotation.body.type || annotation.body.source.type
              if (sum.indexOf(type) === -1) sum.push(type)
              return sum
            }, [])
            for (let group of groups) {
              filtered[group] = this.annotations.filter(annotation => annotation.body.type === group ||
                annotation.body.source.type === group)
            }
          }
          else if (this.groupAnnotationsBy === 'creator') {
            groups = this.annotations.reduce((sum, annotation) => {
              if (sum.indexOf(annotation.creator.name) === -1) sum.push(annotation.creator.name)
              return sum
            }, [])
            for (let group of groups) {
              filtered[group] = this.annotations.filter(annotation => annotation.creator.name === group)
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
      },
      selectedAnnotationContainerStyles () {
        return {
          width: this.dimensions.details.width.current + '%',
          minWidth: this.dimensions.details.width.min + '%',
          maxWidth: this.dimensions.details.width.max + '%',
          maxHeight: '100%'
        }
      },
      swimLaneContainerStyles () {
        return {
          'flex-grow': 2
        }
      }
    },
    watch: {
      expandedMode () {
        this.setScrollPosition({y: 0})
      },
      visibilityDetails () {
        this.updateCache()
      },
      selectedMillis (ms) {
        let v = this.isVisible({left: this.millisTotaltoAbsGraph(ms), top: 0})
        if (!v.x) this.setScrollPosition({x: this.millisTotaltoRelGraph(ms) - this.scaleFactor / 2})
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
        return annotation.target.selector._valueMillis + annotation.target.selector._valueDuration
      },
      jumpToMarker (val, useDuration) {
        let jumpingPoint
        if (!useDuration) {
          // if (!val) jumpingPoint = this.selectedMillis
          if (!val) jumpingPoint = this.selectedAnnotation
          else jumpingPoint = val
        }
        else {
          jumpingPoint = val
        }
        this.setScrollPosition({x: this.millisTotaltoRelGraph(jumpingPoint), y: 0})
      },
      onTimecodeLabelClick (useDuration) {
        this.$root.$emit('emitSelector', this.selectedAnnotation.target.selector, useDuration)
        this.jumpToMarker(this.selectedAnnotation.target.selector, useDuration)
      },
      getVideoDate () {
        return DateTime.fromMillis(this.media.target.selector._valueMillis)
      },
      setupScreen () {
        console.debug('SwimLane: setupScreen', this.dimensions.details)
        let selectedA = this.selectedAnnotation
        if (selectedA) {
          let ms = this.millisTotalToTimeline(DateTime.fromISO(selectedA.target.selector.value).toMillis())
          this.selectedAnnotationTime = this.millisToText(ms)
        }
        else this.selectedAnnotationTime = '–'

        if (this.visibilityDetails && this.detailsWidth) {
          this.dimensions.details.width.current = this.detailsWidth
        }
        else if (this.visibilityDetails && !this.detailsWidth) {
          this.dimensions.details.width.current = 30
        }
      },
      onWrapperResize (obj) {
        this.dimensions.details.height.current = obj.height
      },
      onDetailsResize (obj) {
        this.dimensions.details.width.currentPx = obj.width
        if (this.dimensions.details.width.currentPx < 280) {
          this.$store.commit('swimLane/setTimecodeLabelBreakpoint', true)
        }
        else this.$store.commit('swimLane/setTimecodeLabelBreakpoint', false)
      },
      onResizerDown () {
        this.isResizing = true
      },
      handlerResizeY (obj) {
        this.$store.commit('swimLane/setCursorTop', obj.position.top - 16 - 15)
      },
      handlerResizeX (obj) {
        let
          clWidth = this.$refs.wrapper.clientWidth,
          cursorPosLeft = obj.position.left - 16 - 15
        this.dimensions.details.width.current = cursorPosLeft / clWidth * 100
        this.$store.commit('swimLane/setDetailsWidth', this.dimensions.details.width.current)
      },
      handlerToggle (val) {
        switch (val) {
        case 'markerDetails':
          this.$store.commit('swimLane/setVisibilityDetails')
          break
        case 'swimlanes':
          // this.$emit('emitHandler')
          this.$store.commit('swimLane/setVisibilitySwimlanes')
          break
        }
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

        if (this.isResizing) {
          this.updateCache()
          this.isResizing = false
        }

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
        EventHub.currentKeyPressed = null
        switch (event.key) {
        case 'Control':
          document.body.style.overflow = 'auto'
          break
        }
      },
      onKeyDown (event) {
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
      scrollToMillis (ms) {
        return ms
      },
      scrollToAnnotation (a) {
        return a
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

        if (!isNaN(sp.x) && sp.x !== null && this.$refs.nav) {
          x = this.restrict(sp.x, 0, this.toRelCompX(this.el.width - (this.el.width * this.scaleFactor)))
        }
        if (!isNaN(sp.y) && sp.y !== null && this.$refs.graph && this.el) {
          y = this.restrict(sp.y, 0, this.toRelGraphY(this.$refs.graph.height - this.el.height))
        }
        this.$store.commit('swimLane/setScrollPosition', {x: x, y: y})
      },
      setTimecode (tc) { // int ms
        this.$emit('timecodeChange', tc)
      },
      setScaleFactor (sf) {
        this.$store.commit('swimLane/setScaleFactor', this.restrict(sf, 0, 1))
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
        return this.$refs.graph ? {x: this.inputPosition.x - this.$refs.graph.x, y: this.inputPosition.y - this.$refs.graph.y} : {x: 0, y: 0}
      },
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
      // markerList is currently not used for anything
      registerMarker (m) {
        this.markerList.push(m)
      },
      // --------------------------------------------------------------------------------------------------------- Cache
      cacheDimensions () {
        this.el.width = this.$refs.root.clientWidth
        this.el.height = this.$refs.root.clientHeight
        this.el.bounds = this.$refs.root.getBoundingClientRect()
      },
      updateCache (delay = 0) {
        setTimeout(this.cacheDimensions, delay)
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
      // top and left needs to be set
      isVisible (bounds) {
        let sx = this.toAbsGraphX(this.scrollPosition.x)
        let sy = this.toAbsGraphY(this.scrollPosition.y)
        let ox = bounds.offsetX || 0
        let oy = bounds.offsetY || 0
        let b = {
          left: bounds.left,
          right: bounds.right || bounds.left,
          top: bounds.top,
          bottom: bounds.bottom || bounds.top
        }
        return {
          x: b.left - sx >= -ox && b.right - sx <= this.el.width + ox,
          y: b.top - sy >= -oy && b.bottom - sy <= this.el.height + oy
        }
      },
      // ---------------------------------------------------------------------------------------------------- Conversion
      toAbsCompX (rel) {
        return rel * this.el.width
      },
      toAbsGraphX (rel) {
        return (this.$refs.graph) ? rel * this.$refs.graph.width : rel * 1
      },
      toAbsGraphY (rel) {
        return (this.$refs.graph) ? rel * this.$refs.graph.height : rel * 1
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
      restrict (p, min, max) {
        return Math.min(Math.max(p, min), max)
      },
      // ----------------------------------------------------------------------------------------------- Window Settings
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
    height: 100%

  .timecode-display-hover
    height: 20px
    line-height: 20px
    background: $darker
    color: $white
    padding: 0 6px
    top: 4px
    z-index: 99

  .timecode-label-duration-spacer
    border-bottom: 1px solid $faded
    width: 8px
    height: 10px

  .timecode-label-duration-spacer-vertical
    border-right 1px solid $faded
    width 44px
    height 10px
    margin-bottom -1px

</style>
