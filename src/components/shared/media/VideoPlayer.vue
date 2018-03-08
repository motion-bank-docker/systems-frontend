<template lang="pug">
  video-player(class="video-player-box vjs-big-play-centered",
   ref="videoPlayer",
   :options="playerOptions",
   :playsinline="true",
   customEventName="customstatechangedeventname",
   @play="onPlayerEvent('play', $event)",
   @pause="onPlayerEvent('pause', $event)",
   @ended="onPlayerEvent('ended', $event)",
   @waiting="onPlayerEvent('waiting', $event)",
   @playing="onPlayerEvent('playing', $event)",
   @loadeddata="onPlayerEvent('data', $event)",
   @timeupdate="onPlayerEvent('time', $event.currentTime())",
   @canplay="onPlayerEvent('canplay', $event)",
   @canplaythrough="onPlayerEvent('canplaythrough', $event)",
   @statechanged="playerStateChange($event)",
   @ready="onPlayerReady")
</template>

<script>
  require('video.js/dist/video-js.css')
  require('vue-video-player/src/custom-theme.css')
  require('videojs-youtube')
  require('videojs-vimeo/src/Vimeo')

  import { videoPlayer } from 'vue-video-player'

  export default {
    components: {
      videoPlayer
    },
    data () {
      return {
        guessedType: undefined,
        playerOptions: {
          fluid: true,
          width: 640,
          techOrder: ['html5'],
          language: 'en',
          playbackRates: [0.25, 0.5, 1.0, 1.5, 2.0],
          sources: [],
          poster: undefined,
          controlBar: {
            remainingTime: true
          }
        }
      }
    },
    props: ['src', 'type'],
    mounted () {
      if (!this.src) return
      /*
      if (!this.type) {
        this.guessType()
      }
      */
      const type = this.guessType(this.src)
      if (type === 'video/youtube') {
        this.playerOptions.techOrder = ['youtube']
      }
      else if (type === 'video/vimeo') {
        this.playerOptions.techOrder = ['vimeo']
      }
      this.setSources([{ type, src: this.src.source }])
    },
    watch: {
      src (val) {
        const type = this.guessType(val)
        if (val) {
          if (type === 'video/youtube') {
            this.playerOptions.techOrder = ['youtube']
          }
          else if (type === 'video/vimeo') {
            this.playerOptions.techOrder = ['vimeo']
          }
          this.setSources([{type, src: val.source}])
        }
      }
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      guessType (val) {
        if (val.source.indexOf('youtube.com') > -1) {
          return 'video/youtube'
        }
        else if (val.source.indexOf('vimeo.com') > -1) {
          return 'video/vimeo'
        }
        return null
      },
      onPlayerReady (player) {
        this.$emit('ready', player)
      },
      onPlayerEvent (type, player) {
        this.$emit(type, player)
      },
      onPlayerStateChange (player) {
        this.$emit('state-change', player)
      },
      setSources (sources, poster = undefined) {
        if (!Array.isArray(sources)) {
          sources = [sources]
        }
        this.playerOptions.sources = sources
        this.playerOptions.poster = poster
      }
    }
  }
</script>

<style lang="stylus">

  .video-js .vjs-time-control {
    display: block
  }

  .video-js.vjs-fluid,
  .video-js.vjs-16-9,
  .video-js.vjs-4-3 {
    width: 100%;
    max-width: 100%;
    height: calc(100vh - 52px);
    max-height: calc(100vh - 52px);
  }

  .vjs_video_427-dimensions.vjs-fluid {
    padding-top: 0;
  }
</style>
