<template lang="pug">

  card-full
    q-btn(v-if="timeline", slot="backButton",
          @click="$router.push(`/piecemaker/timelines/${timeline.uuid}/videos`)",
      icon="keyboard_backspace", small, round)
    div(slot="form-logo")
    div(v-if="timeline", slot="form-title")

    div.row(style="margin-top: -2em;")

      // video to be sync'd
      div.col-6.row
        p.col-12(style="min-height: 5em;", title="Applying the synchronisation will move this video in time")
          | Target video to be synchronized:
          br
          span {{video.uuid}}
        div.video.col-12(v-if="video")
          video-player(:src="video.body.source.id",
                       @ready="onVidPlayerReady($event)")
          div.col-12
          q-btn(@click="setMarker(vidPlayer)") {{ $t('buttons.set_marker') }}
          br
          q-btn(v-if="vidMarkerTimecode") {{ vidMarkerTimecode }}

      // video used as reference
      div.col-6.row
        p.col-12.text-right(style="min-height: 5em;", title="This video is used as source reference and will not be changed")
          | Synchronize with reference video:
          br
          template(v-if="refIndex >= 0")
            span {{(refVideos[refIndex] && refVideosMetadata[refVideos[refIndex].uuid] && refVideosMetadata[refVideos[refIndex].uuid].title) || refVideos[refIndex].uuid}}
            q-btn(small, @click="refIndex = -1") {{ $t('buttons.change') }}
          template(v-else)
            span Select video from list below

        div.video.col-12
          video-player(v-if="video && refIndex > -1",
                       :src="refVideos[refIndex].body.source.id",
                       @ready="onTargetPlayerReady($event)")
          q-list(v-if="video && refIndex === -1").no-border
            q-item
            | Please select a video from the list below
            q-item(v-for="(vid, i) in refVideos",
                   highlight, :key="vid.uuid",
                   @click.native="refIndex = i")
              span {{(refVideosMetadata[vid.uuid] && refVideosMetadata[vid.uuid].title) || vid.uuid}}

        div.col-12.text-right(v-if="video && refIndex > -1")
          q-btn(@click="setMarker(refVidPlayer, 1)") {{ $t('buttons.set_marker') }}
          br
          q-btn(v-if="refVidMarkerTimecode") {{ refVidMarkerTimecode }}

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

<style>
  /* .layout-padding {
    padding-top: 0!important;
    margin-top: 0!important;
  } */
</style>
