<template lang="pug">
  q-list.piecemaker-source-container

    q-list-header
      template(v-if="currentTimeline")
        q-btn(flat, round, small, style="margin-right: 0.5em",
          @click="handleClickUnsetCurrentTimeline", icon="keyboard backspace")
        span Videos in Timeline #[strong {{currentTimeline.title}}]
      template(v-else)
        router-link(:to="{name: 'piecemaker.timelines.list'}") Piecemaker Timelines

    q-item-separator

    // timeline
    template(v-if="currentTimeline")

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
      template(v-for="(timeline, i) in timelines")
        template(v-if="i > 0")
          q-item-separator
        q-item
          q-item-side
            q-icon(name="list", style="font-size: 1.8rem")
          q-item-main
            a(@click.prevent="event => {handleTimelineItemClick(event, timeline)}") {{timeline.title}}
</template>

<script>
  import constants from 'mbjs-data-models/src/constants'

  export default {
    data () {
      return {
        timelines: [],
        currentTimeline: null,
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
      async handleTimelineItemClick (events, timeline) {
        this.currentTimeline = timeline
        this.currentVideos = []
        this.loadingVideos = true
        const query = {
          type: 'Annotation',
          'body.purpose': 'linking',
          'target.id': this.currentTimeline.idync
        }
        const result = await this.$store.dispatch('annotations/find', query)
        const videos = result.items
        for (let entry of videos) {
          try {
            const metadata = await this.$store.dispatch('metadata/get', entry.uuid)
            entry.title = metadata.title
          }
          catch (e) {
            console.error(e.message, e.stack)
            entry.title = this.$t('labels.title_unknown')
          }
        }
        this.currentVideos = videos
        this.loadingVideos = false
      },
      handleClickUnsetCurrentTimeline () {
        this.currentTimeline = null
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
