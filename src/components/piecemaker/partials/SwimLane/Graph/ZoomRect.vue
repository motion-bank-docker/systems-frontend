<template lang="pug">
  // zoomRect
  svg(y="1", :class="{'show': start}")
    rect.zoom-rect.fill-medium.no-event.no-select(
      x="0", y="0",
      :width="left", height="100%"
      )
    rect.zoom-rect.fill-medium.no-event.no-select(
      :x="right", y="0",
      :width="'100%'", height="100%"
      )
</template>

<script>
  // import { mapGetters } from 'vuex'
  import { EventHub } from '../EventHub'

  export default {
    props: ['root'],
    data () {
      return {
        start: null,
        end: null,
        width: 0
      }
    },
    async mounted () {
      this.$root.$on('globalUp', this.onGlobalUp)
      this.$root.$on('graphDown', this.onGraphDown)
      this.$root.$on('inputPositionChange', this.onInputPositionChange)
    },
    beforeDestroy () {
      this.$root.$off('globalUp', this.onGlobalUp)
      this.$root.$off('graphDown', this.onGraphDown)
      this.$root.$off('inputPositionChange', this.onInputPositionChange)
    },
    computed: {
      x () {
        if (this.start !== null) return Math.min(this.start, this.end)
        return 0
      },
      left () {
        return Math.min(this.start, this.end) * 100 + '%'
      },
      right () {
        return Math.max(this.start, this.end) * 100 + '%'
      }
    },
    methods: {
      onGraphDown () {
        if (EventHub.keyIsPressed(' ')) this.start = this.root.getInputPositionRelGraph().x
      },
      onInputPositionChange () {
        if (this.start !== null) {
          this.end = this.root.getInputPositionRelGraph().x
          this.width = Math.abs(this.end - this.start)
        }
      },
      onGlobalUp () {
        if (this.start !== null) {
          this.end = this.root.getInputPositionRelGraph().x
          this.width = Math.abs(this.end - this.start)
          this.$root.$emit('scaleFactorChange', this.width)
          this.$root.$emit('scrollPositionChange', {x: Math.min(this.start, this.end)})
          this.start = null
          this.end = null
          this.width = 0
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
  svg
    opacity: 0
    &.show
      -webkit-transition: opacity 200ms
      -moz-transition: opacity 200ms
      -ms-transition: opacity 200ms
      -o-transition: opacity 200ms
      transition: opacity 200ms
      opacity: 1
</style>
