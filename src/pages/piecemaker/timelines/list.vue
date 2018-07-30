<template lang="pug">
  full-screen
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.timelines.list.title') }}

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

    data-table(:config="config", :title="'routes.piecemaker.timelines.list.title'", ref="listTable",
      path="maps", :query="query", base-path="timelines", :has-show="true")
      template(slot="buttons-left")
        q-btn(@click="$router.push({ name: 'piecemaker.timelines.create' })", color="primary") {{ $t('buttons.create_timeline') }}
</template>

<script>
  import DataTable from '../../../components/shared/partials/DataTable'
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import constants from '../../../lib/constants'

  export default {
    components: {
      DataTable,
      FullScreen
    },
    mounted () {
      this.diagramDimensions.currentWidth = this.$refs['diagramList'].offsetWidth
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
        /* dummyData: [
          {
            author: 'ch',
            created: 0
          },
          {
            author: 'ch',
            created: 100
          },
          {
            author: 'ch',
            created: 105
          },
          {
            author: 'ch',
            created: 300
          },
          {
            author: 'ch',
            created: 800
          }
        ], */
        query: { type: constants.MAP_TYPE_TIMELINE },
        config: {
          columns: [
            {
              label: _this.$t('labels.title'),
              field: 'title',
              // FIXME: throws array sort exception when active
              sort: false,
              filter: true
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
              title: 'buttons.live_annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.timelines.annotate', params: { id: item.uuid } })
            },
            {
              type: 'videos',
              title: 'buttons.videos',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.videos.list', params: { groupId: item.uuid } })
            },
            {
              type: 'edit',
              title: 'buttons.edit',
              click: (item) => _this.$router.push({ name: 'piecemaker.timelines.edit', params: { id: item.uuid } })
            },
            {
              type: 'delete',
              title: 'buttons.delete',
              click: item => {
                _this.$store.dispatch('annotations/find', { 'target.id': item.uuid }).then(async result => {
                  for (let a of result.items) {
                    await _this.$store.dispatch('annotations/delete', a.uuid)
                  }
                  await _this.$store.dispatch('maps/delete', item.uuid)
                  this.$store.commit('notifications/addMessage', {
                    body: 'messages.timeline_deleted',
                    mode: 'alert',
                    type: 'success'
                  })
                  this.$refs.listTable.request()
                }).catch(err => {
                  console.error('timeline delete failed', err.message)
                  this.$store.commit('notifications/addMessage', {
                    body: 'errors.timeline_delete_failed',
                    mode: 'alert',
                    type: 'error'
                  })
                })
              }
            }
          ]
        }
      }
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
