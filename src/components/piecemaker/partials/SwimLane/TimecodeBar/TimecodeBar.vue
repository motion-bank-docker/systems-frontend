<template lang="pug">
  svg.timecode-bar.pointer(
    @mousedown="onTimecodeBarDown ($event)",
    @mouseover="trigger('UIEnter', 'timecodeBar')",
    @mouseleave="trigger('UILeave', 'timecodeBar')",
    height="25", width="100%",
    y="25"
    )
    rect.fill-medium(width="100%", height="100%")
    timecode-bar-section(v-for="(n, index) in numSections", :index="index", :numSections="numSections", :root="root")
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
    props: ['root'],
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
        timecodeCurrent: 'swimLaneSettings/getTimecode'
      }),
      numSections () {
        return 5
      },
      timecodeMarkerCurrentX () {
        if (this.timecodeCurrent) return this.root.millisToRelGraph(this.timecodeCurrent) * 100 + '%'
        return 0
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
