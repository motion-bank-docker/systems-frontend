<template lang="pug">
  svg.sl-graph-wrapper(
    @mousewheel="onGraphMouseWheel ($event)",
    @mousedown="onGraphDown ($event)",
    @mouseenter="root.disableWindowScroll()",
    @mouseleave="root.enableWindowScroll()"
    width="100%", height="100%"
    )
    // Graph
    svg.sl-graph(
      ref="graph",
      :width="width",
      :height="height",
      :x="x", :y="49"
      )
      // Graph Background
      rect.sl-graph-background.fill-faded(
        @mousedown="onGraphBackgroundDown ($event)",
        :class="root.isDragged('graphBackground') ? 'grabbing' : 'grab'",
        width="100%", height="100%"
        )
      // zoomRect
      zoom-rect(:root="root")
      // -------------------------------------------------------------------------------------------------- Marker Lanes
      svg.graph-lane-wrapper(ref="graphLaneWrapper", overflow="visible", , :y="scrollY ")
        // TODO: rethink lane logic:
        graph-lane(
          v-for="(annotations, type, index) in annotationsGrouped",
          :annotations="annotations",
          :type="type",
          :key="type",
          :index="index",
          :root="root"
          )
</template>

<script>
  import { mapGetters } from 'vuex'
  import { EventHub } from '../EventHub'
  import GraphLane from './GraphLane'
  import ZoomRect from './ZoomRect'

  export default {
    name: 'Graph',
    props: ['annotationsGrouped', 'root'],
    components: {
      GraphLane,
      ZoomRect
    },
    data () {
      return {
        y: 0,
        inputOffset: {
          x: 0
        },
        scrollY: 0,
        laneList: []
      }
    },
    computed: {
      ...mapGetters({
        timecodeCurrent: 'swimLaneSettings/getTimecode',
        scaleFactor: 'swimLaneSettings/getScaleFactor',
        scrollPosition: 'swimLaneSettings/getScrollPosition'
      }),
      x () {
        return this.width * this.scrollPosition.x * -1
      },
      width () {
        return this.root.el.width / this.scaleFactor
      },
      height () {
        let h = 0
        for (let lane of this.laneList) {
          h += lane.height
        }
        return Math.max(this.root.el.height, h + 50)
      }
    },
    async mounted () {
      EventHub.$on('globalUp', this.onGlobalUp)
      EventHub.$on('laneModeChanged', this.onLaneModeChange)
    },
    beforeDestroy () {
    },
    watch: {
      annotationsGrouped () {
        this.laneList = []
      }
    },
    methods: {
      onGraphDown () {
        EventHub.$emit('graphDown')
      },
      onGraphBackgroundDown () {
        if (!EventHub.keyIsPressed(' ')) {
          this.inputOffset.x = this.root.getInputPositionAbsGraph().x
          EventHub.$emit('UIDown', 'graphBackground')
          EventHub.$emit('markerUnselect')
        }
      },
      onGraphMouseWheel (event) {
        // CTRL/STRG pressed => scroll horizotnally regardless of scroll direction
        if (EventHub.keyIsPressed('Control')) {
          let d = (Math.abs(event.deltaX) > Math.abs(event.deltaY)) ? event.deltaX : event.deltaY
          d = this.root.toRelGraph(d) * -1
          EventHub.$emit('scrollPositionChange', {x: this.root.scrollPosition.x + d})
        }
        // else if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        //   let d = event.deltaX
        //   d = this.root.toRelGraph(d) * -1
        //   EventHub.$emit('scrollPositionChange', this.root.scrollPosition.x + d)
        // }
        // standard scroll
        else {
          this.scrollY = this.root.restrict(this.scrollY + event.deltaY, (this.height - this.root.el.height) * -1, 0)
          let d = event.deltaX
          d = this.root.toRelGraph(d) * -1
          EventHub.$emit('scrollPositionChange', {x: this.root.scrollPosition.x + d, y: 0})
        }
      },
      trigger (event, args) {
        EventHub.$emit(event, args)
      },
      // TODO implement also y movement on dragging
      update () {
        let p = Math.min(this.root.inputPosition.x - this.inputOffset.x, this.width - this.root.el.width)
        EventHub.$emit('scrollPositionChange', {x: this.root.toRelGraph(p) * -1, y: 0})
      },
      onGlobalUp () {
        this.inputOffset = {x: 0, y: 0}
      },
      onLaneModeChange () {
        this.scrollY = 0
      },
      // interim solution
      // TODO: rethink lane logic:
      // Anton's suggestion: different types of lanes (title lane, marker lane, marker group lane, etc.)
      // all lanes have the same height but different purposes. just the index is need to determine the y coordinate
      registerLane (lane) {
        this.laneList.push(lane)
      },
      getPreviousLane (idx) {
        if (idx > 0 && this.laneList.length) return this.laneList[idx - 1]
        return {height: 0, y: 0}
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'

</style>
