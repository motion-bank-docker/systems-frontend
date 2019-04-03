<template lang="pug">
  // q-list.sl-marker-details-selected(color="dark")
  q-list(color="dark")
    template(v-if="annotationData")
      q-item( v-for="(value, key) in annotationData" )
        q-item-side {{ key }}
        q-item-main {{ value }}
</template>

<script>
  import { EventHub } from '../SwimLane/EventHub'
  import { DateTime } from 'luxon'

  export default {
    props: ['root'],
    data () {
      return {
        annotationData: null
      }
    },
    computed: {
      top () {
        return -75
      }
    },
    async mounted () {
      EventHub.$on('markerUnselect', this.onMarkerUnselect)
      EventHub.$on('markerDown', this.onMarkerDown)
    },
    beforeDestroy () {
      // EventHub.$off('markerUnselect', this.onMarkerUnselect)
      // EventHub.$off('markerDown', this.onMarkerDown)
    },
    methods: {
      onMarkerDown (annotationData) {
        let ms = this.$parent.millisTotalToTimeline(DateTime.fromISO(annotationData.target.selector.value).toMillis())
        this.annotationData = {
          'Created': DateTime.fromISO(annotationData.created).toFormat('yyyy LLL dd, HH:mm:ss.SSS'),
          'Start': this.root.millisToText(ms),
          'Duration': annotationData.body.duration ? this.root.millisToText(annotationData.body.duration) : '–',
          'Author': annotationData.author.name,
          'Purpose': annotationData.body.purpose,
          'Body Type': annotationData.body.type,
          'Body Value': annotationData.body.value
        }
      },
      onMarkerUnselect () {
        this.annotationData = null
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import 'swimLane'

  .sl-marker-details-selected
    height: 298px /* TEMP quick fix */

  .q-item-side
    width: 100px
</style>
