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
      :x="x", :y="44"
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
          :annotationsBefore="getAnnotationsBefore(index)",
          :type="type",
          :key="type",
          :index="index",
          :root="root",
          :ref="'lane-' + index",
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
        scrollPosition: 'swimLaneSettings/getScrollPosition',
        expandedMode: 'swimLaneSettings/getExpandedMode'
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
      heightCollapsed () {
        return (this.numLanes * 20) + 20
      },
      heightExpanded () {
        return (this.numLanes * 20) + this.numAnnotations * 20
      },
      height () {
        let base = this.expandedMode ? this.heightExpanded : this.heightCollapsed
        return Math.max(this.root.el.height, base + 44)
      },
      numLanes () {
        return Object.keys(this.annotationsGrouped).length
      },
      numAnnotations () {
        let n = 0
        for (let key in this.annotationsGrouped) {
          if (this.annotationsGrouped.hasOwnProperty(key)) {
            n += this.annotationsGrouped[key].length
          }
        }
        return n
      }
    },
    mounted () {
      this.$root.$on('globalUp', this.onGlobalUp)
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
      getAnnotationsBefore (idx) {
        let n = 0
        let _idx = 0
        for (let key in this.annotationsGrouped) {
          if (this.annotationsGrouped.hasOwnProperty(key) && _idx < idx) {
            n += this.annotationsGrouped[key].length
            _idx++
          }
          else break
        }
        // console.log('n:', n, 'for:', idx)
        return n
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'

</style>
