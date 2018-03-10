<template lang="pug">
  data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")
</template>

<script>
  import DataTable from '../../shared/partials/DataTable'
  import constants from '../../../lib/constants'

  export default {
    components: {
      DataTable
    },
    methods: {
      onAction (type, data) {
        const _this = this
        switch (type) {
          case 'live-annotate':
            return _this.$router.push({ name: 'piecemaker.groups.annotate', params: { id: data.row.uuid } })
          case 'videos':
            return _this.$router.push({ name: 'piecemaker.videos.list', params: { groupId: data.row.uuid } })
          case 'edit':
            return _this.$router.push({ name: 'piecemaker.groups.edit', params: { id: data.row.uuid } })
          case 'delete':
            _this.$store.dispatch('maps/remove', data.row.uuid)
              .then(() => { _this.maps = _this.$store.dispatch('maps/find') })
        }
      }
    },
    data () {
      const _this = this
      return {
        maps: _this.$store.dispatch('maps/find', { query: { type: constants.MAP_TYPE_TIMELINE } }),
        columns: [
          {
            label: _this.$t('labels.title'),
            field: 'title',
            type: 'string',
            sort: true,
            filter: true
          },
          {
            label: _this.$t('labels.created'),
            field: 'created',
            type: 'date',
            sort: true
          },
          {
            label: _this.$t('labels.updated'),
            field: 'updated',
            type: 'date',
            sort: true
          },
          {
            label: _this.$t('labels.author'),
            field: 'author'
          }
        ],
        actions: [
          { type: 'live-annotate', title: 'buttons.live_annotate', color: 'primary' },
          { type: 'videos', title: 'buttons.videos', color: 'primary' },
          { type: 'edit', title: 'buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
        ]
      }
    }
  }
</script>
