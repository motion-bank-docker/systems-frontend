<template lang="pug">
  q-list.sl-marker-details-hover.popup-shadow.bg-grey.no-select.no-event.q-px-md.q-pt-md(
    :class="render",
    :style="{top: px(top), left: px(left), width: px(width)}",
    dark
    )
    q-item.q-pa-none.items-start.q-caption(v-for="(value, key) in annotationData")
      q-item-side.q-pa-none {{ key }}
      q-item-main.q-pa-none {{ value }}

</template>

<script>
  import { EventHub } from './EventHub'
  import { DateTime } from 'luxon'

  export default {
    props: ['root'],
    data () {
      return {
        annotationData: null,
        width: 350
      }
    },
    computed: {
      top () {
        // TODO: should be bound to this.$el.clientHeight:
        // ISSUE: Sometimes data is filled in one tick too late, so value jumps from 0 to X when already visible
        // return (this.annotationData) ? this.$parent.inputPosition.clientY - this.$el.clientHeight - 15 : -99999
        // 228
        return (this.annotationData) ? this.$parent.inputPosition.clientY - 298 - 15 : -99999
        // return 100
      },
      left () {
        return (this.annotationData) ? this.$parent.restrict(this.$parent.inputPosition.clientX, 0, this.$parent.el.bounds.right - this.width) : -99999
      },
      render () {
        // console.log()
        return this.annotationData && !this.$parent.isDragged() ? '' : 'is-transparent'
      }
    },
    async mounted () {
      EventHub.$on('markerEnter', this.onMarkerEnter)
      EventHub.$on('markerLeave', this.onMarkerLeave)
      EventHub.$on('globalUp', this.onMarkerLeave)
    },
    beforeDestroy () {
      // EventHub.$off('markerEnter', this.onMarkerEnter)
      // EventHub.$off('markerLeave', this.onMarkerLeave)
    },
    methods: {
      onMarkerEnter (annotationData) {
        let ms = this.$parent.millisTotalToTimeline(DateTime.fromISO(annotationData.target.selector.value).toMillis())
        this.annotationData = {
          'Created': DateTime.fromISO(annotationData.created).toFormat('yyyy LLL dd, HH:mm:ss.SSS'),
          'Start': this.root.millisToText(ms),
          'Duration': annotationData.body.duration ? this.root.millisToText(annotationData.body.duration) : '-',
          'Author': annotationData.author.name,
          'Purpose': annotationData.body.purpose,
          'Body Type': annotationData.body.type,
          'Body Value': annotationData.body.value
        }
      },
      onMarkerLeave () {
        this.annotationData = null
      },
      px (v) {
        return v + 'px'
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import 'swimLane'

  $delay = 200ms

  .sl-marker-details-hover
    position: fixed
    z-index: 100
    /*background: orangered*/
    /*color: black*/
    /*padding: 5px*/
    -webkit-transition: opacity 200ms
    -moz-transition: opacity 200ms
    -ms-transition: opacity 200ms
    -o-transition: opacity 200ms
    transition: opacity 200ms
    -webkit-transition-delay: $delay
    -moz-transition-delay: $delay
    -ms-transition-delay: $delay
    -o-transition-delay: $delay
    transition-delay: $delay

  .sl-marker-details-hover.is-transparent
    -webkit-transition-delay: 0ms
    -moz-transition-delay: 0ms
    -ms-transition-delay: 0ms
    -o-transition-delay: 0ms
    transition-delay: 0ms
    -webkit-transition-duration: 0ms
    -moz-transition-duration: 0ms
    -ms-transition-duration: 0ms
    -o-transition-duration: 0ms
    transition-duration: 0ms

  .q-item-side
    width: 100px

  .q-item
    min-height none
</style>
