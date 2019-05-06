<template lang="pug">
  // zoomRect
  rect.zoom-rect.fill-black.no-event.no-select(
    v-if="start !== null",
    :x="x * 100 + '%'", y="0",
    :width="width  * 100 + '%'", height="100%"
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
    computed: {
      x () {
        if (this.start !== null) return Math.min(this.start, this.end)
        return 0
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
</style>
