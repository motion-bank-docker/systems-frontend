<template lang="pug">
  center-card-full
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.videos.list.title') }}
    p.caption(slot="form-caption") {{ $t('routes.piecemaker.videos.list.caption') }}
    p
      q-btn(@click="$router.push({ name: 'piecemaker.videos.create', params: { groupId: $route.params.groupId } })",
        color="primary") {{ $t('buttons.add_video') }}
    data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")
    .text-center
      q-btn(@click="$router.push(`/piecemaker/groups/`)") Back to groups
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import DataTable from '../../../shared/partials/DataTable'
  import CenterCardFull from '../../../shared/layouts/CenterCardFull'
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
            return _this.$router.push(`/piecemaker/videos/${data.row.uuid}/edit`)
          // case 'synchronize':
            // return _this.$router.push(`/mosys/codarts/sync`)
          case 'delete':
            _this.$store.dispatch('maps/remove', data.row.uuid)
              .then(() => { _this.maps = _this.$store.dispatch('maps/find') })
        }
      }
    },
    data () {
      const _this = this
      return {
        maps: _this.$store.dispatch('annotations/find', { query: { 'body.purpose': 'linking', 'target.id': _this.$route.params.groupId } }),
        columns: [{
          label: _this.$t('labels.video_title'),
          field: 'body'
        }],
        actions: [
          { type: 'annotate', title: 'buttons.annotate', color: 'primary' },
          { type: 'edit', title: 'buttons.edit' },
          // { type: 'synchronize', title: 'buttons.synchronize' },
          { type: 'delete', title: 'buttons.delete' }
        ]
      }
    }
  }
</script>
