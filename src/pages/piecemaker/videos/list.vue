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
  import { DateTime } from 'luxon'

  export default {
    data () {
      const _this = this
      return {
        timeline: undefined,
        query: undefined,
        config: {
          pagination: {
            sortBy: 'date',
            descending: true
          },
          columns: [
            {
              name: 'title',
              label: _this.$t('labels.title'),
              field: row => row,
              sortable: true,
              filter: true,
              format: async (val) => {
                const meta = await _this.$store.dispatch('metadata/get', val)
                return meta && meta.title ? meta.title : _this.$t('labels.title_unknown')
              }
            },
            {
              name: 'date',
              label: _this.$t('labels.date'),
              sortable: true,
              sort: _this.$sort.onDateValue,
              field: row => row.target.selector ? row.target.selector.value : undefined,
              format: val => DateTime.fromISO(val)
                .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
            },
            {
              name: 'last_updated',
              label: _this.$t('labels.last_updated'),
              sortable: true,
              sort: _this.$sort.onDateValue,
              field: row => row.updated ? row.updated : row.created,
              format: val => DateTime.fromISO(val)
                  .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
            },
            {
              name: 'tags',
              label: _this.$t('labels.tags'),
              filter: true,
              sortable: false,
              field: row => row,
              format: async val => {
                const tags = await _this.$store.dispatch('tags/get', val)
                return tags.join(', ')
              }
            },
            {
              name: 'author',
              label: _this.$t('labels.author'),
              field: row => row.author ? row.author.name : _this.$t('labels.unknown_author'),
              sortable: true
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
        if (item.id) {
          const results = await this.$store.dispatch('annotations/find', {
            'target.id': item.id,
            'body.purpose': 'describing',
            'body.type': 'TextualBody'
          })
          for (let a of results.items) {
            await this.$store.dispatch('annotations/delete', a.uuid)
          }
        }
        this.$refs.listTable.request()
      }
    }
  }
</script>
