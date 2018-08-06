<template lang="pug">
  full-screen
    span(slot="form-title") {{ $t('routes.mosys.grids.list.title') }}
    data-table(:config="config", :title="'routes.mosys.grids.list.title'",
    path="maps", :query="query", base-path="grids", :has-show="true")
      template(slot="buttons-left")
        q-btn(@click="$router.push({ name: 'mosys.grids.create' })", color="primary") {{ $t('buttons.create_grid') }}
</template>

<script>
  import DataTable from '../../../components/shared/partials/DataTable'
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    components: {
      DataTable,
      FullScreen
    },
    data () {
      const _this = this
      return {
        query: { type: constants.MAP_TYPE_2D_GRID },
        config: {
          columns: [
            {
              label: _this.$t('labels.title'),
              field: 'title',
              // FIXME: throws array sort exception when active
              sort: false,
              filter: true
            },
            {
              label: _this.$t('labels.created'),
              field: 'created',
              sort: true
            },
            {
              label: _this.$t('labels.updated'),
              field: 'updated',
              sort: true
            },
            {
              label: _this.$t('labels.author'),
              field: 'author'
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
                _this.$store.dispatch('annotations/find', { 'target.id': item.uuid }).then(async result => {
                  for (let a of result.items) {
                    await _this.$store.dispatch('annotations/delete', a.uuid)
                  }
                  await _this.$store.dispatch('maps/delete', item.uuid)
                  this.$store.commit('notifications/addMessage', {
                    body: 'messages.grid_deleted',
                    mode: 'alert',
                    type: 'success'
                  })
                  this.$refs.listTable.request()
                }).catch(err => {
                  console.error('grid delete failed', err.message)
                  this.$store.commit('notifications/addMessage', {
                    body: 'errors.grid_delete_failed',
                    mode: 'alert',
                    type: 'error'
                  })
                })
              }
            }
          ]
        }
      }
    }
  }
</script>
