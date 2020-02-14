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
        @data="playerLoaded",
        @time="onPlayerTime($event)")
      q-spinner.q-ma-md.absolute-bottom-right(v-if="video && !ready", size="30px")

    .annotations-table.q-mt-lg
      .q-pb-xl
        q-table(dark, ref="annotationTable", row-key="annotation", title="Piecemaker Index", :data="annotations",
          :columns="columns", @request="request", :pagination.sync="pagination", :filter="filter")
          template(slot="top-right", slot-scope="props")
            q-search(hide-underline, v-model="filter", dark, :readonly="loading")
          q-td(slot="body-cell-start", slot-scope="props", :props="props")
            .q-py-sm.text-grey-6(@click="onStart(props.row)", style="cursor: pointer;") {{ returnDatetime(props.row) }}
          q-td(slot="body-cell-annotation", slot-scope="props", :props="props")
            editable-table-data(:data="props", :key="props.row.uuid")
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import parseURI from 'mbjs-data-models/src/lib/parse-uri'
  import { DateTime } from 'luxon'
  import exportCSV from '../../../lib/export/csv'
  import EditableTableData from '../../../components/shared/forms/EditableTableData'
  import sift from 'sift'

  export default {
    name: 'AnnotationsTable',
    components: {
      EditableTableData
    },
    data () {
      const _this = this
      return {
        loading: false,
        ready: false,
        loaded: false,
        playerTime: 0.0,
        query: {},
        videos: [],
        video: undefined,
        selector: undefined,
        filter: '',
        annotations: [],
        player: undefined,
        timeline: undefined,
        metadata: undefined,
        downloadURL: undefined,
        exportLabel: _this.$t('buttons.export'),
        exportColor: 'faded',
        pagination: {
          sortBy: 'start',
          descending: false,
          page: 1,
          rowsPerPage: 0,
          rowsNumber: 0
        },
        columns: [
          {
            name: 'start',
            label: _this.$t('labels.starting_point'),
            sortable: false,
            // sort: _this.$sort.onDateValue,
            field: row => row,
            align: 'left'
          },
          {
            name: 'annotation',
            label: _this.$t('labels.annotations'),
            field: row => row.body.value,
            align: 'left',
            sortable: false
            // filter: true
          },
          {
            name: 'video',
            label: _this.$t('labels.video'),
            field: row => row.videoTitle,
            align: 'left',
            sortable: false,
            style: 'max-width: 200px; white-space: normal'
            // filter: true
          }
        ]
      }
    },
    methods: {
      returnDatetime (val) {
        return val.target ? DateTime.fromISO(val.target.selector.value).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS) : ''
      },
      async request ({ filter }) {
        if (!filter || filter.length < 3) return []
        this.loading = true
        const result = await this.$store.dispatch('annotations/find', {
          'body.type': 'TextualBody',
          'body.value': new RegExp(filter, 'ig')
        })
        const timelines = result.items.reduce((ids, timeline) => {
          if (ids.indexOf(timeline.target.id) === -1) ids.push(timeline.target.id)
          return ids
        }, [])
        let length = timelines.length, i = 0
        this.videos = []
        for (let id of timelines) {
          i++
          const timeline = await this.$store.dispatch('maps/get', parseURI(id).uuid)
          const videos = await this.$store.dispatch('annotations/find', {
            'target.id': id,
            'target.type': constants.MAP_TYPE_TIMELINE,
            'body.type': 'Video'
          })
          let vlength = videos.items.length, vi = 0
          videos.items = videos.items.map(v => v.toObject())
          for (let video of videos.items) {
            vi++
            await this.getVideoMetadata(video, timeline)
            this.$q.loading.show({ message: `Loaded Timeline ${i}/${length} - Video ${vi}/${vlength}` })
          }
        }
        for (let i in result.items) {
          const row = result.items[i]
          const dt = DateTime.fromISO(row.target.selector.value, { setZone: true })
          const urls = this.videos.filter(video => {
            return dt >= video.start && dt < video.end
          })
          row.videoTitle = urls.map(v => `${v.title} (${v.timeline.title})`).join('; ')
          row.videoURL = urls.map(v => v.url).shift()
          row.videoType = urls.map(v => v.type).shift()
          row.videoSelector = urls.map(v => v.start.toISO()).shift()
          row.videoData = urls.shift()
        }
        this.$q.loading.hide()
        this.annotations = result.items
        this.loading = false
        return result.items
      },
      async getVideoMetadata (video, timeline = undefined) {
        const existing = this.videos.filter(sift({
          url: video.body.source.id
        }))
        let entry
        if (existing.length) entry = existing.shift()
        const metadata = await this.$store.dispatch('metadata/get', video)
        if (!entry) {
          const start = DateTime.fromISO(video.target.selector.value, {setZone: true})
          entry = {
            start,
            end: metadata.duration ? start.plus(metadata.duration * 1000) : start,
            timeline,
            title: metadata.title,
            url: video.body.source.id,
            type: video.body.source.type
          }
          this.videos.push(entry)
        }
        return entry
      },
      playerReady (player) {
        this.player = player
        this.ready = true
        this.setTime()
      },
      playerLoaded () {
        this.setTime()
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
      onStart (annotation) {
        this.selector = annotation.target ? annotation.target.selector.value : undefined
        if (this.ready && this.video && this.video.body.source.id === annotation.videoURL) {
          this.setTime()
          return
        }
        if (this.player) {
          this.player.reset()
          this.video = undefined
          // this.player = undefined
        }
        // this.ready = false
        this.video = {
          target: {
            selector: {
              value: annotation.videoSelector
            }
          },
          body: {
            source: {
              id: annotation.videoURL,
              type: annotation.videoType
            }
          }
        }
      },
      setTime () {
        if (this.selector) {
          const millis = DateTime.fromISO(this.selector, { setZone: true }).toMillis() -
            DateTime.fromISO(this.video.target.selector.value, { setZone: true }).toMillis()
          const targetMillis = millis * 0.001
          if (this.playerTime !== targetMillis) this.player.currentTime(targetMillis)
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
        const filter = this.$refs.annotationTable.filter
        let filename = `piecemaker-index`
        if (filter) filename += `-${filter}`
        const download = await exportCSV(this.annotations, filename)
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
