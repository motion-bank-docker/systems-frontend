<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })",
      icon="keyboard_backspace", round, small)
    .row
      .col-md-12
        q-btn(@click="exportCSV", :label="exportLabel")
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime, Interval } from 'luxon'

  export default {
    data () {
      return {
        timeline: undefined,
        downloadURL: undefined,
        exportLabel: this.$t('buttons.export_timeline_csv'),
        type: constants.MAP_TYPE_TIMELINE
      }
    },
    async mounted () {
      this.$root.$emit('setBackButton', '/piecemaker/timelines')
      this.$q.loading.show()
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.id)
      this.$q.loading.hide()
    },
    methods: {
      async exportCSV () {
        if (this.downloadURL) return this.downloadURL.click()

        this.$q.loading.show()
        let lastRefDate
        const
          { items } = await this.$store.dispatch('annotations/find', {
            'target.id': this.timeline.id
          })

        const entries = [[
          'Value',
          'Purpose',
          'Start',
          'Start (relative)',
          'Duration (s)',
          'Author',
          'Type',
          'Created',
          'Updated'
        ]].concat(items.sort(this.$sort.onRef).map(annotation => {
          return [
            annotation.body.source.id ? annotation.body.source.id : annotation.body.value,
            annotation.body.purpose,
            annotation.target.selector.value,
            '',
            annotation.body.type === 'Video' ? annotation : '',
            annotation.author.name || 'Unknown',
            annotation.body.type,
            annotation.created,
            annotation.updated || ''
          ]
        }))
        for (let entry of entries) {
          if (entry[6] === 'Video') {
            lastRefDate = DateTime.fromISO(entry[2], { setZone: true })
            const { duration } = await this.$store.dispatch('metadata/get', entry[4])
            entry[4] = duration || ''
          }
          else if (lastRefDate) {
            entry[3] = Interval.fromDateTimes(
              lastRefDate,
              DateTime.fromISO(entry[2], { setZone: true })
            ).toDuration().toFormat(constants.TIMECODE_FORMAT)
          }
        }
        let csvData = 'data:text/csv;charset=utf-8,'
        entries.forEach(entry => {
          csvData += entry.map(v => `"${(v || '').toString().replace('"', '\\"')}"`).join(';') + '\r\n'
        })
        const download = document.createElement('a')
        download.setAttribute('href', encodeURI(csvData))
        download.setAttribute('download', `${ObjectUtil.slug(this.timeline.title)}-${this.timeline.uuid}.csv`)
        this.exportLabel = this.$t('buttons.download_csv')
        this.downloadURL = download
        document.body.appendChild(this.downloadURL)
        this.$q.loading.hide()
      }
    }
  }
</script>
