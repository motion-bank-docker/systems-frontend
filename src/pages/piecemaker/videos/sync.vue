<template lang="pug">

  full-screen
    // q-modal(v-model="modalVideos", position="bottom", :content-css="{maxHeight: '50vh'}")
      .bg-dark
        q-btn(@click="modalVideos = false") close
        q-list.q-py-none
          div.q-pb-sm
            span.text-grey-8 Synchronize with:
          q-item.q-pa-none.cursor-pointer.relative-position(v-for="(vid, i) in refVideos", highlight, :key="vid._uuid",
          @click.native="refIndex = i")
            q-item-main.q-pa-none
              q-item-tile.lt-md.bg-darker(v-if="isMobile", style="height: 1px; width: 200vw; margin-left: -10vw;")
              q-item-tile.q-py-sm
                | {{ getRefVideoTitle(i) }}

    q-btn(v-if="timeline && !isMobile",
          slot="backButton",
          @click="$router.push(`/piecemaker/timelines/${timeline._uuid}/videos`)",
          icon="keyboard_backspace",
          small, round)

    <!--headline(:content="$t('routes.piecemaker.videos.sync.title') + ': ' + (videoMetadata && videoMetadata.title) || (video && video._uuid)")-->
    headline(:content="$t('routes.piecemaker.videos.sync.title')")

    // titles
      .row.q-mb-md

        .col-12.col-sm-6
          div(title="Applying the synchronisation will move this video in time")
            | Target video to be synchronized:
            //
              br
              span {{(videoMetadata && videoMetadata.title) || (video && video._uuid)}}

        .col-6.desktop-only
          .text-right(title="This video is used as source reference and will not be changed")
            | Synchronize with reference video:

            template(v-if="refIndex > -1")
              div
                |{{ getRefVideoTitle(refIndex) }}
                // q-btn(small, @click="refIndex = -1") {{ $t('buttons.change') }}
                q-btn.q-ml-md(@click="refIndex = -1", icon="clear", round, size="sm")

            template(v-else)
              span Select video from list below

    .row(:class="[isMobile ? 'gutter-sm' : 'gutter-md']")

      //------------------------------------------------------------------------------------------------------ left side
      .col-12.col-md-6
        div
          template(v-if="video")
            video-player.relative-position(:src="video.body.source.id", :fine-controls="true",
            @ready="onVidPlayerReady($event)")

          .q-mt-sm
            div.q-mb-sm.q-mt-xs(title="Applying the synchronisation will move this video in time")
              <!--.text-grey-8 Target video to be synchronized:-->
              .ellipsis.q-mt-xs {{(videoMetadata && videoMetadata.title) || (video && video._uuid)}}

            q-btn.border-light.q-mr-sm(@click="setMarker(vidPlayer)") {{ $t('buttons.set_marker') }}
            template(v-if="vidMarkerTimecode") {{ vidMarkerTimecode }}

      //----------------------------------------------------------------------------------------------------- right side
      .col-12.col-md-6(:class="[isMobile ? 'q-mt-lg' : '']")
        <!--div.bg-light.q-mb-lg(v-if="!video && !isMobile", style="height: 1px; width: 1000vw; margin-left: -10vw;")-->
        div

          // video player
          template(v-if="video && refIndex > -1")
            video-player.relative-position(:annotation="refVideos[refIndex]", :fine-controls="true",
            @ready="onTargetPlayerReady($event)")

            div.q-mb-sm.q-mt-sm(title="This video is used as source reference and will not be changed")
              <!--.text-grey-8 Synchronize with reference video:-->
              div(v-if="refIndex > -1")
                q-btn.absolute.q-mr-md.button-offset.border-light(@click="clearButton('video')", icon="clear", round,
                size="xs")
                .ellipsis.q-mt-xs.q-ml-lg.q-pl-sm {{ getRefVideoTitle(refIndex) }}
                // q-btn(small, @click="refIndex = -1") {{ $t('buttons.change') }}

            .q-mt-sm
              q-btn.border-light.q-mr-sm(@click="setMarker(refVidPlayer, 1)") {{ $t('buttons.set_marker') }}
              template(v-if="refVidMarkerTimecode")
                span.q-mt-xs
                  | {{ refVidMarkerTimecode }}
                  <!--q-btn.q-ml-sm.button-offset.border-light(@click="", icon="clear", round, size="xs")-->

          <!--q-btn(@click="handlerModalButton") modal-->
          // list
          template(v-else)
            //.video-list
            q-list.q-py-none(v-if="refVideos && refIndex === -1")
              div.q-pb-sm
                //
                  span.text-grey-8 Synchronize&nbsp;
                  | {{ (videoMetadata && videoMetadata.title) || (video && video._uuid) }}
                  span.text-grey-8 &nbsp;with:
                span.text-grey-8 Synchronize with:
              q-item.q-pa-none.cursor-pointer.relative-position(v-for="(vid, i) in refVideos", highlight, :key="vid._uuid",
              @click.native="refIndex = i")
                q-item-main.q-pa-none
                  q-item-tile.lt-md.bg-darker(style="height: 1px; width: 200vw; margin-left: -10vw;")
                  q-item-tile.q-py-sm
                    | {{ getRefVideoTitle(i) }}

    // video players
      .video-player.row.gutter-md

        // video to be sync'd
        //.target-video.col-xs-12.col-sm-6
        .col-xs-12.col-sm-6
          template(v-if="video")
            video-player.relative-position(:src="video.body.source.id", :fine-controls="true",
            @ready="onVidPlayerReady($event)")

        // video used as reference
        //.reference-video.col-xs-12.col-sm-6
        .col-xs-12.col-sm-6
          // template(v-if="video && refIndex > -1")
          video-player(:annotation="refVideos[refIndex]", :fine-controls="true",
          @ready="onTargetPlayerReady($event)")

          //template(v-else)
          template
            .video-list
              q-list.no-border.q-py-none(v-if="refVideos && refIndex === -1", separator)
                q-item(v-for="(vid, i) in refVideos",highlight,:key="vid._uuid",@click.native="refIndex = i")
                  | {{ getRefVideoTitle(i) }}

      .row
        .col-6
          q-btn(@click="setMarker(vidPlayer)") {{ $t('buttons.set_marker') }}
          template(v-if="vidMarkerTimecode") {{ vidMarkerTimecode }}

        .col-6
          .text-right(v-if="video && refIndex > -1")
            template(v-if="refVidMarkerTimecode") {{ refVidMarkerTimecode }}
            q-btn(@click="setMarker(refVidPlayer, 1)") {{ $t('buttons.set_marker') }}

    //----------------------------------------------------------------------------------------------------- apply button
    div.q-mt-lg.q-pt-lg.text-center(v-if="vidMarkerSelector && refVidMarkerSelector")
      q-btn(color="primary", @click="applySync()", icon="check", :label="$t('buttons.apply_synchronisation')")

