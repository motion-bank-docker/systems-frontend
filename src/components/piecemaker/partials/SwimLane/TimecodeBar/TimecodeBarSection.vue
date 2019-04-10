<template lang="pug">
  svg.timecode-bar-section(v-if="!root.isDragged(hideIfDragged)", :x="x", y="0")
    line.stroke-black(x1="0", y1="0", x2="0", y2="100%")
    text.no-select.fill-light.q-caption(y="18", x="10") {{ time }}
</template>

<script>
  import { EventHub } from '../EventHub'
  import { mapGetters } from 'vuex'

  export default {
    props: ['index', 'numSections', 'root'],
    data () {
      return {
        // xCached: 0,
        xMapped: 0,
        // hideIfDragged: ['navHandleBackground', 'navBackground', 'navHandleLeft', 'navHandleRight', 'graphBackground']
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
        return this.root.millisToText(ms, 'HH:mm:ss')
      },
      x () {
        return this.calculateX()
      }
    },
    async mounted () {
      EventHub.$on('afterComponentMounted', this.calculateX)
    },
    watch: {
      // scrollPosition () {
      //   this.calculateX()
      // },
      // scaleFactor () {
      //   console.log('current time viewport', this.root.getVisibleTimeFrame())
      // }
    },
    methods: {
      calculateX () {
        let sp = this.scrollPosition.x || 0
        let m, x
        let compWidth = this.root.el.width
        let elWdith = compWidth / (this.numSections - 1)
        // width + index position + scroll position
        x = elWdith * (this.numSections - this.index) + this.root.toAbsGraphX(sp)
        // modulo
        x %= compWidth + elWdith + 1
        // map to root component width
        m = compWidth - x
        // this.xCached = c
        this.xMapped = m
        return m
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
