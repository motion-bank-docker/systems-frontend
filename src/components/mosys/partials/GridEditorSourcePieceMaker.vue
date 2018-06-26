<template lang="pug">
  q-list.piecemaker-source-container

    q-list-header
      template(v-if="currentGroup")
        q-btn(flat, round, small, style="margin-right: 0.5em",
          @click="handleClickUnsetCurrentGroup", icon="keyboard backspace")
        span Videos in Group #[strong {{currentGroup.title}}]
      template(v-else)
        router-link(:to="{name: 'piecemaker.groups.list'}") Piecemaker Groups

    q-item-separator

    // group
    template(v-if="currentGroup")

      // loading, nothing here
      template(v-if="currentVideos.length === 0")
        template(v-if="loadingVideos")
          q-item
            q-item-side
              q-spinner(style="margin-right: 1em")
            q-item-main Loading Videos
        template(v-else)
          q-item No Videos Found!

      // videos, annotations
      template(v-else)
        template(v-for="(video, i) in currentVideos")
          template(v-if="i > 0")
            q-item-separator
          q-item.video-item
            q-item-side
              q-icon(
                draggable="true", @dragstart="event => {handleVideoItemDragStart(event, video, 'Video')}",
                name="local movies", style="font-size: 1.8rem")
              q-icon(
                draggable="true", @dragstart="event => {handleVideoItemDragStart(event, video, 'Annotation-List')}",
                name="comment", style="font-size: 1.8rem")
            q-item-main
              a(@click.prevent="event => {handleVideoItemClick(event, video)}") {{video.title}}

    // groups list
    template(v-else)
      template(v-for="(group, i) in groups")
        template(v-if="i > 0")
          q-item-separator
        q-item
          q-item-side
            q-icon(name="list", style="font-size: 1.8rem")
          q-item-main
            a(@click.prevent="event => {handleGroupItemClick(event, group)}") {{group.title}}
</template>

<script>
  import constants from '../../../lib/constants'
  import Promise from 'bluebird'
  import url from 'url'
  import path from 'path'
  import he from 'he'
  import { ObjectUtil } from 'mbjs-utils'

  export default {
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
              const newEntry = ObjectUtil.merge({}, entry)
              newEntry.title = entry.body.source
              return Promise.resolve()
                .then(() => {
                  if (entry.body.source.indexOf('http') !== 0) return
                  if (path.extname(url.parse(entry.body.source).path) === '.mp4') return
                  // TODO: check if change from superagent to axios plugin is breaking
                  return _this.$axios.get(`${_this.$globalConfig.app.hosts.api}/proxy?url=${encodeURIComponent(entry.body.source)}`)
                    .then(result => {
                      let title = result.text.match(/<title[^>]*>([^<]+)<\/title>/)[1]
                      newEntry.title = he.decode(title)
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
      handleClickUnsetCurrentGroup () {
        this.currentGroup = null
        this.currentVideos = []
      },
      handleVideoItemClick () {
      },
      handleVideoItemDragStart (event, video, type = 'Video') {
        let videoCell = {
          uuid: null,
          type: type,
          x: 1,
          y: 1,
          width: 1,
          height: 1,
          content: type === 'Video' ? video.body.source : video.uuid,
          sourceUuid: video.uuid
        }
        event.dataTransfer.setData('text/plain', JSON.stringify(videoCell))
      }
    }
  }
</script>

<style scoped lang="stylus">

  .piecemaker-source-container
    overflow auto

  .video-item

    .q-item-side
      width 20%

      .q-icon
        width 30px

    .q-item-main
      width 100%

</style>
