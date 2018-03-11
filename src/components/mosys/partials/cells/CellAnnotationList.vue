<template lang="pug">

  div.annotation-list(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
        q-list-header
          q-item
            video-title(:source="video.body.source")
        template(v-for="(annot, index) in annotations")
          q-item-separator
          q-item
            a(:class="{'active': contextTime && inContextTime(annot, index)}",
              @click.prevent="event => {handleAnnotationClick(event, annot, index)}") {{formatDate(annot, index)}} - {{annot.body.value}} –
              username(:uuid="annot.author")

    template(v-else)
      strong Annotation List

</template>

<script>
  import { QItem, QItemSeparator, QListHeader } from 'quasar-framework'
  import { DateTime } from 'luxon'
  import constants from '../../../../lib/constants'
  import Username from '../../../shared/partials/Username'
  import VideoTitle from '../../../shared/partials/VideoTitle'

  export default {
    components: {
      QItem,
      QItemSeparator,
      QListHeader,
      Username,
      VideoTitle
    },
    props: ['cell', 'display', 'preview', 'messenger'],
    data () {
      return {
        videoUuid: '',
        video: {},
        videoTime: {},
        contextTime: {},
        annotations: [],
        map: {},
        annotationTimes: []
      }
    },
    mounted () {
      const _this = this
      this.videoUuid = this.cell.content
      if (this.messenger) {
        this.messenger.$on('video-time-changed', (time, globalTime, origin) => {
          if (origin.type === 'Video' &&
            _this.video.target.id === origin.origin.target.id &&
            _this.videoTime <= globalTime) {
            _this.contextTime = globalTime
          }
        })
      }
    },
    watch: {
      videoUuid () {
        const _this = this
        this.$store.dispatch('annotations/find', {query: {'uuid': this.videoUuid}})
          .then(videoAnnotations => {
            const videoAnnotation = videoAnnotations.shift()
            if (videoAnnotation) {
              _this.video = videoAnnotation
              _this.videoTime = Date.parse(_this.video.target.selector.value)
              _this.$store.dispatch('maps/find', {query: {'uuid': videoAnnotation.target.id}})
                .then(maps => {
                  const map = maps.shift()
                  if (map) {
                    _this.map = map
                  }
                })
              _this.$store.dispatch('annotations/find', {query: {'target.id': videoAnnotation.target.id, 'body.purpose': 'commenting'}})
                .then(annotations => {
                  annotations = annotations.sort((a, b) => {
                    return Date.parse(a.target.selector.value) - Date.parse(b.target.selector.value)
                  })
                  _this.annotations = annotations
                  _this.annotationTimes = []
                  annotations.forEach(a => {
                    _this.annotationTimes.push(Date.parse(a.target.selector.value))
                  })
                })
            } // TODO: else, show not found?
          })
      }
    },
    methods: {
      handleAnnotationClick (event, annot, index) {
        this.messenger.$emit('annotation-trigger', annot, this.annotationTimes[index])
      },
      inContextTime (annot, index) {
        const dist = this.annotationTimes[index] - this.contextTime
        return Math.abs(dist) < 2000 // 2 secs?
      },
      contextTimeDiff (annot, index) {
        return this.annotationTimes[index] - this.contextTime
      },
      formatDate (annot, index) {
        return DateTime
          .fromISO(annot.target.selector.value)
          .minus(this.videoTime)
          .toFormat(constants.TIMECODE_FORMAT)
      }
    }
  }
</script>

<style scoped lang="stylus">

  .annotation-list
    width 100%
    height 100%
    overflow auto

  .annotation-list.display-full
    background-color white

  .annotation-list.display-preview
    color #666

  a.active
    color orangered

  .q-list-header
    padding-top 0.5em
    padding-left 0

    .q-item
      font-size 1em
      line-height 1.5em

</style>
