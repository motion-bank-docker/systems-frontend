<template lang="pug">
  full-screen
    back-button(slot="backButton")
    template(slot="form-title")
      | {{ metadata.title }}
    template(slot="header-buttons")
      // q-btn.text-grey-3(@click="", flat, style="border: 1px solid #333;") Export

    .video-player-wrap.fixed-bottom-right.z-top
      .player.q-pa-md(:class="[{'opacity-1': ready}]")
        video-player(
        v-if="video",
        :src="video.body.source.id",
        @ready="playerReady($event)",
        @time="onPlayerTime($event)")
      q-spinner.q-ma-md.absolute-bottom-right(v-if="!ready", size="30px")

    .annotations-table.q-mt-lg
      .q-pb-xl
        data-table(v-if="query", :config="config", path="annotations", :query="query", @start="onStart")
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import parseURI from 'mbjs-data-models/src/lib/parse-uri'
  import { DateTime } from 'luxon'

  export default {
    name: 'AnnotationsTable',
    data () {
      const _this = this
      return {
        ready: false,
        playerTime: 0.0,
        query: undefined,
        video: undefined,
        player: undefined,
        timeline: undefined,
        metadata: undefined,
        config: {
          pagination: {
            sortBy: 'start',
            descending: false
          },
          columns: [
            {
              name: 'start',
              label: _this.$t('labels.starting_point'),
              sortable: true,
              sort: _this.$sort.onDateValue,
              field: row => row.target.selector.value
            },
            {
              name: 'annotation',
              label: _this.$t('labels.annotations'),
              field: row => row.body.value,
              sortable: true,
              filter: true
            }
          ]
        }
      }
    },
    async mounted () {
      if (this.$route.params.id) {
        this.$q.loading.show()
        await this.getVideo()
        this.$q.loading.hide()
      }
    },
    methods: {
      playerReady (player) {
        this.player = player
        this.ready = true
      },
      onPlayerTime (seconds) {
        this.playerTime = seconds
      },
      baseSelector () {
        if (!this.video) return DateTime.local().toISO()
        return DateTime.fromISO(this.video.target.selector.value, { setZone: true })
          .plus(this.playerTime * 1000)
          .toISO()
      },
      onStart (selector) {
        const millis = DateTime.fromISO(selector, { setZone: true }).toMillis() -
          DateTime.fromISO(this.video.target.selector.value, { setZone: true }).toMillis()
        const targetMillis = millis * 0.001
        if (this.playerTime !== targetMillis) this.player.currentTime(targetMillis)
      },
      async getVideo () {
        this.video = await this.$store.dispatch('annotations/get', this.$route.params.id)
        this.timeline = await this.$store.dispatch('maps/get', parseURI(this.video.target.id).uuid)
        if (this.video) {
          this.metadata = await this.$store.dispatch('metadata/get', this.video)
        }
        this.query = {
          'target.id': this.timeline.id,
          'target.type': constants.MAP_TYPE_TIMELINE,
          'target.selector.value': { $gte: this.video.target.selector.value },
          'body.type': { $in: ['TextualBody', 'VocabularyEntry'] }
        }
      }
    }
  }
</script>

<style scoped lang="stylus">

  .video-player-wrap
    width 300px
    .player
      opacity 0
      transition opacity ease 750ms

  .opacity-1
    opacity 1!important

</style>

<style lang="stylus">

  .annotations-table
    .q-table-container
      box-shadow none
      border-top 0
    .q-table-top
      border 0
    .q-table
      tbody
        td
          &:first-of-type
            width 1%
            white-space nowrap
        tr
          &:hover
            background-color rgba(255, 255, 255, .0375)
</style>
