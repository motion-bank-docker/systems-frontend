<template lang="pug">

  card-full
    q-btn(v-if="timeline",
          slot="backButton",
          @click="$router.push(`/piecemaker/timelines/${timeline._uuid}/videos`)",
          icon="keyboard_backspace",
          small, round)
    div(slot="form-logo")
    div(v-if="timeline", slot="form-title")

    // titles
    .video-titles.row

      .col-6.row
        .col-12(title="Applying the synchronisation will move this video in time") Target video to be synchronized:
          br
          span {{(videoMetadata && videoMetadata.title) || (video && video._uuid)}}

      .col-6.row
        .col-12.text-right(title="This video is used as source reference and will not be changed")
          | Synchronize with reference video:
          br
          template(v-if="refIndex > -1")
            span {{ getRefVideoTitle(refIndex) }}
            q-btn(small, @click="refIndex = -1") {{ $t('buttons.change') }}
          template(v-else)
            span Select video from list below

    // video players
    .video-player.row

      // video to be sync'd
      .target-video.col-6.row
        .video.col-12(v-if="video")
          video-player(:src="video.body.source.id", :fine-controls="true",
                       @ready="onVidPlayerReady($event)")

      // video used as reference
      .reference-video.col-6.row
        template(v-if="video && refIndex > -1")
          .video.col-12
            video-player(:annotation="refVideos[refIndex]", :fine-controls="true",
                         @ready="onTargetPlayerReady($event)")
        template(v-else)
          .video-list.col-12
            q-list(v-if="refVideos && refIndex === -1").no-border
              q-item(v-for="(vid, i) in refVideos",
                     highlight,
                     :key="vid._uuid",
                     @click.native="refIndex = i")
                span {{ getRefVideoTitle(i) }}

    .row
      .col-6
        q-btn(@click="setMarker(vidPlayer)") {{ $t('buttons.set_marker') }}
        template(v-if="vidMarkerTimecode") {{ vidMarkerTimecode }}

      .col-6
        .text-right(v-if="video && refIndex > -1")
          template(v-if="refVidMarkerTimecode") {{ refVidMarkerTimecode }}
          q-btn(@click="setMarker(refVidPlayer, 1)") {{ $t('buttons.set_marker') }}

    .row(v-if="vidMarkerSelector && refVidMarkerSelector")
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

  export default {
    components: {
      CardFull
    },
    data () {
      return {
        tcformat: constants.config.TIMECODE_FORMAT,

        timeline: undefined,
        timelineUuid: undefined,

        video: undefined,
        videoMetadata: undefined,
        vidPlayer: undefined,
        vidTime: undefined,
        vidMarkerTimecode: undefined,
        vidMarkerSelector: undefined,

        refVideos: [],
        refVideosMetadata: {}, // video uuids are keys
        refIndex: -1,
        refVidPlayer: undefined,
        refVidTime: undefined,
        refVidMarkerTimecode: undefined,
        refVidMarkerSelector: undefined
      }
    },
    async mounted () {
      const _this = this
      this.video = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
      this.videoMetadata = await this.$store.dispatch('metadata/get', this.video)
      const timelineUuid = parseURI(this.video.target.id).uuid
      this.timeline = await this.$store.dispatch('maps/get', timelineUuid)
      const query = {
        'target.id': this.timeline.id,
        'body.purpose': 'linking',
        'body.type': 'Video'
      }
      const result = await this.$store.dispatch('annotations/find', query)
      this.refVideos = result.items.filter(item => {
        return item._uuid !== _this.$route.params.uuid
      })
      await _this.fetchRefVideoMetadata()
    },
    watch: {
      refIndex () {
        // console.log(this.refVideos[this.refIndex])
      }
    },
    methods: {
      getRefVideoTitle (index) {
        if (index >= 0 && this.refVideos[index]) {
          const refVideo = this.refVideos[index]
          if (this.refVideosMetadata[refVideo._uuid]) {
            return this.refVideosMetadata[refVideo._uuid].title || 'Unknown Title'
          }
          else {
            return refVideo._uuid
          }
        }
        else {
          return 'Unknown Title'
        }
      },
      async fetchRefVideoMetadata () {
        if (this.refVideos && this.refVideos.length > 0) {
          for (const v of this.refVideos) {
            let refVideoMeta = await this.$store.dispatch('metadata/get', v)
            if (refVideoMeta) Vue.set(this.refVideosMetadata, v._uuid, refVideoMeta)
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
        if (target === 1) {
          this.refVidMarkerSelector = markerSelector
          this.refVidMarkerTimecode = markerSelector.toFormat(constants.config.TIMECODE_FORMAT)
        }
        else {
          this.vidMarkerSelector = markerSelector
          this.vidMarkerTimecode = markerSelector.toFormat(constants.config.TIMECODE_FORMAT)
        }
      },
      async applySync () {
        // calculate the relative difference between video and reference video:
        // diff = (reference_annotation - reference_marker) - (video_annotation + video_marker)
        const
          _this = this,
          vidSelector = DateTime.fromISO(_this.video.target.selector.value),
          refVideo = this.refVideos[this.refIndex],
          refVideoSelector = DateTime.fromISO(refVideo.target.selector.value),
          refVideoMarkerGlobalTime = refVideoSelector.plus(this.refVidMarkerSelector.toMillis()),
          videoMarkerGlobalTime = vidSelector.plus(this.vidMarkerSelector.toMillis()),
          markerDiff = refVideoMarkerGlobalTime.toMillis() - videoMarkerGlobalTime.toMillis()
        // apply difference to video annotation:
        // new_video_annotation = video_annotation + diff
        const selectorUpdated = vidSelector.plus(markerDiff)
        const update = {
          target: ObjectUtil.merge({}, _this.video.target, {
            selector: {
              type: 'Fragment',
              value: selectorUpdated.toISO()
            }
          })
        }
        await this.$store.dispatch('annotations/patch', [_this.video._uuid, update])
          .then(() => {
            // console.log(
            //   'sync updated',
            //   _this.refVidMarkerSelector.toMillis(),
            //   _this.vidMarkerSelector.toMillis(),
            //   markerDiff,
            //   refVideoSelector.toMillis(),
            //   vidSelector.toMillis(),
            //   refVideoSelector.toMillis() - vidSelector.toMillis(),
            //   _this.video._uuid
            // )
            _this.$store.commit('notifications/addMessage', {
              type: 'success',
              body: `Synchronized video “${_this.videoMetadata.title}”`
            })
            _this.$router.push(`/piecemaker/timelines/${_this.timeline._uuid}/videos`)
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
