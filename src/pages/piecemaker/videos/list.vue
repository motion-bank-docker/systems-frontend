<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    back-button(slot="backButton")
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.videos.list.title') }}
    data-table(v-if="query", ref="listTable", :config="config", :title="'routes.piecemaker.videos.list.title'",
      path="annotations", :query="query", base-path="videos")
      template(slot="buttons-left")
        q-btn(@click="$router.push({ name: 'piecemaker.videos.create', params: { timelineId: $route.params.timelineId } })",
          color="primary") {{ $t('buttons.add_video') }}
</template>

<script>
  import getVideoMetadata from '../../../lib/get-video-metadata'

  export default {
    data () {
      const _this = this
      return {
        timeline: undefined,
        query: undefined,
        config: {
          columns: [
            {
              name: 'title',
              label: _this.$t('labels.title'),
              field: val => val,
              // FIXME: throws array sort exception when active
              sort: false,
              filter: true,
              format: async (val) => {
                const meta = await getVideoMetadata(_this, val)
                return meta && meta.title ? meta.title : _this.$t('labels.title_unknown')
              }
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
              title: 'buttons.annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.videos.annotate', params: { id: item.uuid } })
            },
            {
              type: 'edit',
              title: 'buttons.edit',
              // click: (item) => _this.$router.push({ name: 'piecemaker.videos.edit', params: { id: item.uuid } })
              click: (item) => _this.$router.push({ name: 'piecemaker.videos.edit', params: { id: item.uuid } })
            },
            {
              type: 'sync',
              title: 'buttons.synchronize',
              click: (item) => {
                _this.$router.push({
                  name: 'piecemaker.videos.sync',
                  params: { id: item.uuid }
                })
              }
            },
            {
              type: 'delete',
              title: 'buttons.delete',
              click: (item) => {
                this.$refs.confirmModal.show('buttons.delete', item, 'buttons.delete')
              }
            }
          ]
        }
      }
    },
    async mounted () {
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.timelineId)
      if (this.timeline) {
        this.query = {
          'body.purpose': 'linking',
          'body.type': 'Video',
          'target.id': this.timeline.id
        }
      }
    },
    methods: {
      async handleConfirmModal (item) {
        await this.$store.dispatch('annotations/delete', item.uuid)
        this.$refs.listTable.request()
      }
    }
  }
</script>
