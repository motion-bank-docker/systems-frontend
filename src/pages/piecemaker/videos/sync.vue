<template lang="pug">

  //center-card-full
  card-full
    q-btn(v-if="timeline", slot="backButton",
          @click="$router.push(`/piecemaker/timelines/${timeline.uuid}/videos`)",
      icon="keyboard_backspace", small, round)
    div(slot="form-logo")
    div(v-if="timeline", slot="form-title") {{timeline.title}}

    div.row(style="margin-top: -2em;")

      // zu synchronisierende Videos
      div.col-6.row
        p.col-12(style="min-height: 5em;")
          | Video to be synchronized:
          br
          span {{video.uuid}}
        div.video.col-12(v-if="video")
          video-player(:src="video.body.source.id",
                       @ready="onSrcPlayerReady($event)")
          div.col-12
          q-btn(@click="setMarker(srcPlayer)") {{ $t('buttons.set_marker') }}
          br
          q-btn(v-if="srcTimecode") {{ srcTimecode }}

      // Referenz-Video
      div.col-6.row
        p.col-12.text-right(style="min-height: 5em;")
          | Synchronize with:
          br
          template(v-if="refIndex >= 0")
            span {{refVideos[refIndex].uuid}}
            q-btn(v-else, small, @click="refIndex = -1") {{ $t('buttons.change') }}
          template(v-else)
            span Select video from list below

        div.video.col-12
          video-player(v-if="video && refIndex > -1",
                       :src="refVideos[refIndex].body.source.id",
                       @ready="onTargetPlayerReady($event)")
          q-list(v-if="video && refIndex === -1").no-border
            q-item(v-for="(vid, i) in refVideos",
                   highlight, :key="vid.uuid",
                   @click.native="refIndex = i")
              span {{(refVideosMetadata[vid.uuid] && refVideosMetadata[vid.uuid].title) || vid.uuid}}

        div.col-12.text-right(v-if="video && refIndex > -1")
          q-btn(@click="setMarker(targetPlayer, 1)") {{ $t('buttons.set_marker') }}
          br
          q-btn(v-if="targetTimecode") {{ targetTimecode }}

    div.text-center
      q-btn(color="primary",
            @click="applySync()") {{ $t('buttons.apply_synchronisation') }}

</template>

<script>
  import Vue from 'vue'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  import CardFull from '../../../components/shared/layouts/CardFull'
  import constants from 'mbjs-data-models/src/constants'
  import {parseURI} from 'mbjs-data-models/src/lib'
  import VideoPlayer from '../../../components/shared/media/VideoPlayer'
  import VideoTitle from '../../../components/shared/partials/VideoTitle'

  export default {
    components: {
      CardFull,
      VideoPlayer,
      VideoTitle
    },
    data () {
      return {
        tcformat: constants.TIMECODE_FORMAT,
        timeline: undefined,
        timelineUuid: undefined,
        video: undefined,
        refVideos: [],
        refVideosMetadata: {}, // video uuids are keys
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
      this.$store.dispatch('annotations/get', this.$route.params.id)
        .then(video => {
          _this.video = video
          const timelineUuid = parseURI(video.target.id).uuid
          return _this.$store.dispatch('maps/get', timelineUuid)
        })
        .then(timeline => {
          _this.timeline = timeline
          const query = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${timeline.uuid}`,
            'body.purpose': 'linking'
          }
          return _this.$store.dispatch('annotations/find', query)
        })
        .then(result => {
          _this.refVideos = result.items.filter(item => {
            if (item.uuid !== _this.$route.params.id) return true
            return false
          })
          _this.fetchRefVideoMetadata()
        })
    },
    methods: {
      async fetchRefVideoMetadata () {
        const _this = this
        if (_this.refVideos && _this.refVideos.length > 0) {
          for (const v of _this.refVideos) {
            const refVideoMeta = await _this.$store.dispatch('metadata/get', v.uuid)
            if (refVideoMeta) {
              Vue.set(_this.refVideosMetadata, v.uuid, refVideoMeta)
            }
          }
        }
      },
      onSrcPlayerReady (player) {
        this.srcPlayer = player
      },
      onTargetPlayerReady (player) {
        this.targetPlayer = player
      },
      setMarker (player, target = 0) {
        if (!player) return
        const selector = DateTime.fromMillis(player.currentTime() * 1000.0)
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
      async applySync () {
        const
          _this = this,
          diff = this.targetSelector.toMillis() - this.srcSelector.toMillis(),
          video = this.video, // this.refVideos[this.refIndex],
          selector = DateTime.fromISO(video.target.selector.value)
        selector.plus(diff)
        const update = {
          target: ObjectUtil.merge({}, video.target, {
            selector: {
              type: 'Fragment',
              value: selector.toISO()
            }
          })
        }
        if (diff !== 0) {
          await this.$store.dispatch('annotations/patch', [video.uuid, update])
            .then(annotation => {
              // TODO: Anton, we have a problem
              console.log(
                'sync updated',
                _this.targetSelector.toMillis(),
                _this.srcSelector.toMillis(),
                diff,
                video.uuid,
                annotation
              )
              // _this.$router.push(`/piecemaker/videos/${_this.$route.params.videoId}/edit`)
            })
        }
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
