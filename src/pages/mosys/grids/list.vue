<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    content-block(:position="'first'")
      headline(:content="$t('routes.mosys.grids.list.title')")

      content-paragraph
        data-table(
        ref="listTable",
        :config="config",
        :title="'routes.mosys.grids.list.title'",
        path="maps",
        :query="query",
        :requestTransform="requestTransform"
        base-path="grids",
        :has-show="true")
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'
  import { deleteHelper } from 'mbjs-quasar/src/lib'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  export default {
    components: {
      Headline,
      ContentBlock,
      ContentParagraph
    },
    data () {
      const _this = this
      return {
        query: { type: constants.mapClasses.MAP_CLASS_GRID },
        requestTransform: async rows => {
          for (let i in rows) {
            const transformed = {}
            const row = rows[i]
            transformed.title = row.title
            transformed.last_updated = row.updated ? row.updated : row.created
            transformed.creator = row.creator ? row.creator.name : _this.$t('labels.unknown_creator')
            transformed._uuid = row._uuid
            transformed.id = row.id
            rows[i] = transformed
          }
          return rows
        },
        config: {
          columns: [
            {
              label: _this.$t('labels.title'),
              field: 'title',
              sortable: true,
              filter: true
            },
            {
              name: 'last_updated',
              label: _this.$t('labels.last_updated'),
              sortable: true,
              sort: _this.$sort.onDateValue,
              field: 'last_updated',
              format: val => DateTime.fromISO(val)
                .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
            },
            {
              name: 'creator',
              label: _this.$t('labels.creator'),
              field: 'creator',
              sortable: true,
              filter: true
            }
          ],
          actions: [
            {
              type: 'show',
              title: 'routes.mosys.grids.buttons.show',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'mosys.grids.show', params: { uuid: item._uuid } })
            },
            {
              type: 'annotate',
              title: 'routes.mosys.grids.buttons.annotate',
              // title: 'Grid Editor',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'mosys.grids.annotate', params: { uuid: item._uuid } })
            },
            {
              type: 'edit',
              title: 'buttons.edit',
              click: (item) => _this.$router.push({ name: 'mosys.grids.edit', params: { uuid: item._uuid } })
            },
            {
              type: 'delete',
              title: 'buttons.delete',
              click: item => {
                this.$refs.confirmModal.show('messages.confirm_delete', item, 'buttons.delete')
              }
            }
          ]
        }
      }
    },
    mounted () {
      this.$root.$emit('setBackButton')
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    },
    methods: {
      async handleConfirmModal (item) {
        await deleteHelper.deleteMap(this, item)
        this.$refs.listTable.request()
      }
    }
  }
</script>
