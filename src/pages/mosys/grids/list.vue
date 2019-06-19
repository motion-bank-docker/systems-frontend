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

          // "create grid" button
          // template(slot="buttons-left")
          template(slot="top-buttons")
            // q-btn(@click="$router.push({ name: 'mosys.grids.create' })", color="primary") {{ $t('buttons.create_grid') }}
            //
              q-btn(@click="$router.push({ name: 'mosys.grids.create' })",
              color="primary", icon="add")
                span.on-right(v-if="!isMobile") {{ $t('buttons.create_grid') }}
            q-btn(@click="$router.push({ name: 'mosys.grids.create' })",
            color="primary", :class="{'full-width': isMobile}", icon="add")
              span.on-right.gt-xs {{ $t('buttons.create_grid') }}
              // span.on-right(v-if="!isMobile") {{ $t('buttons.create_grid') }}
              // span.on-right {{ $t('buttons.create_grid') }}
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
        query: { type: constants.mapTypes.MAP_TYPE_2DGRID },
        requestTransform: async rows => {
          for (let i in rows) {
            const transformed = {}
            const row = rows[i]
            transformed.title = row.title
            transformed.last_updated = row.updated ? row.updated : row.created
            transformed.author = row.author ? row.author.name : _this.$t('labels.unknown_author')
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
              name: 'author',
              label: _this.$t('labels.author'),
              field: 'author',
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
