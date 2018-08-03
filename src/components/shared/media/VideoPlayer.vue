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
  // require('videojs-framebyframe')

  import { videoPlayer } from 'vue-video-player'
  import { guessType } from 'mbjs-media/src/util/metadata'

  export default {
    components: {
      videoPlayer
    },
    data () {
      return {
        type: undefined,
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
          },
          plugins: {
            /* framebyframe: {
              fps: 23.98, // FIXME: 25.0 ?!?, make "smart"
              steps: [
                {text: '-1s', step: -24},
                {text: '-1f', step: -1},
                {text: '+1f', step: 1},
                {text: '+1s', step: 24}
              ]
            } */
          }
        }
      }
    },
    props: ['src', 'annotation'],
    async mounted () {
      await this.getSource(this.src, this.annotation)
    },
    watch: {
      async src (val) {
        await this.getSource(val, this.annotation)
      },
      async annotation (val) {
        await this.getSource(this.src, val)
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
          const meta = await this.$store.dispatch('metadata/get', annotation.uuid)
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
        this.playerOptions.sources = sources
        this.playerOptions.poster = poster
      }
    }
  }
</script>
