<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      video-player(
        :src="video.body || fauxVideo",
        @ready="handlePlayerReady",
        @play="handlePlayerPlaying",
        @time="handlePlayerTimeChange")

    template(v-else)
      strong Video Cell

</template>

<script>
  import VideoPlayer from '../../../shared/media/VideoPlayer'

  export default {
    components: {
      VideoPlayer
    },
    props: ['cell', 'display', 'preview', 'messenger'],
    data () {
      return {
        video: {},
        videoTime: -1,
        player: {}
      }
    },
    computed: {
      fauxVideo () {
        let fauxVideoAnnotation = {
          type: 'Video',
          purpose: 'linking',
          source: this.cell['content']
        }
        return fauxVideoAnnotation
      },
      videoSrcType () {
        if (this.videoSrc.indexOf('youtube.com') >= 0) return 'video/youtube'
        else return 'html5'
      }
    },
    mounted () {
      const _this = this
      if (this.cell.sourceUuid) {
        this.$store.dispatch('annotations/find', {query: {'uuid': this.cell.sourceUuid}})
          .then(videos => {
            const video = videos.shift()
            if (video) {
              _this.video = video
              _this.videoTime = Date.parse(video.target.selector.value)
              _this.contextTime = _this.videoTime
            }
          })
      }
      if (this.display && this.messenger) {
        this.messenger.$on('annotation-trigger', (annotation, annotationGlobalTime) => {
          if (_this.video.target &&
              annotation.target.id === _this.video.target.id) {
            const movieTime = (annotationGlobalTime - _this.videoTime) / 1000.0
            if (typeof movieTime === 'number' &&
              movieTime >= 0 && _this.player) {
              _this.player.currentTime(movieTime)
            }
          }
        })
      }
    },
    methods: {
      getSignature () {
        if (this.video) {
          return {origin: this.video, type: 'Video'}
        }
        else {
          return {origin: this.cell, type: '2DCell'}
        }
      },
      handlePlayerReady (player) {
        this.messenger.$emit('video-loaded', this.getSignature())
        this.player = player
      },
      handlePlayerPlaying () {
        this.messenger.$emit('video-started-playing', this.getSignature())
      },
      handlePlayerTimeChange (localTime) {
        let globalTime = Date.now()
        if (this.videoTime) {
          globalTime = this.videoTime + (localTime * 1000.0)
        }
        this.messenger.$emit('video-time-changed', localTime, globalTime, this.getSignature())
      }
    }
  }
</script>

<style scoped lang="stylus">

  div.display-full
    background-color white

  div.display-preview
    padding 1em
    color #666

</style>
