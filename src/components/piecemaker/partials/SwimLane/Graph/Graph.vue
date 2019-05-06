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
      svg.graph-lane-wrapper(ref="graphLaneWrapper", overflow="visible", , :y="y")
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
        // y: 0,
        inputOffset: {
          x: 0,
          y: 0
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
        return this.width * this.scrollPosition.x * -1
      },
      y () {
        return this.height * this.scrollPosition.y * -1
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
      this.$root.$on('globalUp', this.onGlobalUp)
      this.$root.$on('laneModeChanged', this.onLaneModeChange)
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
        this.$root.$emit('graphDown')
      },
      onGraphBackgroundDown () {
        if (!EventHub.keyIsPressed(' ')) {
          this.inputOffset = this.root.getInputPositionAbsGraph()
          this.$root.$emit('UIDown', 'graphBackground')
          this.$root.$emit('markerUnselect')
        }
      },
      onGraphMouseWheel (event) {
        // CTRL/STRG pressed => scroll horizotnally regardless of scroll direction
        if (EventHub.keyIsPressed('Control')) {
          let d = (Math.abs(event.deltaX) > Math.abs(event.deltaY)) ? event.deltaX : event.deltaY
          d = this.root.toRelGraphX(d) * -1
          this.$root.$emit('scrollPositionChange', {x: this.scrollPosition.x + d})
        }
        // Zoom
        if (EventHub.keyIsPressed('Alt')) {
          // TODO seems more complicated than initially thought D=
          // let d = event.deltaY
          // let f = this.root.toRelGraphX(d) / 10
          // this.$root.$emit('scaleFactorChange', this.scaleFactor + (f * -1))
          // this.$root.$emit('scrollPositionChange', this.scrollPosition.x + (f * -1))
        }
        // standard scroll
        else {
          let x = this.root.toRelGraphX(event.deltaX) * -1
          let y = this.root.toRelGraphY(event.deltaY) * -1
          this.$root.$emit('scrollPositionChange', {x: this.scrollPosition.x + x, y: this.scrollPosition.y + y})
        }
      },
      trigger (event, args) {
        this.$root.$emit(event, args)
      },
      // TODO implement also y movement on dragging
      update () {
        let x = Math.min(this.root.inputPosition.x - this.inputOffset.x, this.width - this.root.el.width)
        let y = Math.min(this.root.inputPosition.y - this.inputOffset.y, this.height - this.root.el.height)
        this.$root.$emit('scrollPositionChange', {x: this.root.toRelGraphX(x) * -1, y: this.root.toRelGraphY(y) * -1})
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
