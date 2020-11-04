<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.media.list.title')")

      content-paragraph(:position="'first'")
        data-table(ref="listTable", :config="config", :title="'routes.piecemaker.media.list.title'", :hide-bottom="false")
</template>

<script>
  import { mapGetters } from 'vuex'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'
  import parseURI from 'mbjs-data-models/src/lib/parse-uri'

  export default {
    components: {
      Headline,
      ContentBlock,
      ContentParagraph
    },
    data () {
      const _this = this
      return {
        data: undefined,
        config: {
          request: async function ({ filter, pagination }) {
            _this.$refs.listTable.loading = true
            const results = await _this.$store.dispatch('media/find', [filter, pagination])
            _this.config.pagination.page = results.page
            _this.config.pagination.rowsNumber = results.rowsNumber
            _this.config.pagination.rowsPerPage = results.rowsPerPage
            // results.rows = results.rows.sort((a, b) => {
            //   if (typeof a.title === 'string') return a.title.localeCompare(b.title)
            // })
            _this.$refs.listTable.loading = false
            return results.rows
          },
          filterMethod (rows) {
            return rows
          },
          pagination: {
            sortBy: 'title',
            descending: false,
            page: 1,
            rowsNumber: 0,
            rowsPerPage: 10
          },
          columns: [
            {
              name: 'title',
              label: _this.$t('labels.title'),
              field: 'title',
              sortable: true,
              filter: true,
              style: 'white-space: normal'
            }
          ],
          actions: [
            {
              type: 'live-annotate',
              title: 'buttons.annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.media.annotate_generic',
                params: { id: parseURI(item.id).id, mode: 'local' } })
            }
          ]
        }
      }
    },
    async mounted () {
      this.$root.$emit('setBackButton', '/piecemaker')
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    }
  }
</script>
