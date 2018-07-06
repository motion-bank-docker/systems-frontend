<template lang="pug">
  full-screen
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.groups.list.title') }}
    data-table(:config="config", :title="'routes.piecemaker.groups.list.title'",
      path="maps", :query="query", base-path="groups", :has-show="true")
      template(slot="buttons-left")
        q-btn(@click="$router.push({ name: 'piecemaker.groups.create' })", color="primary") {{ $t('buttons.create_group') }}
</template>

<script>
  import DataTable from '../../../components/shared/partials/DataTable'
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import constants from '../../../lib/constants'

  export default {
    components: {
      DataTable,
      FullScreen
    },
    data () {
      const _this = this
      return {
        query: { type: constants.MAP_TYPE_TIMELINE },
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
              type: 'live-annotate',
              title: 'buttons.live_annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.groups.annotate', params: { id: item.uuid } })
            },
            {
              type: 'videos',
              title: 'buttons.videos',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.videos.list', params: { groupId: item.uuid } })
            },
            {
              type: 'edit',
              title: 'buttons.edit',
              click: (item) => _this.$router.push({ name: 'piecemaker.groups.edit', params: { id: item.uuid } })
            },
            {
              type: 'delete',
              title: 'buttons.delete'
            }
          ]
        }
      }
    }
  }
</script>
