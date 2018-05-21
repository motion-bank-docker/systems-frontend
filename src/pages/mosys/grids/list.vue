<template lang="pug">
  card-full
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.mosys.grids.list.title') }}
    // p.caption(slot="form-caption") {{ $t('routes.mosys.grids.list.caption') }}
    p
      q-btn(@click="$router.push({ name: 'mosys.grids.create' })", color="primary") {{ $t('routes.mosys.grids.create.button') }}
    data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")
</template>

<script>
  import DataTable from '../../../components/shared/partials/DataTable'
  // import CenterCardFull from '../../../components/shared/layouts/CenterCardFull'
  import CardFull from '../../../components/shared/layouts/CardFull'
  import constants from '../../../lib/constants'

  export default {
    components: {
      DataTable,
      // CenterCardFull
      CardFull
    },
    methods: {
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'show':
          return _this.$router.push(`/mosys/grids/${data.row.uuid}`)
        case 'edit':
          return _this.$router.push(`/mosys/grids/${data.row.uuid}/edit`)
        case 'annotate':
          return _this.$router.push(`/mosys/grids/${data.row.uuid}/annotate`)
        case 'delete':
          _this.$store.dispatch('maps/remove', data.row.uuid).then(() => { _this.maps = _this.getGrids() })
        }
      },
      getGrids () {
        return this.$store.dispatch('maps/find', { query: { type: constants.MAP_TYPE_2D_GRID } })
      }
    },
    data () {
      const _this = this
      return {
        maps: _this.getGrids(),
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
          { type: 'show', title: 'routes.mosys.grids.buttons.show' },
          { type: 'annotate', title: 'routes.mosys.grids.buttons.annotate' },
          { type: 'edit', title: 'routes.mosys.grids.buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
        ]
      }
    }
  }
</script>
