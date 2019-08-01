<template lang="pug">
  // ------------------------------------------------------------------------------------------------------ has duration
  svg.sl-marker.pointer(
    v-if="duration > 0 && isVisible"
    @mouseenter="onEnter ($event)",
    @mouseleave="onLeave ($event)",
    @mousedown.right="onDownRight ($event)",
    @contextmenu="onContext ($event)",
    @dblclick="onDoubleClick ($event)",
    :class="'sl-marker-' + annotationData.body.type",
    :x="xRel * 100 + '%'", :y="y",
    height="16", :width="widthRel * 100 + '%'",
    )
    rect.sl-marker-background(
      @mousedown.left="onDownBackground ($event)",
      width="100%", height="100%",
      :opacity="opacity",
      :class="typeClass"
      )
    <!--rect.no-event.no-select(v-if="isHovered", fill="rgba(0,0,0,0.3)", width="100%", height="100%")-->
    rect.sl-marker-handle-left.ew-resize(
      @mousedown.left="onDownHandleLeft ($event)",
      x="0", y="0",
      width="8", height="100%",
      :fill="handleFill"
      )
    rect.sl-marker-handle-right.ew-resize(
      @mousedown.left="onDownHandleRight ($event)",
      x="100%", y="0",
      transform="translate(-8,0)",
      width="8", height="100%",
      :fill="handleFill"
      )
  // --------------------------------------------------------------------------------------------------- has no duration
  svg.sl-marker.pointer(
    v-else-if="isVisible",
    @mouseenter="onEnter ($event)",
    @mouseleave="onLeave ($event)",
    @mousedown.left="onDownBackground ($event)",
    @mousedown.right="onDownRight ($event)",
    @contextmenu="onContext ($event)",
    @dblclick="onDoubleClick ($event)",
    :x="xRelCircle * 100 + '%'", :y="y",
    )
    circle.sl-marker.pointer(
      :cx="circleR", :cy="circleR" :r="circleR",
      :opacity="opacity",
      :class="typeClass"
      )
    <!--circle.no-event.no-select(v-if="isHovered", :cx="8", :cy="8", fill="rgba(0,0,0,0.3)", r="8")-->
</template>

