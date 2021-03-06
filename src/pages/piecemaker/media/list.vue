<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    content-block(:position="'first'")
      headline(v-if="timeline", :content="$t('routes.piecemaker.media.list.title')")
        | {{ timeline.title }}

      content-paragraph(:position="'first'")
        data-table(v-if="query", ref="listTable", :config="config", :title="'routes.piecemaker.media.list.title'",
        path="annotations", :query="query", base-path="media", :request-transform="requestTransform",
        :customTitleLink="'piecemaker.media.annotate'")
</template>

<script>
  import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  export default {
    components: {
      Headline,
      ContentBlock,
      ContentParagraph
    },
    data () {
      const _this = this
      return {
        timeline: undefined,
        query: undefined,
        requestTransform: async rows => {
          for (let i in rows) {
            const transformed = {}
            const row = rows[i]
            const meta = await _this.$store.dispatch('metadata/getLocal', row)
            transformed.title = meta && meta.title ? meta.title : _this.$t('labels.title_unknown')
            if (row.target.selector) {
              const parsed = row.target.selector._value
              if (Array.isArray(parsed['date-time:t'])) transformed.date = parsed['date-time:t'][0]
              else transformed.date = parsed['date-time:t']
            }
            transformed.last_updated = row.updated ? row.updated : row.created
            const tags = await _this.$store.dispatch('tags/get', row)
            transformed.tags = tags.join(', ')
            transformed.type = row.body.type
            transformed.creator = row.creator ? row.creator.name : _this.$t('labels.unknown_creator')
            transformed._uuid = row._uuid
            transformed.id = row.id
            rows[i] = transformed
          }
          return rows
        },
        config: {
          pagination: {
            sortBy: 'date',
            descending: true
          },
          columns: [
            {
              name: 'title',
              label: _this.$t('labels.title'),
              field: 'title',
              sortable: true,
              filter: true,
              style: 'white-space: normal'
            },
            {
              name: 'type',
              label: _this.$t('labels.type'),
              field: 'type',
              sortable: true,
              filter: true
            },
            {
              name: 'date',
              label: _this.$t('labels.date'),
              sortable: true,
              sort: _this.$sort.onDateValue,
              field: 'date',
              format: val => DateTime.fromISO(val)
                .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
            },
            {
              name: 'last_updated',
              label: _this.$t('labels.last_updated'),
              sortable: true,
              sort: _this.$sort.onDateValue,
              field: 'last_updated',
              format: val => DateTime.fromISO(val)
                  .toLocaleString(DateTime.DATETIME_SHORT)
            },
            {
              name: 'tags',
              label: _this.$t('labels.tags'),
              filter: true,
              sortable: false,
              field: 'tags',
              style: 'white-space: normal'
            },
            {
              name: 'creator',
              label: _this.$t('labels.creator'),
              field: 'creator',
              sortable: true,
              filter: true
            }
          ],
          actions: [
            {
              type: 'live-annotate',
              title: 'buttons.annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.media.annotate', params: { uuid: item._uuid } })
            },
            {
              type: 'annotations-index',
              title: 'buttons.annotations_index',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.media.index', params: { id: item._uuid } })
            },
            {
              type: 'edit',
              title: 'buttons.edit',
              click: (item) => _this.$router.push({ name: 'piecemaker.media.edit', params: { uuid: item._uuid } })
            },
            {
              type: 'sync',
              title: 'buttons.synchronize',
              click: (item) => {
                _this.$router.push({
                  name: 'piecemaker.media.sync',
                  params: { uuid: item._uuid }
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
      this.$root.$emit('setBackButton', '/piecemaker/timelines')
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.timelineUuid)
      if (this.timeline) {
        this.query = {
          'body.purpose': 'linking',
          'body.type': { $in: ['Audio', 'Video'] },
          'target.id': this.timeline.id
        }
      }
    },
    methods: {
      async handleConfirmModal (item) {
        await this.$store.dispatch('annotations/delete', item._uuid)
        if (item.id) {
          const results = await this.$store.dispatch('annotations/find', {
            'target.id': item.id,
            'body.purpose': 'describing',
            'body.type': 'TextualBody'
          })
          for (let a of results.items) {
            await this.$store.dispatch('annotations/delete', a._uuid)
          }
        }
        this.$refs.listTable.request()
      }
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    }
  }
</script>
