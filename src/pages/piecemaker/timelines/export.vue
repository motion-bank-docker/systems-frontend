<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })",
      icon="keyboard_backspace", round, small)
    .row
      .col-md-12
        q-btn(@click="exportItems", :label="exportLabel")
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import exportCSV from '../../../lib/export/csv'
  import { ObjectUtil } from 'mbjs-utils'

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
      async exportItems () {
        if (this.downloadURL) return this.downloadURL.click()

        this.$q.loading.show()
        const
          { items } = await this.$store.dispatch('annotations/find', {
            'target.id': this.timeline.id
          })
        const filename = `${ObjectUtil.slug(this.timeline.title)}-${this.timeline.uuid}`
        const download = await exportCSV(items, filename)
        this.exportLabel = this.$t('buttons.download_csv')
        this.downloadURL = download
        document.body.appendChild(this.downloadURL)
        this.$q.loading.hide()
      }
    }
  }
</script>
