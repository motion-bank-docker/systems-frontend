<template lang="pug">
  full-screen
    h4 Add signal annotation to timeline
    .row
      q-select.col-md-12(v-model="selectedTimeline", :options="timelines", dark)
    <!--.row-->
      <!--q-slider(v-model="volume", :min="0.0", :max="1.0", :step="0.01", label, dark)-->
    .row
      q-select.col-md-12(v-model="selectedSignal", :options="signals", dark)
      audio(ref="audio", v-if="selectedSignal", :src="selectedSignal", preload="auto")
    .row
      q-btn(@click="addSignalStart", v-if="!isPlaying && selectedSignal && selectedTimeline", color="primary") Add Signal
      q-btn(@click="stop", v-if="isPlaying", color="primary") Stop Signal
</template>

<script>
  import { DateTime } from 'luxon'
  import path from 'path'
  export default {
    data () {
      return {
        isPlaying: false,
        // volume: 0.8,
        signals: [],
        timelines: [],
        selectedTimeline: undefined,
        selectedSignal: undefined
      }
    },
    async mounted () {
      let result = await this.$store.dispatch('maps/find', {type: 'Timeline'})
      this.timelines = result.items.map(timeline => { return { label: timeline.title, value: timeline.uuid } })
      result = await this.$store.dispatch('timecodes/listSignals')
      this.signals = result.map(signal => { return { label: path.basename(signal), value: signal } })
    },
    methods: {
      async addSignalStart () {
        this.isPlaying = true
        this.$refs.audio.play()
        const annotation = {
          target: {
            type: 'Timeline',
            id: `${process.env.TIMELINE_BASE_URI}${this.selectedTimeline}`,
            selector: {
              type: 'Fragment',
              value: DateTime.local().toISO()
            }
          },
          body: {
            type: 'Audio',
            purpose: 'linking',
            source: {
              id: this.selectedSignal,
              type: 'audio/wav'
            }
          }
        }
        await this.$store.dispatch('annotations/post', annotation)
      },
      stop () {
        this.isPlaying = false
        this.$refs.audio.pause()
        this.selectedTimeline = undefined
        this.selectedSignal = undefined
      }
    }
  }
</script>
