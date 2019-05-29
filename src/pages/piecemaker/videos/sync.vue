<template lang="pug">

  full-screen

    // video list modal for mobile view
    q-modal(v-model="modalVideos", position="bottom", :content-css="{maxHeight: '50vh'}")
      q-modal-layout.bg-dark.q-px-md

        // header
        q-toolbar.bg-dark.border-bottom-light.q-py-sm.q-px-none(slot="header")
          q-toolbar-title.text-weight-regular.text-grey-8.q-px-none Synchronize with:
          q-btn.border-light(@click="modalVideos = false", icon="clear", size="xs", round)

        // video list
        q-list.q-py-none
          q-item.q-pa-none.cursor-pointer(v-for="(ref, i) in refVideos", :key="ref._uuid",
          @click.native="handlerModalItem(i)")
            q-item-main.q-pa-none(:class="[i === refVideos.length - 1 ? 'q-mb-sm' : '']")
              q-item-tile.q-py-sm(:class="{'text-primary': getRefVideoTitle(refIndex) === getRefVideoTitle(i) }")
                | {{ getRefVideoTitle(i) }}
              q-item-tile.bg-darker(v-if="isMobile && i !== refVideos.length - 1", style="height: 1px;")

    <!--headline(:content="$t('routes.piecemaker.videos.sync.title') + ': ' + (videoMetadata && videoMetadata.title) || (video && video._uuid)")-->
    headline(:content="$t('routes.piecemaker.videos.sync.title')")

    .row(:class="[isMobile ? 'gutter-sm' : 'gutter-md']")

      //------------------------------------------------------------------------------------------------------ left side
      .col-12.col-md-6
        div
          // video to be sync'd
          template(v-if="video")
            video-player.relative-position(:src="video.body.source.id", :fine-controls="true",
            @ready="onVidPlayerReady($event)")

            .q-mt-sm
              div.q-mb-sm.q-mt-xs(title="Applying the synchronisation will move this video in time")
                .ellipsis.q-mt-xs {{(videoMetadata && videoMetadata.title) || (video && video._uuid)}}

              q-btn.border-light.q-mr-sm(@click="setMarker(vidPlayer)") {{ $t('buttons.set_marker') }}
              template(v-if="vidMarkerTimecode") {{ vidMarkerTimecode }}

      //----------------------------------------------------------------------------------------------------- right side
      .col-12.col-md-6

        // distance to top placeholder in mobile view
        div.lt-md.q-mt-lg

        // reference video
        template(v-if="video && refIndex > -1")
          video-player.relative-position(:annotation="refVideos[refIndex]", :fine-controls="true",
          @ready="onTargetPlayerReady($event)", :key="refIndex")

          div.q-mb-sm.q-mt-sm(v-if="refIndex > -1",
          title="This video is used as source reference and will not be changed")

            q-item.q-pa-none

              // title
              q-item-main.ellipsis {{ getRefVideoTitle(refIndex) }}

              // "change reference video" button
              q-item-side.text-right(style="min-width: auto;")
                q-btn.cursor-pointer.button-offset.border-light(@click.native="handlerRefVideoTitle", icon="edit",
                round, size="xs", title="Change video")

          .q-mt-sm
            q-btn.border-light.q-mr-sm(@click="setMarker(refVidPlayer, 1)") {{ $t('buttons.set_marker') }}
            template(v-if="refVidMarkerTimecode")
              span.q-mt-xs
                | {{ refVidMarkerTimecode }}

        // list with reference videos
        template(v-else)

          q-list.q-py-none(v-if="refVideos && refIndex === -1")
            div.q-pb-sm.text-grey-8.border-bottom-light Synchronize with:

            q-item.q-pa-none.cursor-pointer.relative-position(v-for="(vid, i) in refVideos", highlight, :key="vid._uuid",
            @click.native="refIndex = i")
              q-item-main.q-pa-none
                q-item-tile.q-py-sm(:class="{'q-caption': !isMobile}")
                  | {{ getRefVideoTitle(i) }}
                q-item-tile.bg-darker(v-if="i !== refVideos.length - 1", style="height: 1px;")

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
      handlerRefVideoTitle () {
        if (this.isMobile) {
          this.modalVideos = true
          this.refVidMarkerSelector = undefined
          this.refVidMarkerTimecode = undefined
        }
        else this.clearButton('video')
      },
      handlerModalItem (i) {
        this.refIndex = i
        this.modalVideos = false
      },
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

  .border-bottom-light
    border-bottom 1px solid $light

  .border-top-darker
    border-top 1px solid $darker

  .border-bottom-darker
    border-bottom 1px solid $darker

  .q-item,
  .q-toolbar
    min-height auto

  .q-layout-header
    box-shadow none!important
</style>
