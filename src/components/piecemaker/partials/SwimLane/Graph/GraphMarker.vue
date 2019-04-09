<template lang="pug">
  // TODO: refactor so events don't have to be registered to each element separately
  // ------------------------------------------------------------------------------------------------------ has duration
  svg.sl-marker.pointer(
    v-if="duration > 0 && isVisible"
    @mouseenter="onEnter ($event)",
    @mouseleave="onLeave ($event)",
    @mousedown.right="onDownRight ($event)",
    @contextmenu="onContext ($event)",
    @dblclick="onDoubleClick ($event)",
    :class="'sl-marker-' + annotationData.body.type",
    :x="xRel * 100 + '%'", :y="yTemp",
    height="16", :width="widthRel * 100 + '%'",
    )
    rect.sl-marker-background(
      @mousedown.left="onDownBackground ($event)",
      width="100%", height="100%",
      :fill="fill",
      :opacity="opacity"
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
    :x="xRelCircle * 100 + '%'", :y="yTemp",
    )
    circle.sl-marker.pointer(
      :cx="circleR", :cy="circleR" :r="circleR",
      :fill="fill"
      :opacity="opacity"
      )
    <!--circle.no-event.no-select(v-if="isHovered", :cx="8", :cy="8", fill="rgba(0,0,0,0.3)", r="8")-->
</template>

