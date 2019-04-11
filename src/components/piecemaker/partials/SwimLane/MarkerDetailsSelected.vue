<template lang="pug">
  // q-list.sl-marker-details-selected(color="dark")
  //
    div
    // previous or next entry
      .q-mb-sm
        q-icon(name="keyboard_arrow_left")
        q-icon(name="keyboard_arrow_right")
  q-list.q-pa-none(color="dark", no-border)
    template(v-if="annotationData")
      q-item.q-pa-none.items-start.q-pb-md( v-for="(value, key) in annotationData" )
        q-item-side.q-pa-none(:class="{'q-caption': resizable}") {{ key }}
        q-item-main.q-pa-none.q-pr-md(:class="{'q-caption': resizable}") {{ value }}
    template(v-else)
      q-item.q-pa-none.items-start
        q-item-side.q-pa-none(:class="{'q-caption': resizable}") {{ $t('labels.no_selection') }}
</template>

<script>
  import { EventHub } from './EventHub'
  import { DateTime } from 'luxon'

  export default {
    props: ['root', 'resizable'],
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
      // EventHub.$on('markerUnselect', this.onMarkerUnselect)
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

  .q-list-header
    min-height none!important

  .q-item
    min-height auto!important
</style>
