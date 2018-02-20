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
      if (!this.type) {
        this.guessType()
      }
      if (this.type === 'video/youtube') {
        this.playerOptions.techOrder = ['youtube']
      }
      else if (this.type === 'video/vimeo') {
        this.playerOptions.techOrder = ['vimeo']
      }
      this.setSources([{ type: this.type, src: this.src }])
    },
    watch: {
      src (val) {
        if (val) {
          if (!this.type) {
            this.guessType()
          }
          const _this = this
          this.setSources([{type: _this.type, src: val}])
        }
      }
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      guessType () {
        if (this.src.indexOf('youtube.com') > -1) {
          this.type = 'video/youtube'
        }
        else if (this.src.indexOf('vimeo.com') > -1) {
          this.type = 'video/vimeo'
        }
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
  .video-js .vjs-time-control { display: block }
</style>
