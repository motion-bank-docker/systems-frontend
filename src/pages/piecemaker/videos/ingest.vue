<template lang="pug">
  full-screen
    h4 Ingest and sync videos on LTC
    .row
      q-select.col-md-12(v-model="selectedTimeline", :options="timelines", dark)
    .row
      uploader.col-md-12(dark, :url="url", @finish="onFinish", allowed="video/*", :headers="headers", :multiple="true")
</template>

<script>
  // import { DateTime } from 'luxon'
  import { FullScreen, Uploader } from 'mbjs-quasar/src/components'
  export default {
    components: {
      FullScreen,
      Uploader
    },
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
      this.$root.$on('extraction-result', result => {
        _this.extractResults.push(result)
        console.log('result', _this.extractResults, result)
        _this.checkResults()
      })
      let result = await this.$store.dispatch('maps/find', {type: 'Timeline'})
      this.timelines = result.items.map(timeline => { return { label: timeline.title, value: timeline.uuid } })
    },
    methods: {
      async onFinish (responses) {
        console.log(this.selectedTimeline, responses)
        const responseKeys = Object.keys(responses)
        for (let key of responseKeys) {
          const detail = {
            source: responses[key].file
          }
          const payload = {
            extraction: { source: responses[key].file, detail }
          }
          const job = await this.$store.dispatch('timecodes/post', payload)
          console.log(job)
          this.extractJobs.push(job)
        }
      },
      checkResults () {
        if (this.extractResults.length === this.extractJobs.length) {
          console.log('extraction complete', this.extractResults)
        }
      }
    }
  }
</script>
