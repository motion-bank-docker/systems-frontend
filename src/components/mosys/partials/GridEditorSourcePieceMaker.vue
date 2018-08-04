<template lang="pug">
  q-list.piecemaker-source-container

    q-list-header
      template(v-if="currentGroup")
        q-btn(flat, round, small, style="margin-right: 0.5em",
          @click="handleClickUnsetCurrentGroup", icon="keyboard backspace")
        span Videos in Timeline #[strong {{currentGroup.title}}]
      template(v-else)
        router-link(:to="{name: 'piecemaker.timelines.list'}") Piecemaker Timelines

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
                draggable="true",
                @dragstart.native="event => {handleItemDragStart(event, video, 'Video')}",
                name="local movies", style="font-size: 1.8rem")
              q-icon(
                draggable="true",
                @dragstart.native="event => {handleItemDragStart(event, video, 'Annotation-List')}",
                name="comment", style="font-size: 1.8rem")
            q-item-main
              a(@click.prevent="event => {handleVideoItemClick(event, video)}") {{video.title || video.uuid}}

    // timelines list
    template(v-else)
      template(v-for="(group, i) in timelines")
        template(v-if="i > 0")
          q-item-separator
        q-item
          q-item-side
            q-icon(name="list", style="font-size: 1.8rem")
          q-item-main
            a(@click.prevent="event => {handleGroupItemClick(event, group)}") {{group.title}}
</template>

<script>
  import constants from 'mbjs-data-models/src'
  // import Promise from 'bluebird'
  // import url from 'url'
  // import path from 'path'
  // import he from 'he'
  // import { ObjectUtil } from 'mbjs-utils'

  export default {
    data () {
      return {
        timelines: [],
        currentGroup: null,
        currentVideos: [],
        loadingVideos: false
      }
    },
    mounted () {
      const _this = this
      this.$store.dispatch('maps/find', { type: constants.MAP_TYPE_TIMELINE })
        .then(maps => {
          if (maps.items) _this.timelines = maps.items
        })
    },
    methods: {
      handleGroupItemClick (events, group) {
        this.currentGroup = group
        this.currentVideos = []
        this.loadingVideos = true
        const _this = this
        this.$store.dispatch('annotations/find', { type: 'Annotation', 'body.purpose': 'linking', 'target.id': this.currentGroup.uuid })
          // TODO: ask Anton about how to get metadata from transcoder
          // .then(result => {
          //   const videos = result.items
          //   return Promise.map(videos, entry => {
          //     const newEntry = ObjectUtil.merge({}, entry)
          //     newEntry.title = _this.$t('labels.title_unknown')
          //     return Promise.resolve()
          //       .then(() => {
          //         console.log(entry)
          //         return _this.$store.dispatch('metadata/get', entry.uuid)
          //           .then(result => {
          //             console.log(result)
          //           })
          //           .catch(() => {
          //             newEntry.title = _this.$t('labels.title_unknown')
          //           })
          //       })
          //       .then(() => {
          //         return newEntry
          //       })
          //   })
          // })
          .then(result => {
            const videos = result.items
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
      handleItemDragStart (event, item, type = 'Video') {
        let videoCell = {
          uuid: null,
          type: type,
          x: 1,
          y: 1,
          width: 1,
          height: 1,
          content: type === 'Video' ? item.body.source.id : item.uuid,
          sourceUuid: item.uuid
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
