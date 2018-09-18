<template lang="pug">

  .column(style="height:100%")
    .col(ref="videoContainer")
      vue-video-player(
        class="video-player video-player-box vjs-big-play-centered",
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
    .col-1
      q-btn Play
      q-btn Pause
      q-btn Stop
      q-btn Start
      q-btn Delete

</template>

<script>
  require('video.js/dist/video-js.css')
  require('vue-video-player/src/custom-theme.css')
  require('videojs-youtube')
  require('videojs-framebyframe')

  require('videojs-vimeo/src/Vimeo')
  import { videoPlayer } from 'vue-video-player'
  import guessType from 'mbjs-media/src/util/guess-type'

  export default {
    components: {
      'vue-video-player': videoPlayer
    },
    data () {
      return {
        type: undefined,
        playerOptions: {
          fluid: true,
          autoplay: this.autoplay,
          width: 640,
          techOrder: ['html5'],
          language: 'en',
          playbackRates: this.playbackRates ? [0.25, 0.5, 1.0, 1.5, 2.0] : undefined,
          sources: [],
          poster: undefined,
          controlBar: undefined,
          controls: false,
          plugins: {
            // framebyframe: {
            //   fps: 23.98, // FIXME: 25.0 ?!?, make "smart"
            //   steps: [
            //     {text: '-1s', step: -24},
            //     {text: '-1f', step: -1},
            //     {text: '+1f', step: 1},
            //     {text: '+1s', step: 24}
            //   ]
            // }
          }
        }
      }
    },
    props: ['src', 'annotation', 'autoplay', 'playbackRates', 'noControls'],
    async mounted () {
      await this.getSource(this.src, this.annotation)
    },
    watch: {
      async src (val) {
        await this.getSource(val, this.annotation)
      },
      async annotation (val) {
        await this.getSource(this.src, val)
      },
      autoplay (val) {
        this.playerOptions.autoplay = val
      }
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      onPlayerReady (player) {
        this.$emit('ready', player)
      },
      async getSource (src, annotation = undefined) {
        if (!src && !annotation) return
        this.type = guessType(src || annotation.body.source.id)
        if (this.type === 'video/youtube') {
          this.playerOptions.techOrder = ['youtube']
        }
        else if (this.type === 'video/vimeo') {
          this.playerOptions.techOrder = ['vimeo']
        }
        else if (this.type === 'video/panopto' && annotation) {
          this.type = 'video/mp4'
          const meta = await this.$store.dispatch('metadata/get', annotation)
          if (meta && meta.video) src = meta.video
          else console.error('panopto video failed to load', meta.video)
        }
        if (!src && annotation) src = annotation.body.source.id
        this.setSources([{ type: this.type, src: src }])
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
        if (poster) this.playerOptions.poster = poster
        if (!this.playerOptions.sources || !this.playerOptions.sources.length) {
          this.playerOptions.sources = sources
        }
        else {
          this.player.src(sources)
          this.player.load()
        }
      },
      reset () {
        this.$refs.videoPlayer.player.reset()
      }
    }
  }
</script>

<style lang="stylus">
  .video-player .video-js .vjs-big-play-button
    display: none
  .video-player .vjs-default-skin.vjs-paused .vjs-control-bar
    display flex
</style>
