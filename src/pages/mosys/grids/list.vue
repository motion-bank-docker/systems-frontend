<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    span(slot="form-title") {{ $t('routes.mosys.grids.list.title') }}
    data-table(
      ref="listTable",
      :config="config",
      :title="'routes.mosys.grids.list.title'",
      path="maps",
      :query="query",
      :requestTransform="requestTransform"
      base-path="grids",
      :has-show="true")
        template(slot="buttons-left")
          q-btn(@click="$router.push({ name: 'mosys.grids.create' })", color="primary") {{ $t('buttons.create_grid') }}
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import { DateTime } from 'luxon'

  export default {
    data () {
      const _this = this
      return {
        query: { type: constants.MAP_TYPE_2D_GRID },
        requestTransform: async rows => {
          for (let i in rows) {
            const transformed = {}
            const row = rows[i]
            transformed.title = row.title
            transformed.last_updated = row.updated ? row.updated : row.created
            transformed.author = row.author ? row.author.name : _this.$t('labels.unknown_author')
            transformed.uuid = row.uuid
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
              type: 'annotate',
              title: 'routes.mosys.grids.buttons.annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'mosys.grids.annotate', params: { id: item.uuid } })
            },
            {
              type: 'edit',
              title: 'buttons.edit',
              click: (item) => _this.$router.push({ name: 'mosys.grids.edit', params: { id: item.uuid } })
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
    methods: {
      async handleConfirmModal (item) {
        try {
          const result = await this.$store.dispatch('annotations/find', { 'target.id': item.id })
          for (let a of result.items) {
            await this.$store.dispatch('annotations/delete', a.uuid)
          }
          await this.$store.dispatch('maps/delete', item.uuid)
          this.$store.commit('notifications/addMessage', {
            body: 'messages.grid_deleted',
            mode: 'alert',
            type: 'success'
          })
          this.$refs.listTable.request()
        }
        catch (err) {
          console.error('grid delete failed', err.message)
          this.$store.commit('notifications/addMessage', {
            body: 'errors.grid_delete_failed',
            mode: 'alert',
            type: 'error'
          })
        }
      }
    }
  }
</script>
