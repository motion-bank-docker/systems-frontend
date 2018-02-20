<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.maps.list.title') }}
    p.caption(slot="form-caption") {{ $t('routes.maps.list.caption') }}
    p
      q-btn(@click="$router.push('/maps/create')", color="primary") {{ $t('buttons.create_map') }}
    data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import DataTable from '../../partials/DataTable'
  import CenterCardThreeQuarter from '../../layouts/CenterCardThreeQuarter'
  export default {
    components: {
      DataTable,
      CenterCardThreeQuarter,
      QBtn
    },
    methods: {
      onAction (type, data) {
        const _this = this
        switch (type) {
          case 'add_video':
            return _this.$router.push(`/annotations/${data.row.uuid}/video`)
          case 'annotate_edit':
            return _this.$router.push(`/annotations/${data.row.uuid}/edit`)
          case 'edit':
            return _this.$router.push(`/maps/${data.row.uuid}/edit`)
          case 'delete':
            _this.$store.dispatch('maps/remove', data.row.uuid)
              .then(() => { _this.maps = _this.$store.dispatch('maps/find') })
        }
      }
    },
    data () {
      const _this = this
      return {
        maps: _this.$store.dispatch('maps/find'),
        columns: [{
          label: _this.$t('labels.map_title'),
          field: 'title'
        }],
        actions: [
          { type: 'add_video', title: 'buttons.add_video', color: 'primary' },
          { type: 'annotate_edit', title: 'buttons.annotate', color: 'primary' },
          { type: 'edit', title: 'buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
        ]
      }
    }
  }
</script>

<style></style>
