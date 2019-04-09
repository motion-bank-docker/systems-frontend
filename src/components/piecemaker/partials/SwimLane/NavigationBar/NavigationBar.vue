<template lang="pug">
  svg.sl-nav(:height="height", y="0", @dblclick="onDoubleClick ($event)",)
    rect.sl-nav-background.fill-medium(
      @mousedown="onNavBackgroundDown ($event)",
      :class="root.isDragged('navBackground') ? '' : 'pointer'",
      width="100%", height="100%"
      )
    // Nav Handle
    svg.sl-nav-handle( :x="navHandleX", :width="navHandleWidth", :height="height", )
      rect.sl-nav-handle-background.fill-black(
        @mousedown="onNavHandleBackgroundDown ($event)",
        :class="root.isDragged(['navHandleBackground', 'navBackground']) ? 'grabbing' : 'grab'"
        height="100%", width="100%"
        )
      rect.sl-nav-handle-left.ew-resize.fill-faded(
        @mousedown="onNavHandleLeftDown ($event)",
        height="100%", width="10",
        )
      rect.sl-nav-handle-right.ew-resize.fill-faded(
        @mousedown="onNavHandleRightDown ($event)",
        height="100%", width="10",
        :x="navHandleWidth - 10",
        )
    // Nav Handle Timecode Current
    line.sl-nav-timecode-current.stroke-neutral.no-event(
      :x1="timecodeCurrentX", y1="0",
      :x2="timecodeCurrentX", y2="100%",
      )
    rect.no-event.fill-black(x="0", y="24", width="100%", height="1")
    <!--line.no-event.stroke-light(x1="0", x2="100%", y1="25", y2="25")-->
</template>

<script>
  import { EventHub } from '../EventHub'
  import { mapGetters } from 'vuex'

  export default {
    name: 'NavigationBar',
    props: ['root'],
    data () {
      return {
        navHandle: {
          x: 0,
          // TODO: implement differently? Used to determine handle width when left is dragged
          boundRight: 0
        },
        height: 25,
        timecodeMarkerHover: {
          x: 0
        },
        inputOffset: {
          x: 0,
          y: 0
        }
      }
    },
    computed: {
      ...mapGetters({
        timecodeCurrent: 'swimLaneSettings/getTimecode',
        scaleFactor: 'swimLaneSettings/getScaleFactor',
        scrollPosition: 'swimLaneSettings/getScrollPosition'
      }),
      navHandleX () {
        // return this.root.toAbsCompX(this.scrollPosition.x)
        return this.root.toAbsCompX(this.scrollPosition.x)
      },
      navHandleWidth () {
        return this.root.toAbsCompX(this.scaleFactor)
      },
      timecodeCurrentX () {
        if (this.timecodeCurrent) return this.root.millistoRelGraph(this.timecodeCurrent) * 100 + '%'
        return 0
      }
    },
    async mounted () {
      EventHub.$on('globalUp', this.onGlobalUp)
    },
    beforeDestroy () {
    },
    methods: {
      onNavBackgroundDown () {
        this.inputOffset.x = this.navHandleWidth / 2
        let p = this.root.toRelCompX(this.root.inputPosition.x - this.inputOffset.x)
        EventHub.$emit('UIDown', 'navBackground')
        EventHub.$emit('scrollPositionChange', {x: p, y: 0})
      },
      onNavHandleBackgroundDown () {
        this.inputOffset.x = this.root.inputPosition.x - this.navHandleX
        EventHub.$emit('UIDown', 'navHandleBackground')
      },
      onNavHandleLeftDown () {
        this.navHandle.boundRight = this.navHandleX + this.navHandleWidth
        EventHub.$emit('UIDown', 'navHandleLeft')
      },
      onNavHandleRightDown () {
        EventHub.$emit('UIDown', 'navHandleRight')
      },
      onDoubleClick () {
        EventHub.$emit('scaleFactorChange', 1)
        EventHub.$emit('scrollPositionChange', {x: 0, y: 0})
      },
      update () {
        let sp, w, min, max, raw

        if (this.root.isDragged(['navHandleBackground', 'navBackground'])) {
          // scrollPosition
          sp = Math.min(this.root.inputPosition.x - this.inputOffset.x, this.root.el.width - this.navHandleWidth)
        }
        else if (this.root.isDragged('navHandleRight')) {
          // scrollPosition
          sp = this.navHandleX
          // scaleFactor
          min = this.root.toAbsCompX(this.root.scaleFactorMin)
          // max = this.root.el.width - this.navHandleX
          max = this.root.el.width - this.navHandleX
          raw = this.root.inputPosition.x - this.navHandleX
          w = this.root.restrict(raw, min, max)
          EventHub.$emit('scaleFactorChange', this.root.toRelCompX(w))
        }
        else if (this.root.isDragged('navHandleLeft')) {
          // scrollPosition
          max = this.navHandle.boundRight - this.root.toAbsCompX(this.root.scaleFactorMin)
          sp = this.root.restrict(this.root.inputPosition.x, 0, max)
          // scaleFactor
          w = this.navHandle.boundRight - sp
          EventHub.$emit('scaleFactorChange', this.root.toRelCompX(w))
        }
        EventHub.$emit('scrollPositionChange', {x: this.root.toRelCompX(sp), y: 0})
      },
      onGlobalUp () {
        this.inputOffset = {x: 0, y: 0}
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
