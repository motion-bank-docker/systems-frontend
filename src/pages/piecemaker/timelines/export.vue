<template lang="pug">
  full-screen
    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.timelines.export.title')")
        | {{ $t('routes.piecemaker.timelines.export.caption') }}
      content-paragraph(v-if="timeline")
        p
          strong {{ timeline.title }}
        q-btn(@click="exportCSV", :label="exportLabel")
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import { ObjectUtil } from 'mbjs-utils'

  import PageSubNav from '../../../components/shared/navigation/PageSubNav'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'
  import Headline from '../../../components/shared/elements/Headline'

  export default {
    components: {
      PageSubNav,
      ContentBlock,
      ContentParagraph,
      Headline
    },
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
          const
            parsed = annotation.target.selector.parse(),
            dateTime = parsed['date-time:t'],
            start = Array.isArray(dateTime) ? dateTime[0].toISO() : dateTime.toISO(),
            duration = annotation.target.selector.getDuration()
          return [
            annotation.body.source.id ? annotation.body.source.id : annotation.body.value,
            annotation.body.purpose,
            start,
            duration ? duration.as('seconds') : '',
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
        download.setAttribute('download', `${ObjectUtil.slug(this.timeline.title)}-${this.timeline._uuid}.csv`)
        this.exportLabel = this.$t('buttons.download_csv')
        this.downloadURL = download
        document.body.appendChild(this.downloadURL)
        this.$q.loading.hide()
      }
    }
  }
</script>
