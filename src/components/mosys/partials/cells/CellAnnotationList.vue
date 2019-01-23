<template lang="pug">

  div.annotation-list(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      template(v-if="video && video.body")

        q-list-header
          q-item {{videoMeta.title}}

        template(v-for="(annot, index) in annotations")
          q-item-separator

          template(v-if="staging && $store.state.auth.user && showAnnotationInput(index)")
            q-item.annotation-input-container
              q-input.annotation-input(type="textarea",
                :max-height="200",
                :min-rows="3"
                style="width:100%",
                v-model="newAnnotationText",
                @keyup.native.enter="handleInputChanged",
                stack-label="Leave Comment")
            q-item-separator

          q-item.annotation
            a(:class="{'active': contextTime && inContextTime(annot, index)}",
              @click.prevent="event => {handleAnnotationClick(event, annot, index)}")
              span.date {{formatDate(annot, index).split(':').slice(1).join(':')}}
              Username.author(:uuid="annot.author")
              span.content {{annot.body.value}}

      template(v-else)
          strong Loading annotations

      q-item-separator

    template(v-else)
      strong Annotation List

</template>

<script>
  import { DateTime } from 'luxon'
  import constants from 'mbjs-data-models/src/constants'
  import Username from 'mbjs-quasar/src/components/partials/Username'
  import VideoTitle from 'mbjs-quasar/src/components/partials/VideoTitle'

  export default {
    components: {
      Username,
      VideoTitle
    },
    props: ['cell', 'display', 'preview', 'messenger'],
    data () {
      return {
        videoUuid: '',
        video: {},
        videoTime: {},
        videoMeta: {},
        contextTime: {},
        annotations: [],
        map: {},
        annotationTimes: [],
        inputIndex: 0,
        newAnnotationText: '',
        staging: process.env.IS_STAGING
      }
    },
    async mounted () {
      const _this = this
      console.log(this.cell)
      this.videoUuid = this.cell.sourceUuid
      try {
        const videoAnnotation = await this.$store.dispatch('annotations/get', this.cell.sourceUuid)
        const meta = await this.$store.dispatch('metadata/get', videoAnnotation)
        if (meta && meta.title) {
          this.videoMeta = meta
        }
      }
      catch (e) {
        console.log('Unable to fetch metadata for annotation')
      }
      this.fetchAnnotations()
      if (this.messenger) {
        this.messenger.$on('video-time-changed', (time, globalTime, origin) => {
          if (origin.type === 'Video' &&
            _this.video.target.id === origin.origin.target.id &&
            _this.videoTime <= globalTime) {
            _this.contextTime = globalTime
            let inputTime = _this.annotationTimes.find(t => {
              return t >= _this.contextTime
            })
            if (inputTime) {
              _this.inputIndex = _this.annotationTimes.indexOf(inputTime)
            }
            else {
              _this.inputIndex = 0
            }
          }
        })
      }
    },
    methods: {
      async handleInputChanged () {
        const _this = this
        const text = this.newAnnotationText && this.newAnnotationText.trim()
        if (text && text.length > 0) {
          let newAnnotation = {
            body: {
              type: 'TextualBody',
              purpose: 'commenting',
              value: text
            },
            target: {
              id: this.video.target.id,
              type: this.video.target.type,
              selector: {
                type: 'Fragment',
                value: DateTime.fromMillis(_this.contextTime).toISO()
              }
            }
          }
          const annotation = await this.$store.dispatch('annotations/post', newAnnotation)
          console.log(annotation)
          _this.fetchAnnotations()
        }
        this.newAnnotationText = ''
      },
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
      formatDate (annot) {
        return DateTime.fromISO(annot.target.selector.value)
          .minus(this.videoTime)
          .toFormat(constants.TIMECODE_FORMAT)
      },
      showAnnotationInput (index) {
        return index === this.inputIndex
      },
      fetchAnnotations () {
        const _this = this
        this.$store.dispatch('annotations/find', { uuid: this.videoUuid })
          .then(result => {
            const videoAnnotation = result.items.shift()
            if (videoAnnotation) {
              _this.video = videoAnnotation
              _this.videoTime = DateTime.fromISO(_this.video.target.selector.value, { setZone: true })
              _this.contextTime = _this.videoTime
              const query = {
                type: constants.MAP_TYPE_TIMELINE,
                uuid: videoAnnotation.target.uuid
              }
              _this.$store.dispatch('maps/find', query)
                .then(result => {
                  const map = result.items.shift()
                  if (map) {
                    _this.map = map
                  }
                })
              const selectorValue = videoAnnotation.target.selector.value
              const startDate = DateTime.fromISO(selectorValue, { setZone: true })
              const endDate = startDate.plus(_this.videoMeta.duration * 1000)
              const endDateISO = endDate.toISO()
              const annotationsQuery = {
                'target.id': videoAnnotation.target.id,
                'target.type': constants.MAP_TYPE_TIMELINE,
                'body.type': 'TextualBody',
                'target.selector.value': {
                  $gte: selectorValue,
                  $lte: endDateISO
                }
              }
              _this.$store.dispatch('annotations/find', annotationsQuery)
                .then(result => {
                  let annotations = result.items.filter(a => {
                    return Date.parse(a.target.selector.value) >= _this.videoTime
                  })
                  annotations = annotations.sort((a, b) => {
                    let tDiff = Date.parse(a.target.selector.value) - Date.parse(b.target.selector.value)
                    if (tDiff === 0) {
                      tDiff = Date.parse(b.created) - Date.parse(a.created)
                    }
                    return tDiff
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

  .annotation

    a
      width 100%

    .date
    .author
      font-size 0.8em
      color lightgray
      padding-right 1em
      float left

    .author
      float right

    .content
      width 100%

  .q-input.annotation-input
    margin-top 0.5em

  .annotation-input-container
    margin-top -0.5em
    margin-bottom -0.5em
    border-left 10px solid #95b4ff

  .annotation-input-container:hover
    background-color #e7e9ff

</style>
