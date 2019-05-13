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
    text.fill-neutral.no-event.no-select.q-caption(:x="root.toAbsGraphX(scrollPosition.x) + 10", y="14")
      | {{ getLabel(type) }} ({{ annotations.length }})
    graph-marker(
      v-for="(a, index) in annotations",
      :annotationData="a",
      :key="a._uuid",
      :index="index",
      :root="root"
      )

</template>

<script>
  import GraphMarker from './GraphMarker'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      GraphMarker
    },
    props: ['annotations', 'type', 'index', 'root', 'annotationsBefore'],
    data () {
      return {
        rowHeight: 20
      }
    },
    computed: {
      ...mapGetters({
        scrollPosition: 'swimLaneSettings/getScrollPosition',
        laneMode: 'swimLaneSettings/getLaneMode',
        expandedMode: 'swimLaneSettings/getExpandedMode'
      }),
      y () {
        return this.expandedMode ? (this.index + this.annotationsBefore) * this.rowHeight : this.index * 2 * this.rowHeight
      },
      height () {
        return this.expandedMode ? this.rowHeight * (this.annotations.length + 1) : this.rowHeight * 2
      }
    },
    async mounted () {
    },
    beforeDestroy () {
    },
    watch: {
    },
    methods: {
      getLabel (val) {
        let valMatch = val.match(/[A-Z][a-z]+|[0-9]+/g)
        if (valMatch !== null) {
          let valNew = valMatch.join(' ').replace(/\s+/g, '_').toLowerCase()
          return this.$t('labels.' + valNew)
        }
        else {
          return val
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
