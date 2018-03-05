<template lang="pug">
  center-card-full
    span(slot="form-title") {{ $t('routes.piecemaker.groups.list.title') }}
    p.caption(slot="form-caption") {{ $t('routes.piecemaker.groups.list.caption') }}
    p
      q-btn(@click="$router.push({ name: 'stash.groups.create' })", color="primary") {{ $t('buttons.create_group') }}
    data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import DataTable from '../../../shared/partials/DataTable'
  import CenterCardFull from '../../../shared/layouts/CenterCardFull'
  import constants from '../../../../lib/constants'
  export default {
    components: {
      QBtn,
      DataTable,
      CenterCardFull
    },
    methods: {
      onAction (type, data) {
        const _this = this
        switch (type) {
          case 'annotate':
            return _this.$router.push(`/piecemaker/videos/${data.row.uuid}/annotate`)
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
        columns: [{
          label: _this.$t('labels.map_title'),
          field: 'title'
        }],
        actions: [
          { type: 'add_video', title: 'buttons.add_video', color: 'primary' },
          { type: 'edit', title: 'buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
        ]
      }
    }
  }
</script>
