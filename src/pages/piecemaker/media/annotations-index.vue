<template lang="pug">

  full-screen(:class="{'mobile-padding': isMobile}")

    .row
      content-block(:position="'first'", :columnsMd="6")
        headline(v-if="metadata", :content="metadata.title")

    template(slot="header-buttons")
      q-btn.text-grey-3(@click="exportItems", :color="exportColor") {{ exportLabel }}

    // ------------------------------------------------------------------------------------------------------ data table
    .annotations-table.q-mt-lg
      data-table(v-if="query", :config="config", path="annotations", :query="query", @start="onStart", ref="annotationTable")

    // --------------------------------------------------------------------------------------------------- preview media
    .video-player-wrap.fixed-top-right.bg-dark.shadow-6(
    :class="[{'full-width': isMobile}]",
    style="top: 58px;")
      .player(:class="[{'opacity-1': ready}]")
        media-player(
          v-if="video",
          :src="video.body.source.id",
          @ready="playerReady($event)",
          @time="onPlayerTime($event)")
      .absolute-top-left.fit.justify-center.row.items-center(v-if="!ready")
        q-spinner(size="30px")

</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import parseURI from 'mbjs-data-models/src/lib/parse-uri'
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import exportCSV from '../../../lib/export/csv'

  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'

  export default {
    name: 'Annotations-Index',
    components: {
      Headline,
      ContentBlock
    },
    data () {
      const _this = this
      return {
        isMobile: this.$q.platform.is.mobile,
        ready: false,
        playerTime: 0.0,
        query: undefined,
        video: undefined,
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
              // field: row => row.target.selector.value
              field: row => row.target.selector._valueMillis
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
        /*
        const millis = DateTime.fromISO(selector, { setZone: true }).toMillis() -
          DateTime.fromISO(this.video.target.selector.value, { setZone: true }).toMillis()
         */
        const millis = selector -
          DateTime.fromMillis(this.video.target.selector._valueMillis, { setZone: true })
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
        let filename = `${ObjectUtil.slug(this.timeline.title)}-${this.metadata.title}`
        if (filter) filename += `-${filter}`
        const download = await exportCSV(items.filter(i => i.body.value.indexOf(filter) > -1), filename)
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

  .mobile-padding
    padding-top calc(100vw / calc(16 / 9))
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