</template>

<script>
  import { mapGetters } from 'vuex'

  import Vue from 'vue'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  import constants from 'mbjs-data-models/src/constants'
  import {parseURI} from 'mbjs-data-models/src/lib'
  import Headline from '../../../components/shared/elements/Headline'

  export default {
    components: {
      Headline
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
        refVidMarkerSelector: undefined,

        modalVideos: false
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
      this.getVideo()
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    },
    watch: {
      refIndex () {
        // console.log(this.refVideos[this.refIndex])
      }
    },
    methods: {
      handlerModalButton () {
        this.modalVideos = true
      },
      clearButton (val) {
        switch (val) {
        case 'video':
          this.refIndex = -1
          this.refVidMarkerSelector = undefined
          this.refVidMarkerTimecode = undefined
        }
      },
      async getVideo () {
        this.video = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        this.timeline = await this.$store.dispatch('maps/get', parseURI(this.video.target.id).uuid)
        this.$root.$emit('setBackButton', '/piecemaker/timelines/' + parseURI(this.video.target.id).uuid + '/videos')
      },
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
          vidSelector = DateTime.fromMillis(_this.video.target.selector._valueMillis),
          refVideo = this.refVideos[this.refIndex],
          refVideoSelector = DateTime.fromMillis(refVideo.target.selector._valueMillis),
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
  @import '~variables'

  /*
  .q-card-main:first-child
    border 3px solid green
    display none
  */

  /*.video-titles*/
    /*margin-bottom 1em*/

  /*
  .video-player
    .video-list
      q-list
        position absolute
        width 100%

    .reference-video
      position relative
      overflow scroll
        */

  .button-offset
    margin-top -2px

  .q-list-separator > .q-item-division + .q-item-division
    border-top 1px solid $darker

  .border-light
    border 1px solid $light

  .border-top-light
    border-top 1px solid $light

  .border-top-darker
    border-top 1px solid $darker
  .q-item
    min-height auto
</style>
