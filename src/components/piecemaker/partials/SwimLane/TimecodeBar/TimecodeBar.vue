<template lang="pug">
  svg.timecode-bar.pointer(
    @mousedown="onTimecodeBarDown ($event)",
    @mouseover="trigger('UIEnter', 'timecodeBar')",
    @mouseleave="trigger('UILeave', 'timecodeBar')",
    height="20", width="100%",
    y="24"
    )
    rect.fill-medium(width="100%", height="100%")
    timecode-bar-section(
      v-for="(n, index) in numSections",
      :index="index",
      :numSections="numSections",
      :millis="sectionDuration",
      :width="sectionWidth",
      :parentWidth="width",
      :root="root"
      )

    // popping up rectangle
    svg.timecode-pointer.no-event(
      v-if="(root.isFocused('timecodeBar') && !root.isDragged()) || root.isDragged('timecodeBar')",
      :x="timecodeMarkerHover.x", y="0"
      )
      path.fill-neutral(d="M 0 0 L 10 0 L 0 10 L 0 0")
</template>

<script>
  import TimecodeBarSection from './TimecodeBarSection'
  // import { EventHub } from '../EventHub'
  import { mapGetters } from 'vuex'

  export default {
    props: ['root', 'offset'],
    components: {
      TimecodeBarSection
    },
    data () {
      return {
        timecodeMarkerHover: {
          x: 0
        },
        timecodeMarkerCurrent: {
          x: 0 // %: 1 - 100
        }
      }
    },
    computed: {
      ...mapGetters({
        timecodeCurrent: 'swimLaneSettings/getTimecode',
        scaleFactor: 'swimLaneSettings/getScaleFactor'
      }),
      numSections () {
        let s = Math.ceil(this.root.el.width / this.sectionWidth) || 0
        return s + 1
      },
      timecodeMarkerCurrentX () {
        if (this.timecodeCurrent) return this.root.millisToRelGraph(this.timecodeCurrent) * 100 + '%'
        return 0
      },
      sectionWidth () {
        let w = this.root.millisToAbsGraph(this.sectionDuration)
        return w
      },
      width () {
        return this.numSections * this.sectionWidth
      },
      sectionDuration () {
        let tf = this.root.getVisibleTimeFrame().millis
        if (tf < 1000) return 200 // 1 sec => 200 ms
        else if (tf < 60000) return 15000 // 1 min => 15 sec
        else if (tf < 600000) return 60000 // 10 min => 1 min
        else if (tf < 1800000) return 300000 // 30 min => 5 min
        else if (tf < 7200000) return 900000 // 2 std => 15 min
        else if (tf < 18000000) return 1800000 // 5 std => 30 min
        else return 3600000 // => 1 std
      }
    },
    watch: {
      scaleFactor () {
        // TODO: calculate "good" time span for each section to display
        // let tf = this.root.getVisibleTimeFrame().millis
        // let s = Math.floor(tf / 1000)
        // let m = Math.floor(tf / 1000 / 60)
        // let mr = m % (tf / 1000 / 60) // not working why?
        // let h = Math.floor(tf / 1000 / 60 / 60)
        // console.log(h, m, s, 'mr', mr)
      }
    },
    async mounted () {
      this.$root.$on('inputPositionChange', this.onInputPositionChange)
      // console.log(this.root.getVisibleTimecodeRange())
    },
    beforeDestroy () {
      this.$root.$off('inputPositionChange', this.onInputPositionChange)
    },
    methods: {
      onTimecodeBarDown () {
        let tc = this.root.getTimecodeFromInputPosition()
        this.$root.$emit('timecodeChange', tc)
        this.$root.$emit('UIDown', 'timecodeBar')
        // console.log(Math.round(this.root.getVisibleTimecodeRange().length / 5))
      },
      trigger (event, args) {
        this.$root.$emit(event, args)
      },
      onInputPositionChange (p) {
        this.timecodeMarkerHover.x = p.x
      }
    }
  }

</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