<script>
  import { EventHub } from '../EventHub'
  import { mapGetters } from 'vuex'
  import { DateTime } from 'luxon'

  export default {
    props: ['annotationData', 'index', 'root'],
    data () {
      return {
        draggedEl: null,
        isDragged: false,
        isSelected: false,
        isHovered: false,
        activeElName: 'marker',
        millisCached: undefined,
        durationCached: undefined,
        inputOffsetX: 0,
        endCached: 0,
        circleR: 8,
        height: 20
      }
    },
    computed: {
      ...mapGetters({
        laneMode: 'swimLane/getLaneMode',
        expandedMode: 'swimLane/getExpandedMode',
        selectedAnnotation: 'swimLane/getSelectedAnnotation',
        scaleFactor: 'swimLane/getScaleFactor'
      }),
      handleFill () {
        return this.isHovered || this.isDragged ? 'rgba(255,255,255,0.5)' : 'transparent'
      },
      typeClass () {
        return 'annotation-type-' + this.annotationData.body.type
      },
      opacity () {
        return this.isHovered || this.isSelected ? 1 : 0.4
      },
      millis () {
        if (this.millisCached !== undefined) return this.millisCached
        else if (this.annotationData.target.selector) return this.annotationData.target.selector._valueMillis
        else return 0
      },
      duration () {
        if (this.durationCached !== undefined) return this.durationCached
        else return this.annotationData.target.selector._valueDuration || 0
        // else return 0
      },
      xRel () {
        const v = this.root.millisTotaltoRelGraph(this.millis)
        if (isFinite(v)) return v
        else return 0
      },
      xRelCircle () {
        const v = this.root.millisTotaltoRelGraph(this.millis) - this.root.toRelGraphX(this.circleR)
        if (isFinite(v)) return v
        else return 0
      },
      widthRel () {
        const v = this.root.millisToRelGraph(this.duration)
        if (isFinite(v)) return v
        else return 0
      },
      x () {
        return this.xRel * 100 + '%' || 0
      },
      isVisible () {
        // checking if a marker is in the current visible portion of the graph is too slow. Not used at the moment.
        // return this.root.isVisible({left: this.xAbs, right: this.xAbs, offset: 10})
        return true
      },
      y () {
        if (this.expandedMode) return (this.index + 1) * this.height
        if (!this.expandedMode) return this.height
        return 0
      }
    },
    async mounted () {
      if (this.selectedAnnotation) this.isSelected = this.selectedAnnotation._uuid === this.annotationData._uuid
      this.$root.$on('globalUp', this.onGlobalUp)
      this.$root.$on('componentMove', this.onComponentMove)
      this.$root.$on('markerUnselect', this.onUnselect)
      this.$root.$on('markerUpdate', this.onUpdate)
      // this.$root.$on('markerContextAction', this.onMarkerContextAction)
      this.$root.$on('MarkerAction_StartToTimecode', this.setStartToTimecode)
      this.$root.$on('MarkerAction_EndToTimecode', this.setEndToTimecode)
      // for collision detection
      this.root.registerMarker(this)
    },
    beforeDestroy () {
      this.$root.$off('globalUp', this.onGlobalUp)
      this.$root.$off('componentMove', this.onComponentMove)
      this.$root.$off('markerUnselect', this.onUnselect)
      this.$root.$off('markerUpdate', this.onUpdate)
      this.$root.$off('MarkerAction_StartToTimecode', this.setStartToTimecode)
      this.$root.$off('MarkerAction_EndToTimecode', this.setEndToTimecode)
    },
    watch: {
      selectedAnnotation () {
        if (this.selectedAnnotation) {
          this.isSelected = this.selectedAnnotation._uuid === this.annotationData._uuid
          if (this.isSelected) {
            const bounds = {
              top: this.y + this.$parent.y,
              bottom: this.y + this.$parent.y,
              right: this.root.toAbsGraphX(this.xRel),
              left: this.root.toAbsGraphX(this.xRel)
            }
            const v = this.root.isVisible(bounds)
            const s = {
              y: !v.y ? this.root.toRelGraphY(this.y + this.$parent.y - 2) : null
            }
            this.$root.$emit('scrollPositionChange', s)
          }
        }
      }
    },
    methods: {
      trigger (event, msg) {
        this.$root.$emit(event, msg)
      },
      onEnter () {
        this.isHovered = true
        this.$root.$emit('markerEnter', this.annotationData)
      },
      onLeave () {
        this.isHovered = false
        this.$root.$emit('markerLeave', this.annotationData)
      },
      onDownBackground (event) {
        this.checkUnselect()
        this.select()
        if (this.duration > 0) this.inputOffsetX = event.clientX - this.$el.getBoundingClientRect().left
        this.draggedEl = 'background'
        this.isDragged = true
        // move marker to current timecode
        if (EventHub.keyIsPressed('Alt')) {
          this.moveToTimecode()
        }
        let tc = this.root.millisTotalToTimeline(this.millis)
        this.$root.$emit('timecodeChange', tc)

        this.$root.$emit('markerDown', this.annotationData)
        this.$root.$emit('UIDown', this.activeElName)
        this.$store.commit('swimLane/setSelectedAnnotation', this.annotationData)
      },
      onDownHandleLeft () {
        this.checkUnselect()
        this.select()
        this.draggedEl = 'handleLeft'
        this.isDragged = true
        this.endCached = this.getEnd()
        // move marker to current timecode
        if (EventHub.keyIsPressed('Alt')) {
          this.setStartToTimecode()
        }
        // set timecode to maker position
        else {
          let tc = this.root.millisTotalToTimeline(this.millis)
          this.$root.$emit('timecodeChange', tc)
        }
        this.$root.$emit('markerDown', this.annotationData)
        this.$root.$emit('UIDown', this.activeElName)
      },
      onDownHandleRight () {
        this.checkUnselect()
        this.select()
        this.draggedEl = 'handleRight'
        this.isDragged = true
        // move marker to current timecode
        if (EventHub.keyIsPressed('Alt')) {
          this.setEndToTimecode()
        }
        // set timecode to maker position
        else {
          let tc = this.root.millisTotalToTimeline(this.millis + this.duration)
          this.$root.$emit('timecodeChange', tc)
        }
        this.$root.$emit('markerDown', this.annotationData)
        this.$root.$emit('UIDown', this.activeElName)
      },
      onDownLeftMain () {
        return false
      },
      onDownRight () {
        this.checkUnselect()
        this.select()
        this.$root.$emit('markerDown', this.annotationData)
        this.$root.$emit('markerDownRight', this.annotationData)
      },
      onDoubleClick () {
        if (this.duration <= 0) {
          this.durationCached = this.root.absToMillis(100)
        }
        else {
          this.durationCached = 0
        }
        this.save()
      },
      select () {
        this.isSelected = true
        this.$store.commit('swimLane/setSelectedAnnotation', this.annotationData)
      },
      onUnselect () {
        if (!this.isDragged && this.isSelected) {
          this.isSelected = false
          this.isHovered = false
        }
      },
      onUpdate () {
        if (this.isDragged || this.isSelected) {
          let tc
          if (this.draggedEl === 'background') {
            let pos = this.root.getInputPositionAbsGraph().x - this.inputOffsetX
            tc = this.root.getTimecodeFromGraphPositionAbs(pos)
            this.millisCached = this.root.millisTimelineToTotal(tc)
            if (this.isDragged) this.$root.$emit('timecodeChange', tc)
          }
          else if (this.draggedEl === 'handleLeft') {
            let pos = this.root.getInputPositionAbsGraph().x - this.inputOffsetX
            tc = this.root.getTimecodeFromGraphPositionAbs(pos)
            this.millisCached = Math.min(this.root.millisTimelineToTotal(tc), this.endCached)
            this.durationCached = Math.max(this.endCached - this.millisCached, 0)
            if (this.isDragged) this.$root.$emit('timecodeChange', tc)
          }
          else if (this.draggedEl === 'handleRight') {
            tc = this.root.getTimecodeFromInputPosition()
            let tct = this.root.getTimecodeFromInputPositionTotal()
            let max = this.root.timeline.duration - this.root.millisTotalToTimeline(this.millis)
            this.durationCached = this.root.restrict(tct - this.millis, 0, max)
            if (this.isDragged) this.$root.$emit('timecodeChange', tc)
          }
          this.save()
        }
      },
      onMarkerContextAction (action) {
        if (this.isSelected) console.log(action)
      },
      onContext (event) {
        event.preventDefault()
      },
      onGlobalUp () {
        this.isDragged = false
        this.inputOffsetX = 0
        this.clearCache()
      },
      clearCache () {
        this.endCached = 0
        this.millisCached = undefined
        this.durationCached = undefined
      },
      setStartToTimecode () {
        if (this.isSelected) {
          this.endCached = this.getEnd()
          this.millisCached = this.root.getTimecodeCurrentTotal()
          this.durationCached = Math.max(this.endCached - this.millisCached, 0)
          this.save()
        }
      },
      setEndToTimecode () {
        if (this.isSelected) {
          let tc = this.root.getTimecodeCurrentTotal()
          let e = tc - this.millis
          if (e < 0) {
            this.millisCached = tc
          }
          this.durationCached = Math.max(e, 0)
          this.save()
        }
      },
      moveToTimecode () {
        if (this.isSelected) {
          this.millisCached = this.root.getTimecodeCurrentTotal()
          this.save()
        }
      },
      getEnd () { // returns total
        return this.millis + this.duration
      },
      checkUnselect () {
        this.$root.$emit('markerUnselect')
      },
      save () {
        if (this.annotationData.target.selector) {
          const target = this.root.map.getInterval(
            DateTime.fromMillis(this.millis),
            this.duration ? DateTime.fromMillis(this.millis + this.duration) : undefined)
          this.annotationData.target.selector = target.selector
          this.$root.$emit('annotationChange', this.annotationData)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
