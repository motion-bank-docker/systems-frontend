<template lang="pug">
  q-list.piecemaker-source-container
    q-list-header
      template(v-if="currentGroup") Videos in Group #[strong {{currentGroup.title}}]
        q-btn(flat, round, small, fixed, class="fixed",
          style="right: 24px", @click="handleClickUnsetCurrentGroup", icon="close")
      template(v-else) Piecemaker Groups
    q-item-separator
    //q-scroll-area(style="width: 100%; height: 100%")
    template(v-if="currentGroup")
      template(v-if="currentVideos.length === 0")
        template(v-if="loadingVideos")
          q-item
            q-item-left
              q-spinner(style="margin-right: 1em")
            q-item-middle Loading Videos
        template(v-else)
          q-item No Videos Found!
      template(v-else)
        template(v-for="(video, i) in currentVideos")
          template(v-if="i > 0")
            q-item-separator
          q-item(draggable="true", @dragstart="event => {handleVideoItemDragStart(event, video)}")
            a(@click.prevent="event => {handleVideoItemClick(event, video)}") {{video.title}}
    template(v-else)
      template(v-for="(group, i) in groups")
        template(v-if="i > 0")
          q-item-separator
        q-item
          a(@click.prevent="event => {handleGroupItemClick(event, group)}") {{group.title}}
</template>

<script>
  import { QBtn, QList, QListHeader, QItem, QItemSide, QItemMain, QItemSeparator, QScrollArea, QSpinner } from 'quasar-framework'
  import constants from '../../../lib/constants'
  import Promise from 'bluebird'
  import superagent from 'superagent'
  import buildVars from '../../../lib/build-vars'

  export default {
    components: {
      QBtn, QList, QListHeader, QItem, QItemSide, QItemMain, QItemSeparator, QScrollArea, QSpinner
    },
    data () {
      return {
        groups: [],
        currentGroup: null,
        currentVideos: [],
        loadingVideos: false
      }
    },
    mounted () {
      const _this = this
      this.$store.dispatch('maps/find', { query: { type: constants.MAP_TYPE_TIMELINE } })
        .then(maps => {
          _this.groups = maps
        })
    },
    methods: {
      handleGroupItemClick (events, group) {
        this.currentGroup = group
        this.currentVideos = []
        this.loadingVideos = true
        const _this = this
        this.$store.dispatch('annotations/find', { query: { type: 'Annotation', 'body.purpose': 'linking', 'target.id': this.currentGroup.uuid } })
          .then(videos => {
            return Promise.map(videos, entry => {
              const newEntry = Object.assign({}, entry)
              newEntry.title = entry.body.source
              return Promise.resolve()
                .then(() => {
                  if (entry.body.source.indexOf('http') !== 0) return
                  return superagent.get(`${buildVars().apiHost}/proxy?url=${encodeURIComponent(entry.body.source)}`)
                    .then(result => {
                      newEntry.title = result.text.match(/<title[^>]*>([^<]+)<\/title>/)[1]
                    })
                    .catch(err => {
                      console.warn(`Error getting title for ${entry.body.source}: ${err.message}`)
                    })
                })
                .then(() => {
                  return newEntry
                })
            })
          })
          .then(videos => {
            _this.currentVideos = videos
            this.loadingVideos = false
          })
      },
      handleClickUnsetCurrentGroup (event) {
        this.currentGroup = null
        this.currentVideos = []
      },
      handleVideoItemClick (event, video) {
      },
      handleVideoItemDragStart (event, video) {
        let videoCell = {
          uuid: video.uuid,
          type: 'Video',
          x: 1,
          y: 1,
          width: 1,
          height: 1,
          content: video.body.source
        }
        event.dataTransfer.setData('text/plain', JSON.stringify(videoCell))
      }
    }
  }
</script>

<style scoped lang="stylus">
  .piecemaker-source-container
    overflow auto
</style>
