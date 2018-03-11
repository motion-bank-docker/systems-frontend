<template lang="pug">

  //center-card-full
  card-full
    q-btn(slot="backButton", @click="$router.push(`/piecemaker/videos/${$route.params.videoId}/edit`)",
      icon="keyboard_backspace", small, round)
    div(slot="form-logo")
    div(slot="form-title")

    div.row(style="margin-top: -2em;")

      // zu synchronisierende Videos
      div.col-6.row
        p.col-12(style="min-height: 5em;")
          | Video to be synchronized:
          br
          video-title(:source="video.body.source")
        div.video.col-12(v-if="video")
          video-player(:src="video.body", @ready="onSrcPlayerReady($event)")
          div.col-12
          q-btn(@click="setMarker(srcPlayer)") {{ $t('buttons.set_marker') }}
          br
          q-btn(v-if="srcTimecode") {{ srcTimecode }}

      // Referenz-Video
      div.col-6.row
        p.col-12.text-right(style="min-height: 5em;")
          | Synchronize with:
          br
          video-title(v-if="video && refIndex > -1", :source="refVideos[refIndex].body.source")
          q-btn(small, @click="refIndex = -1") {{ $t('buttons.change') }}

        div.video.col-12
          video-player(v-if="video && refIndex > -1", :src="refVideos[refIndex].body", @ready="onTargetPlayerReady($event)")
          q-list(v-if="video && refIndex === -1").no-border
            q-item(v-for="(vid, i) in refVideos", highlight, :key="vid.uuid", @click="refIndex = i")
              video-title(:source="vid.body.source")

        div.col-12.text-right(v-if="video && refIndex > -1")
          q-btn(@click="setMarker(targetPlayer, 1)") {{ $t('buttons.set_marker') }}
          br
          q-btn(v-if="targetTimecode") {{ targetTimecode }}

    div.text-center
      q-btn(color="primary", @click="applySync()") {{ $t('buttons.apply_synchronisation') }}

</template>

<script>
  import { QBtn, QList, QItem } from 'quasar-framework'
  import CardFull from '../../../shared/layouts/CardFull'
  import constants from '../../../../lib/constants'
  import TimelineSelector from '../../../../lib/annotations/selectors/timeline'
  import VideoPlayer from '../../../shared/media/VideoPlayer'
  import VideoTitle from '../../../shared/partials/VideoTitle'

  export default {
    components: {
      QBtn,
      QList,
      QItem,
      CardFull,
      VideoPlayer,
      VideoTitle
    },
    data () {
      return {
        tcformat: constants.TIMECODE_FORMAT,
        group: undefined,
        video: undefined,
        refVideos: [],
        refIndex: -1,
        srcPlayer: undefined,
        srcTime: undefined,
        srcTimecode: undefined,
        srcSelector: undefined,
        targetPlayer: undefined,
        targetTime: undefined,
        targetTimecode: undefined,
        targetSelector: undefined
      }
    },
    mounted () {
      const _this = this
      this.$store.dispatch('annotations/get', this.$route.params.videoId)
        .then(video => {
          _this.video = video
          return _this.$store.dispatch('maps/get', this.$route.params.groupId)
        })
        .then(group => {
          _this.group = group
          const query = {
            'target.id': group.uuid,
            'body.purpose': 'linking'
          }
          return _this.$store.dispatch('annotations/find', { query })
        })
        .then(videos => {
          _this.refVideos = videos.filter(item => {
            if (item.uuid !== _this.$route.params.videoId) return true
            return false
          })
        })
    },
    methods: {
      onSrcPlayerReady (player) {
        this.srcPlayer = player
      },
      onTargetPlayerReady (player) {
        this.targetPlayer = player
      },
      setMarker (player, target = 0) {
        if (!player) return
        const selector = TimelineSelector.fromMilliseconds(player.currentTime() * 1000.0)
        switch (target) {
          case 1:
            this.targetSelector = selector
            this.targetTimecode = this.targetSelector.toFormat(constants.TIMECODE_FORMAT)
            break
          default:
            this.srcSelector = selector
            this.srcTimecode = this.srcSelector.toFormat(constants.TIMECODE_FORMAT)
        }
      },
      applySync () {
        const
          _this = this,
          diff = this.targetSelector.millis - this.srcSelector.millis,
          video = this.refVideos[this.refIndex],
          selector = TimelineSelector.fromISOString(video.target.selector.value)
        selector.add(diff)
        const update = {
          target: Object.assign({}, video.target, {
            selector: {
              type: 'Fragment',
              value: selector.toString()
            }
          })
        }
        return this.$store.dispatch('annotations/patch', [video.uuid, update])
          .then(annotation => {
            console.log('sync updated', video.uuid, annotation, diff)
            _this.$router.push(`/piecemaker/videos/${_this.$route.params.videoId}/edit`)
          })
      }
    }
  }
</script>

<style>
  /* .layout-padding {
    padding-top: 0!important;
    margin-top: 0!important;
  } */
</style>
