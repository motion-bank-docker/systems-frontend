<template lang="pug">
  svg.sl-graph-wrapper(
    @mousedown="onGraphDown ($event)",
    width="100%", height="100%"
    )
    // Graph
      svg.sl-graph(
        @mousewheel="onGraphMouseWheel ($event)",
        // :width="width", height="100%"
        // :x="x", y="0"
        )
    svg.sl-graph(
      @mousewheel="onGraphMouseWheel ($event)",
      width="100%", height="100%",
      :x="x", y="0"
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
      svg.graph-lane-wrapper(ref="graphLaneWrapper", overflow="visible", y="50")
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
        return this.calculateX()
      },
      width () {
        return this.root.el.width / this.scaleFactor
      }
    },
    async mounted () {
      EventHub.$on('globalUp', this.onGlobalUp)
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
          this.calculateX()
        }
      },
      onGraphMouseWheel (event) {
        if (EventHub.keyIsPressed('Control')) {
          let d = (Math.abs(event.deltaX) > Math.abs(event.deltaY)) ? event.deltaX : event.deltaY
          d = this.root.toRelGraph(d) * -1
          EventHub.$emit('scrollPositionChange', this.root.scrollPosition.x + d)
        }
      },
      trigger (event, args) {
        EventHub.$emit(event, args)
      },
      calculateX () {
        return this.width * this.scrollPosition.x * -1
      },
      update () {
        let p = Math.min(this.root.inputPosition.x - this.inputOffset.x, this.width - this.root.el.width)
        EventHub.$emit('scrollPositionChange', this.root.toRelGraph(p) * -1)
      },
      onGlobalUp () {
        this.inputOffset = {x: 0, y: 0}
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
