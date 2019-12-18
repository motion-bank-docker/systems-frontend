<template lang="pug">
  full-screen
    back-button(slot="backButton")
    template(slot="form-title", v-if="timeline") {{ timeline.title }}
    template(slot="header-buttons")
      q-btn.text-grey-3(@click="exportItems", :color="exportColor") {{ exportLabel }}

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
        data-table(v-if="query", :config="config", path="annotations", :request-transform="requestTransform",
          :query="query", @start="onStart", ref="annotationTable")
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  // import parseURI from 'mbjs-data-models/src/lib/parse-uri'
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import exportCSV from '../../../lib/export/csv'

  export default {
    name: 'AnnotationsTable',
    data () {
      const _this = this
      return {
        ready: false,
        playerTime: 0.0,
        query: undefined,
        videos: [],
        player: undefined,
        timeline: undefined,
        metadata: undefined,
        downloadURL: undefined,
        exportLabel: _this.$t('buttons.export'),
        exportColor: 'faded',
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
            },
            {
              name: 'video',
              label: _this.$t('labels.video'),
              field: row => row.videoURL,
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
        await this.getData()
        this.$q.loading.hide()
      }
    },
    methods: {
      requestTransform (rows) {
        for (let i in rows) {
          const row = rows[i]
          const dt = DateTime.fromISO(row.target.selector.value, { setZone: true })
          const urls = this.videos.filter(video => {
            return dt >= video.start && dt < video.end
          })
          row.videoURL = urls.map(v => `${v.title} (${v.url})`).join('; ')
          row.videoData = urls
        }
        return rows
      },
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
      async getData () {
        this.timeline = await this.$store.dispatch('maps/get', this.$route.params.id)
        const videos = await this.$store.dispatch('annotations/find', {
          'target.id': this.timeline.id,
          'target.type': constants.MAP_TYPE_TIMELINE,
          'body.type': 'Video'
        })
        this.videos = []
        for (let video of videos.items) {
          const metadata = await this.$store.dispatch('metadata/get', video)
          const start = DateTime.fromISO(video.target.selector.value, {setZone: true})
          this.videos.push({
            start,
            end: start.plus(metadata.duration * 1000),
            title: metadata.title,
            url: video.body.source.id
          })
        }
        this.query = {
          'target.id': this.timeline.id,
          'target.type': constants.MAP_TYPE_TIMELINE,
          'body.type': { $in: ['TextualBody', 'VocabularyEntry'] }
        }
      },
      async exportItems () {
        if (this.downloadURL) {
          this.downloadURL.click()
          this.exportLabel = this.$t('buttons.export')
          this.exportColor = 'faded'
          document.body.removeChild(this.downloadURL)
          this.downloadURL = undefined
          return
        }

        this.$q.loading.show()
        const { items } = await this.$store.dispatch('annotations/find', this.query)
        const filter = this.$refs.annotationTable.filter
        let filename = `${ObjectUtil.slug(this.timeline.title)}`
        if (filter) filename += `-${filter}`
        const results = this.requestTransform(items.filter(i => i.body.value.indexOf(filter) > -1))
        const download = await exportCSV(results, filename)
        this.exportLabel = this.$t('buttons.download_csv')
        this.downloadURL = download
        document.body.appendChild(this.downloadURL)
        this.exportLabel = this.$t('buttons.download')
        this.exportColor = 'primary'
        this.$q.loading.hide()
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
