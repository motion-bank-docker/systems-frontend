<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small)
    .row
      .col-md-12
        q-btn(@click="exportCSV", :label="exportLabel")
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import { ObjectUtil } from 'mbjs-utils'

  export default {
    data () {
      return {
        timeline: undefined,
        downloadURL: undefined,
        exportLabel: this.$t('buttons.export_timeline_csv'),
        type: constants.mapTypes.MAP_TYPE_TIMELINE
      }
    },
    async mounted () {
      this.$root.$emit('setBackButton', '/piecemaker/timelines')
      this.$q.loading.show()
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.uuid)
      this.$q.loading.hide()
    },
    methods: {
      async exportCSV () {
        if (this.downloadURL) return this.downloadURL.click()

        this.$q.loading.show()
        const { items } = await this.$store.dispatch('annotations/find', {
          'target.id': this.timeline.id
        })
        const entries = [[
          'Value',
          'Purpose',
          'Start',
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
            annotation.author.name || 'Unknown',
            annotation.body.type,
            annotation._created,
            annotation._updated || ''
          ]
        }))
        let csvData = 'data:text/csv;charset=utf-8,'
        entries.forEach(entry => {
          csvData += entry.map(v => `"${v.toString().replace('"', '\\"')}"`).join(';') + '\r\n'
        })
        const download = document.createElement('a')
        download.setAttribute('href', encodeURI(csvData))
        download.setAttribute('download', `${ObjectUtil.slug()}${this.timeline._uuid}.csv`)
        this.exportLabel = this.$t('buttons.download_csv')
        this.downloadURL = download
        document.body.appendChild(this.downloadURL)
        this.$q.loading.hide()
      }
    }
  }
</script>
