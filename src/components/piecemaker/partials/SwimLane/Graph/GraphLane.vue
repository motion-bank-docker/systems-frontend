<template lang="pug">
  svg.sl-graph-lane(
    :class="['type-' + type, 'index-' + index]",
    :y ="y",
    :height="height"
    )
    line.stroke-dark.no-event.no-select(
      x1="0", y1="0",
      x2="100%", y2="0"
      )
    text.fill-neutral.no-event.no-select(:x="root.toAbsGraphX(scrollPosition.x) + 10", y="18") {{type + ': ' +  annotations.length}}
    graph-marker(
      v-for="(a, index) in annotations",
      :annotationData="a",
      :key="a.uuid",
      :index="index",
      :root="root"
      )

</template>

<script>
  // import { EventHub } from '../SwimLane/EventHub'
  // import { DateTime } from 'luxon'
  import GraphMarker from './GraphMarker'
  import { mapGetters } from 'vuex'
  // import {EventHub} from '../EventHub'

  export default {
    components: {
      GraphMarker
    },
    props: ['annotations', 'type', 'index', 'root'],
    data () {
      return {
        rows: 0,
        rowHeight: 25,
        yCached: 0
      }
    },
    computed: {
      ...mapGetters({
        scrollPosition: 'swimLaneSettings/getScrollPosition',
        laneMode: 'swimLaneSettings/getLaneMode'
      }),
      height () {
        if (this.laneMode === 'expand') return this.rowHeight * this.rows + this.rowHeight
        if (this.laneMode === 'collapse') return this.rowHeight * 2
        return 0
      },
      y () {
        // return (this.index + 1) * 50
        // if (this.laneMode === 'expand') return this.$parent.getPreviousLane(this.index).height + 50
        // if (this.laneMode === 'collapse') return 25
        // return 0
        const prevLane = this.$parent.getPreviousLane(this.index)
        if (prevLane) return prevLane.y + prevLane.height
        return 0
      }
    },
    async mounted () {
      this.$parent.registerLane(this)
    },
    beforeDestroy () {
    },
    methods: {
      addRow () {
        this.rows++
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
