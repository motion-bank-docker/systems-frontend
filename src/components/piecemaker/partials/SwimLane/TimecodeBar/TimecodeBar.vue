<template lang="pug">
  svg.timecode-bar.pointer(
    @mousedown="onTimecodeBarDown ($event)",
    @mouseover="trigger('UIEnter', 'timecodeBar')",
    @mouseleave="trigger('UILeave', 'timecodeBar')",
    height="25", width="100%",
    y="25"
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
  import { EventHub } from '../EventHub'
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
        },
        sectionDuration: 600000
      }
    },
    computed: {
      ...mapGetters({
        timecodeCurrent: 'swimLaneSettings/getTimecode',
        scaleFactor: 'swimLaneSettings/getScaleFactor'
      }),
      numSections () {
        let s = Math.ceil(this.root.el.width / this.sectionWidth)
        return s + 1
      },
      timecodeMarkerCurrentX () {
        if (this.timecodeCurrent) return this.root.millistoRelGraph(this.timecodeCurrent) * 100 + '%'
        return 0
      },
      sectionWidth () {
        let w = this.root.millistoAbsGraph(this.sectionDuration)
        return w
      },
      width () {
        return this.numSections * this.sectionWidth
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
      EventHub.$on('inputPositionChange', this.onInputPositionChange)
      // console.log(this.root.getVisibleTimecodeRange())
    },
    methods: {
      onTimecodeBarDown () {
        let tc = this.root.getTimecodeFromInputPosition()
        EventHub.$emit('timecodeChange', tc)
        EventHub.$emit('UIDown', 'timecodeBar')
        // console.log(Math.round(this.root.getVisibleTimecodeRange().length / 5))
      },
      trigger (event, args) {
        EventHub.$emit(event, args)
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