<script>
  import { EventHub } from '../EventHub'
  import { mapGetters } from 'vuex'

  export default {
    props: ['annotationData', 'index', 'root'],
    data () {
      return {
        draggedEl: null,
        isDragged: false,
        isSelected: false,
        isHovered: false,
        activeElName: 'marker',
        millis: 0,
        duration: 0,
        inputOffsetX: 0,
        endCached: 0,
        handleFill: 'rgba(255,255,255,0.5)',
        circleR: 8,
        colors: {
          'Video': 'tomato',
          'TextualBody': '#57aeff'
        }
      }
    },
    computed: {
      ...mapGetters({
        laneMode: 'swimLaneSettings/getLaneMode'
      }),
      fill () {
        // if (this.isSelected) return 'black'
        // // else if (this.isHovered) return 'black'
        // else {
        //   let t = this.annotationData.body.type
        //   if (t === 'Video') return 'tomato'
        //   else if (t === 'TextualBody') return 'yellow'
        // }
        // if (this.isDragged) return 'blue'
        // else {
        let t = this.annotationData.body.type
        if (this.colors.hasOwnProperty(t)) return this.colors[t]
        else return 'black'
        // }
      },
      opacity () {
        return this.isHovered || this.isSelected ? 1 : 0.5
      },
      xAbs () {
        return this.root.millisTotaltoAbsGraph(this.millis)
      },
      xRel () {
        return this.root.millisTotaltoRelGraph(this.millis)
      },
      xRelCircle () {
        return this.root.millisTotaltoRelGraph(this.millis) - this.root.toRelGraphX(this.circleR)
      },
      widthRel () {
        // return this.root.millistoRelGraph(this.annotationData.body.duration)
        return this.root.millistoRelGraph(this.duration)
      },
      x () {
        return this.xRel * 100 + '%'
      },
      isVisible () {
        // return this.root.isVisible({left: this.xAbs, right: this.xAbs, offset: 10})
        return true
      },
      yTemp () {
        // return (this.index % 7) * 50 + 25 + ((Math.floor(this.index / 7) % 2) * 25)
        // return (this.index % 2) * 25 + 25 + ((Math.floor(this.index / 2) % 2) * 25)
        if (this.laneMode === 'expand') return (this.index + 1) * 25
        if (this.laneMode === 'collapse') return 25
        return 0
      }
    },
    async mounted () {
      this.millis = this.annotationData.target.selector ? this.root.isoToMillis(this.annotationData.target.selector.value) : 0
      // TODO: TEMP: save duration to test resizing per drag and shift + click
      this.duration = this.annotationData.body.duration || 0
      EventHub.$on('globalUp', this.onGlobalUp)
      EventHub.$on('componentMove', this.onComponentMove)
      EventHub.$on('markerUnselect', this.onUnselect)
      EventHub.$on('markerUpdate', this.onUpdate)
      // EventHub.$on('markerContextAction', this.onMarkerContextAction)
      EventHub.$on('MarkerAction_StartToTimecode', this.setStartToTimecode)
      EventHub.$on('MarkerAction_EndToTimecode', this.setEndToTimecode)
      // for collision detection
      this.root.registerMarker(this)
      this.$parent.addRow()
    },
    beforeDestroy () {
      // EventHub.$off('globalUp', this.onGlobalUp)
      // EventHub.$off('componentMove', this.onComponentMove)
      // EventHub.$off('markerUnselect', this.onUnselect)
      // EventHub.$off('markerUpdate', this.onUpdate)
    },
    methods: {
      trigger (event, msg) {
        EventHub.$emit(event, msg)
      },
      onEnter () {
        this.isHovered = true
        EventHub.$emit('markerEnter', this.annotationData)
      },
      onLeave () {
        this.isHovered = false
        EventHub.$emit('markerLeave', this.annotationData)
      },
      onDownBackground (event) {
        this.checkUnselect()
        if (this.duration > 0) this.inputOffsetX = event.clientX - this.$el.getBoundingClientRect().left
        this.draggedEl = 'background'
        this.isDragged = true
        this.isSelected = true
        // move marker to current timecode
        if (EventHub.keyIsPressed('Alt') && this.duration === 0) {
          this.millis = this.root.getTimecodeCurrentTotal()
        }
        // set timecode to maker position
        else if (!EventHub.keyIsPressed('Shift')) {
          let tc = this.root.millisTotalToTimeline(this.millis)
          EventHub.$emit('timecodeChange', tc)
        }
        EventHub.$emit('markerDown', this.annotationData)
        EventHub.$emit('UIDown', this.activeElName)
      },
      onDownHandleLeft () {
        this.checkUnselect()
        this.draggedEl = 'handleLeft'
        this.isDragged = true
        this.isSelected = true
        this.endCached = this.getEnd()
        // move marker to current timecode
        if (EventHub.keyIsPressed('Alt')) {
          this.setStartToTimecode()
        }
        // set timecode to maker position
        else {
          let tc = this.root.millisTotalToTimeline(this.millis)
          EventHub.$emit('timecodeChange', tc)
        }
        EventHub.$emit('markerDown', this.annotationData)
        EventHub.$emit('UIDown', this.activeElName)
      },
      onDownHandleRight () {
        this.checkUnselect()
        this.draggedEl = 'handleRight'
        this.isDragged = true
        this.isSelected = true
        // move marker to current timecode
        if (EventHub.keyIsPressed('Alt')) {
          this.setEndToTimecode()
        }
        // set timecode to maker position
        else {
          let tc = this.root.millisTotalToTimeline(this.millis + this.duration)
          EventHub.$emit('timecodeChange', tc)
        }
        EventHub.$emit('markerDown', this.annotationData)
        EventHub.$emit('UIDown', this.activeElName)
      },
      onDownLeftMain () {
        return false
      },
      // TODO: move this to onContext ???
      onDownRight () {
        this.checkUnselect()
        this.isSelected = true
        EventHub.$emit('markerDown', this.annotationData)
        EventHub.$emit('markerDownRight', this.annotationData)
      },
      onDoubleClick () {
        if (this.duration <= 0) {
          this.duration = this.root.absToMillis(100)
        }
        else {
          this.duration = 0
        }
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
            this.millis = this.root.millisTimelineToTotal(tc)
            if (this.isDragged) EventHub.$emit('timecodeChange', tc)
          }
          else if (this.draggedEl === 'handleLeft') {
            let pos = this.root.getInputPositionAbsGraph().x - this.inputOffsetX
            tc = this.root.getTimecodeFromGraphPositionAbs(pos)
            this.millis = Math.min(this.root.millisTimelineToTotal(tc), this.endCached)
            this.duration = Math.max(this.endCached - this.millis, 0)
            if (this.isDragged) EventHub.$emit('timecodeChange', tc)
          }
          else if (this.draggedEl === 'handleRight') {
            tc = this.root.getTimecodeFromInputPosition()
            let tct = this.root.getTimecodeFromInputPositionTotal()
            let max = this.root.timeline.duration - this.root.millisTotalToTimeline(this.millis)
            this.duration = this.root.restrict(tct - this.millis, 0, max)
            if (this.isDragged) EventHub.$emit('timecodeChange', tc)
          }
        }
      },
      onMarkerContextAction (action) {
        if (this.isSelected) console.log(action)
      },
      onContext (event) {
        event.preventDefault()
      },
      onGlobalUp () {
        // TODO: save millis only on release
        // TODO: only call this function for markers in SwimLane.activeMarkers (to be implemented)
        this.isDragged = false
        this.inputOffsetX = 0
        this.endCached = 0
      },
      setStartToTimecode () {
        if (this.isSelected) {
          this.endCached = this.getEnd()
          this.millis = this.root.getTimecodeCurrentTotal()
          this.duration = Math.max(this.endCached - this.millis, 0)
        }
      },
      setEndToTimecode () {
        if (this.isSelected) {
          let tc = this.root.getTimecodeCurrentTotal()
          let e = tc - this.millis
          if (e < 0) {
            this.millis = tc
          }
          this.duration = Math.max(e, 0)
        }
      },
      getEnd () { // returns total
        return this.millis + this.duration
      },
      checkUnselect () {
        if (!EventHub.keyIsPressed('Shift')) EventHub.$emit('markerUnselect')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
