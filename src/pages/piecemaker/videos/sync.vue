<template lang="pug">

  card-full
    q-btn(v-if="timeline",
          slot="backButton",
          @click="$router.push(`/piecemaker/timelines/${timeline.uuid}/videos`)",
          icon="keyboard_backspace",
          small, round)
    div(slot="form-logo")
    div(v-if="timeline", slot="form-title")

    // titles
    .video-titles.row

      .col-6.row
        .col-12(title="Applying the synchronisation will move this video in time") Target video to be synchronized:
          br
          span {{(videoMetadata && videoMetadata.title) || video.uuid}}

      .col-6.row
        .col-12.text-right(title="This video is used as source reference and will not be changed")
          | Synchronize with reference video:
          br
          template(v-if="refIndex >= 0")
            span {{(refVideos[refIndex] && refVideosMetadata[refVideos[refIndex].uuid] && refVideosMetadata[refVideos[refIndex].uuid].title) || refVideos[refIndex].uuid}}
            q-btn(small, @click="refIndex = -1") {{ $t('buttons.change') }}
          template(v-else)
            span Select video from list below

    // video players
    .video-player.row

      // video to be sync'd
      .target-video.col-6.row
        .video.col-12(v-if="video")
          video-player(:src="video.body.source.id",
                       @ready="onVidPlayerReady($event)")

      // video used as reference
      .reference-video.col-6.row
        template(v-if="video && refIndex > -1")
          .video.col-12
            video-player(:annotation="refVideos[refIndex]",
                         @ready="onTargetPlayerReady($event)")
        template(v-else)
          .video-list.col-12
            q-list(v-if="refVideos && refIndex === -1").no-border
              q-item(v-for="(vid, i) in refVideos",
                     highlight,
                     :key="vid.uuid",
                     @click.native="refIndex = i")
                span {{(refVideosMetadata[vid.uuid] && refVideosMetadata[vid.uuid].title) || vid.uuid}}

    .row
      .col-6
        q-btn(@click="setMarker(vidPlayer)") {{ $t('buttons.set_marker') }}
        template(v-if="vidMarkerTimecode") {{ vidMarkerTimecode }}

      .col-6
        .text-right(v-if="video && refIndex > -1")
          template(v-if="refVidMarkerTimecode") {{ refVidMarkerTimecode }}
          q-btn(@click="setMarker(refVidPlayer, 1)") {{ $t('buttons.set_marker') }}

    .row
      .col-12.text-center
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
        videoMetadata: undefined,
        refVideos: [],
        refVideosMetadata: {}, // video uuids are keys
        refIndex: -1,

        vidPlayer: undefined,
        vidTime: undefined,
        vidMarkerTimecode: undefined,
        vidMarkerSelector: undefined,

        refVidPlayer: undefined,
        refVidTime: undefined,
        refVidMarkerTimecode: undefined,
        refVidMarkerSelector: undefined
      }
    },
    mounted () {
      const _this = this
      this.$store.dispatch('annotations/get', this.$route.params.id)
        .then(video => {
          _this.video = video
          _this.fetchVideoMetadata()
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
    watch: {
      refIndex () {
        // console.log(this.refVideos[this.refIndex])
      }
    },
    methods: {
      async fetchVideoMetadata () {
        const _this = this
        const videoMeta = await _this.$store.dispatch('metadata/get', this.video.uuid)
        if (videoMeta) {
          _this.videoMetadata = videoMeta
        }
      },
      async fetchRefVideoMetadata () {
        const _this = this
        if (_this.refVideos && _this.refVideos.length > 0) {
          for (const v of _this.refVideos) {
            let refVideoMeta
            try {
              refVideoMeta = await _this.$store.dispatch('metadata/get', v.uuid)
            }
            catch (e) {}
            if (refVideoMeta) {
              Vue.set(_this.refVideosMetadata, v.uuid, refVideoMeta)
            }
          }
        }
      },
      onVidPlayerReady (player) {
        this.vidPlayer = player
      },
      onTargetPlayerReady (player) {
        this.refVidPlayer = player
      },
      setMarker (player, target = 0) {
        if (!player) return
        const markerSelector = DateTime.fromMillis(player.currentTime() * 1000.0)
        switch (target) {
        case 1:
          this.refVidMarkerSelector = markerSelector
          this.refVidMarkerTimecode = markerSelector.toFormat(constants.TIMECODE_FORMAT)
          break
        default:
          this.vidMarkerSelector = markerSelector
          this.vidMarkerTimecode = markerSelector.toFormat(constants.TIMECODE_FORMAT)
        }
      },
      async applySync () {
        const
          _this = this,
          vidSelector = DateTime.fromISO(_this.video.target.selector.value),
          refVideo = this.refVideos[this.refIndex],
          refVideoSelector = DateTime.fromISO(refVideo.target.selector.value),
          refVideoMarkerGlobalTime = refVideoSelector.plus(this.refVidMarkerSelector.toMillis()),
          videoMarkerGlobalTime = vidSelector.plus(this.vidMarkerSelector.toMillis()),
          markerDiff = refVideoMarkerGlobalTime.toMillis() - videoMarkerGlobalTime.toMillis()
        const selectorUpdated = vidSelector.plus(markerDiff)
        const update = {
          target: ObjectUtil.merge({}, _this.video.target, {
            selector: {
              type: 'Fragment',
              value: selectorUpdated.toISO()
            }
          })
        }
        await this.$store.dispatch('annotations/patch', [_this.video.uuid, update])
          .then(() => {
            // console.log(
            //   'sync updated',
            //   _this.refVidMarkerSelector.toMillis(),
            //   _this.vidMarkerSelector.toMillis(),
            //   markerDiff,
            //   refVideoSelector.toMillis(),
            //   vidSelector.toMillis(),
            //   refVideoSelector.toMillis() - vidSelector.toMillis(),
            //   _this.video.uuid
            // )
            _this.$router.push(`/piecemaker/timelines/${_this.timeline.uuid}/videos`)
          })
      }
    }
  }
</script>

<style lang="stylus">
  .q-card-main:first-child
    border 3px solid green
    display none

  .video-titles
    margin-bottom 1em

  .video-player
    .video-list
      q-list
        position absolute
        width 100%

    .reference-video
      position relative
      overflow scroll
</style>
