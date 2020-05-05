<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    migration-warning

    //
      span(slot="form-logo")
      span(slot="form-title") {{ $t('routes.piecemaker.timelines.list.title') }}
    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.timelines.list.title')")

      // DIAGRAM
        div.q-mb-xl(ref="diagramList")
          svg(width="100%", :height="diagramDimensions.height")
            defs
              linearGradient(id="lgrad" x1="0%" y1="50%" x2="100%" y2="50%")
                stop(offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:.2")
                stop(offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:.025")
            line(x1="0", x2="100%", :y1="diagramDimensions.height / 2", :y2="diagramDimensions.height / 2", style="stroke: rgba( 255, 255, 255, .25 ); stroke-width: 1;")
            text.q-caption(v-for="n in 11",:x="(diagramDimensions.currentWidth / 10) * n - 2", :y="diagramDimensions.height / 2 - 10", fill="rgba( 255, 255, 255, .2)") {{ 1999 + n }}
            svg(v-for="(dummy, i) in dummyData", :width="diagramDimensions.currentWidth - dummy.created", height="diagramDimensions.barHeight", :x="dummy.created")
              line(x1="0", x2="0", y1="0", y2="100%", style="stroke: rgba( 255, 255, 255, .25 ); stroke-width: 1;")
              rect.cursor-pointer.moba-hover-timeline(width="100%", height="100%")
            circle.cursor-pointer.moba-svg-circle(v-for="n in 11", r="3", :cx="(diagramDimensions.currentWidth / 10) * n", :cy="diagramDimensions.height / 2", fill="rgba( 255, 255, 255, .5)")
            // rect.moba-test(@click="testWidth = testWidth + 30", fill="red", :width="testWidth", height="30")

      content-paragraph
        data-table(
        :config="config",
        :title="'routes.piecemaker.timelines.list.title'",
        ref="listTable",
        path="maps",
        :query="query",
        base-path="timelines",
        :has-show="true",
        :request-transform="requestTransform"
        )
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'
  import { DateTime } from 'luxon'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'
  import MigrationWarning from '../../../components/shared/partials/MigrationWarning'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Headline,
      ContentBlock,
      ContentParagraph,
      MigrationWarning
    },
    data () {
      const _this = this
      return {
        testWidth: 40,
        diagramDimensions: {
          activeId: null,
          barHeight: 50,
          currentWidth: 0,
          height: 100,
          offsetY: 20
        },
        query: { type: constants.mapClasses.MAP_CLASS_TIMELINE },
        requestTransform: async rows => {
          for (let i in rows) {
            const transformed = {}
            const row = rows[i]
            transformed.title = row.title
            transformed.last_updated = row.updated ? row.updated : row.created
            transformed.creator = row.creator ? (row.creator.name || _this.$t('labels.anonymous_creator')) : _this.$t('labels.unknown_creator')
            transformed.creatorId = row.creator ? row.creator.id : ''
            transformed._uuid = row._uuid
            transformed.id = row.id
            rows[i] = transformed
          }
          return rows
        },
        config: {
          columns: [
            {
              name: 'title',
              label: _this.$t('labels.title'),
              field: 'title',
              filter: true,
              sortable: true,
              style: 'white-space: normal'
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
              name: 'creator',
              label: _this.$t('labels.creator'),
              field: 'creator',
              sortable: true,
              filter: true
            }
            /*
            {
              name: 'ownership',
              label: this.$t('labels.ownership'),
              align: 'center',
              field: row => {
                if (row.creatorId === this.$auth.user.id) return row.creatorId === this.$auth.user.id
              },
              sortable: true
            }
            */
          ],
          actions: [
            {
              type: 'show',
              title: 'labels.media',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.media.list', params: { timelineUuid: item._uuid } })
            },
            {
              type: 'live-annotate',
              title: 'buttons.live_annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.timelines.annotate', params: { uuid: item._uuid } })
            },
            // {
            //   type: 'media',
            //   title: 'buttons.media',
            //   color: 'primary',
            //   click: (item) => _this.$router.push({ name: 'piecemaker.media.list', params: { timelineUuid: item._uuid } })
            // },
            // {
            //   type: 'search',
            //   title: 'buttons.search',
            //   color: 'primary',
            //   feature: 'search',
            //   click: (item) => _this.$router.push({ name: 'piecemaker.timelines.search', params: { uuid: item._uuid } })
            // },
            {
              type: 'edit',
              title: 'buttons.edit',
              click: (item) => _this.$router.push({ name: 'piecemaker.timelines.edit', params: { uuid: item._uuid } })
            },
            {
              type: 'delete',
              title: 'buttons.delete',
              click: item => {
                this.$refs.confirmModal.show('buttons.delete', item, 'buttons.delete')
              }
            }
          ]
        }
      }
    },
    methods: {
      async handleConfirmModal (item) {
        try {
          await this.$store.dispatch('maps/delete', item._uuid)
          this.$store.commit('notifications/addMessage', {
            body: 'messages.timeline_deleted',
            mode: 'alert',
            type: 'success'
          })
          this.$refs.listTable.request()
        }
        catch (err) {
          this.$handleError(err)
        }
      }
    },
    mounted () {
      this.$root.$emit('setBackButton')
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    }
  }
</script>

<style lang="stylus">
  .moba-hover-timeline
    fill transparent

  .moba-hover-timeline:hover
    // fill: rgba(255, 255, 255, .25)
    fill url(#lgrad)

  /*
  .moba-svg-circle
    transition ease r 200ms
  .moba-svg-circle:hover
    r 10 */

  /* .moba-test
    transition width ease 200ms */
</style>
