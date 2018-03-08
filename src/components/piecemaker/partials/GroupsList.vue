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
          case 'videos':
            return _this.$router.push(`/piecemaker/groups/${data.row.uuid}/videos`)
          case 'edit':
            return _this.$router.push(`/piecemaker/groups/${data.row.uuid}/edit`)
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
            field: 'title'
          },
          {
            label: _this.$t('labels.created'),
            field: 'created'
          }
        ],
        actions: [
          { type: 'videos', title: 'buttons.videos', color: 'primary' },
          { type: 'edit', title: 'buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
        ]
      }
    }
  }
</script>
