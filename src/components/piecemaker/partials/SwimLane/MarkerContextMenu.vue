<template lang="pug">
  // TODO: BUG: mouse events not working on .q-list and .q-item
  .sl-marker-context-menu.no-select.list.popup-shadow(
    @mouseleave="onLeave ($event)",
    @mousedown="onLeave ($event)",
    :class="annotationData ? 'is-visible' : ''",
    :style="{top: px(top), left: px(left)}"
    )
    .list-button( v-for="(value, key) in buttons", @mousedown="onButtonDown (value)" ) {{key}}

</template>

<script>
  // import { EventHub } from './EventHub'
  // import { DateTime } from 'luxon'

  export default {
    props: ['root'],
    data () {
      return {
        annotationData: null,
        // width: 350,
        top: 0,
        left: 0,
        offset: {
          x: 15,
          y: 15
        },
        // TODO: TEMP
        buttons: {
          'Move start to timecode': 'MarkerAction_StartToTimecode',
          'Move end to timecode': 'MarkerAction_EndToTimecode'
          // 'Focus on this annotation': 'focus on marker action',
          // 'Delete': 'focus on marker action',
          // 'Edit': 'focus on marker action'
        }
      }
    },
    computed: {
      isOpen () {
        return this.annotationData
      }
    },
    async mounted () {
      this.$root.$on('markerDownRight', this.onOpen)
      // this.calculatePosition()
    },
    beforeDestroy () {
      this.$root.$off('markerDownRight', this.onOpen)
    },
    methods: {
      onOpen (annotationData) {
        this.annotationData = annotationData
        this.calculatePosition()
      },
      onLeave () {
        this.annotationData = null
      },
      onButtonDown (event) {
        this.$root.$emit(event)
      },
      calculatePosition () {
        if (this.annotationData) {
          this.top = this.root.inputPosition.clientY - this.$el.clientHeight + this.offset.y
          let x = this.root.inputPosition.clientX - this.offset.x
          this.left = this.root.restrict(x, 0, this.root.el.bounds.right - this.$el.clientWidth - 2)
        }
        else {
          this.top = -99999
          this.left = -99999
        }
      },
      px (v) {
        return v + 'px'
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import 'swimLane'

  .sl-marker-context-menu
    position: fixed
    z-index: 101
    background: black
    visibility: hidden
    padding: 10px 0
    .list-button
      line-height: 30px
      padding: 0 40px 0 40px
      color: white
      cursor: pointer
      &:hover
        background: $primary

  .q-item-side
    width: 100px
</style>
