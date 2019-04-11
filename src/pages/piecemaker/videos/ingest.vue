<template lang="pug">
  full-screen
    h4 Ingest and sync videos on LTC
    .row
      q-select.col-md-12(v-model="selectedTimeline", :options="timelines", dark)
    .row
      uploader.col-md-12(dark, :url="url", @finish="onFinish", allowed="video/*", :headers="headers", :multiple="true")
</template>

<script>
  import { DateTime } from 'luxon'
  import path from 'path'
  export default {
    data () {
      return {
        timelines: [],
        selectedTimeline: undefined,
        url: `${process.env.TRANSCODER_HOST}/uploads`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        extractJobs: [],
        extractResults: []
      }
    },
    async mounted () {
      const _this = this
      this.$root.$on('extraction-complete', message => {
        _this.extractResults.push(message)
        console.debug('extraction-complete', _this.extractResults, _this.extractJobs, message)
        _this.checkResults()
      })
      let result = await this.$store.dispatch('maps/find', {type: 'Timeline'})
      this.timelines = result.items.map(timeline => { return { label: timeline.title, value: timeline._uuid } })
    },
    watch: {
      async selectedTimeline (val) {
        if (val) await this.getTimecodeAnnotations()
      }
    },
    methods: {
      async getTimecodeAnnotations () {
        const result = await this.$store.dispatch('annotations/find', {
          'target.id': this.selectedTimeline.id,
          'body.type': 'Audio',
          'body.purpose': 'linking'
        })
        this.timecodeAnnotations = result.items
        console.debug('timecode annotations', this.timecodeAnnotations)
      },
      async onFinish (responses) {
        console.debug('upload responses', this.selectedTimeline, responses)
        const responseKeys = Object.keys(responses)
        for (let key of responseKeys) {
          const detail = {
            source: responses[key].file,
            timeline: this.selectedTimeline.id,
            title: path.basename(responses[key].originalName, path.extname(responses[key].originalName))
          }
          const payload = {
            extraction: { source: responses[key].file },
            detail
          }
          const job = await this.$store.dispatch('timecodes/post', payload)
          console.debug('created extraction job', job)
          this.extractJobs.push(job)
        }
      },
      timecodeToMillis (timecode, fps = 25) {
        const parts = timecode.split(':').map(val => parseInt(val))
        const frameTime = 1000 / fps
        let millis = 0
        millis += parts[0] * 60 * 60 * 1000
        millis += parts[1] * 60 * 1000
        millis += parts[2] * 1000
        millis += parts[3] * frameTime
        return millis
      },
      async checkResults () {
        if (this.extractResults.length === this.extractJobs.length) {
          console.log('extraction complete', this.extractResults)
          const rootTime = DateTime.fromMillis(this.timecodeAnnotations[0].target.selector._valueMillis)
          for (let message of this.extractResults) {
            const frameTime = this.timecodeToMillis(message.result[0][2])
            const refDate = rootTime.plus(frameTime).minus(message.result[0][0] * 1000)
            console.debug('sync data', refDate.toISO(), rootTime.toISO(), message.result[0][2], message.result[0][0])
            const conversion = {
              source: message.detail.source,
              scale: {
                width: 1280,
                height: 720
              },
              metadata: {
                title: message.detail.title
              }
            }
            const detail = {
              deleteOriginal: true,
              target: {
                type: 'Timeline',
                id: message.detail.timeline,
                selector: {
                  type: 'Fragment',
                  value: refDate.toISO()
                }
              }
            }
            const job = await this.$store.dispatch('conversions/post', { conversion, detail })
            console.debug('created conversion job', job)
          }
        }
      }
    }
  }
</script>
