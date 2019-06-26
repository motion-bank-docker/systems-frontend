<template lang="pug">
  svg.timecode-bar-section(:x="x", y="0")
    line.stroke-black(x1="0.5", y1="0", x2="0.5", y2="100%")
    text.no-select.fill-light.q-caption(y="14", x="8") {{ time }}
</template>

<script>
  // import { EventHub } from '../EventHub'
  import { mapGetters } from 'vuex'

  export default {
    props: ['index', 'numSections', 'root', 'millis', 'width', 'parentWidth'],
    data () {
      return {
        xMapped: 0,
        hideIfDragged: ['navHandleLeft', 'navHandleRight']
      }
    },
    computed: {
      ...mapGetters({
        scrollPosition: 'swimLaneSettings/getScrollPosition',
        scaleFactor: 'swimLaneSettings/getScaleFactor'
      }),
      time () {
        let p = this.xMapped + this.root.toAbsGraphX(this.scrollPosition.x)
        let ms = this.root.getTimecodeFromGraphPositionAbs(p)
        let r = Math.floor(ms / this.millis) * this.millis
        // TODO implement time() so that it is not called everytime the scrollPosition changes
        return this.root.millisToText(r, 'HH:mm:ss')
        // TODO display timecodes larger than one day => days, weeks, months, years?
        // return this.root.millisToText(this.millis, 'HH:mm:ss')
      },
      x () {
        return this.calculateX()
      }
    },
    async mounted () {
      this.$root.$once('afterComponentMounted', this.calculateX)
    },
    watch: {
    },
    methods: {
      calculateX () {
        let sp = this.scrollPosition.x || 0
        let m, x
        let compWidth = this.root.el.width
        let offset = (this.numSections - 1) * this.width - compWidth
        // width + index position + scroll position
        x = this.width * (this.numSections - this.index) + this.root.toAbsGraphX(sp) - offset
        // modulo
        x %= this.parentWidth + 1
        // map to root component width
        m = compWidth - x
        this.xMapped = m
        return Math.floor(m) || 0
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
