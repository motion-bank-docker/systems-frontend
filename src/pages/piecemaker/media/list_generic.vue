<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.media.list.title')")

      content-paragraph(:position="'first'")
        data-table(ref="listTable", :config="config", :title="'routes.piecemaker.media.list.title'")
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
          request: function () {
            return _this.$store.dispatch('media/find')
          },
          pagination: {
            sortBy: 'title',
            descending: false
          },
          columns: [
            {
              name: 'title',
              label: _this.$t('labels.title'),
              field: 'title',
              sortable: true,
              filter: true
            }
          ],
          actions: [
            {
              type: 'live-annotate',
              title: 'buttons.annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.media.annotate',
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
