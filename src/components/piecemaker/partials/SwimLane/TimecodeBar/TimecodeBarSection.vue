<template lang="pug">
  svg.timecode-bar-section(v-if="!root.isDragged(['navHandleLeft', 'navHandleRight'])", :x="xMapped", y="0")
    line.stroke-black(x1="0", y1="0", x2="0", y2="100%")
    text.no-select.fill-light(y="18", x="10") {{time}}
</template>

<script>
  import { EventHub } from '../EventHub'
  import { mapGetters } from 'vuex'

  export default {
    props: ['index', 'numSections', 'root'],
    data () {
      return {
        xCached: 0,
        xMapped: 0
      }
    },
    computed: {
      ...mapGetters({
        scrollPosition: 'swimLaneSettings/getScrollPosition',
        scaleFactor: 'swimLaneSettings/getScaleFactor'
      }),
      time () {
        let p = this.xMapped + this.root.toAbsGraph(this.scrollPosition.x)
        let ms = this.root.getTimecodeFromGraphPositionAbs(p)
        return this.root.millisToText(ms, 'HH:mm:ss')
      }
    },
    async mounted () {
      EventHub.$on('afterComponentMounted', this.calculateX)
    },
    watch: {
      scrollPosition () {
        this.calculateX()
      },
      scaleFactor () {

      }
    },
    methods: {
      calculateX () {
        let s = this.scrollPosition.x || 0
        let w = this.root.el.width
        let r = w / (this.numSections - 1)
        this.xCached = r * (this.numSections - this.index) + this.root.toAbsGraph(s)
        this.xCached %= w + r + 1
        this.xMapped = w - this.xCached
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
