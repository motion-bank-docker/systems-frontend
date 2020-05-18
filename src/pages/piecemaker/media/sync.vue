<template lang="pug">

  full-screen

    // media list modal for mobile view
    q-modal(v-model="modalMedia", position="bottom", :content-css="{maxHeight: '50vh'}")
      q-modal-layout.bg-dark.q-px-md

        // header
        q-toolbar.bg-dark.ui-border-bottom.q-py-sm.q-px-none(slot="header")
          q-toolbar-title.text-weight-regular.text-grey-8.q-px-none Synchronize with:
          q-btn.border-light(@click="modalMedia = false", icon="clear", size="xs", round)

        // media list
        q-list.q-py-none
          q-item.q-pa-none.cursor-pointer(v-for="(ref, i) in refMedia", :key="ref._uuid",
            @click.native="handlerModalItem(i)")
            q-item-main.q-pa-none(:class="[i === refMedia.length - 1 ? 'q-mb-sm' : '']")
              q-item-tile.q-py-sm(:class="{'text-primary': getRefMediaTitle(refIndex) === getRefMediaTitle(i) }")
                | {{ getRefMediaTitle(i) }}
              q-item-tile.bg-darker(v-if="isMobile && i !== refMedia.length - 1", style="height: 1px;")

    <!--headline(:content="$t('routes.piecemaker.media.sync.title') + ': ' + (mediaMetadata && mediaMetadata.title) || (media && media._uuid)")-->
    headline(:content="$t('routes.piecemaker.media.sync.title')")

    .row(:class="[isMobile ? 'gutter-sm' : 'gutter-md']")

      //------------------------------------------------------------------------------------------------------ left side
      .col-12.col-md-6
        div
          // media to be sync'd
          template(v-if="media")
            div.relative-position
              media-player.relative-position(:src="media.body.source.id", :fine-controls="true",
              @ready="onVidPlayerReady($event)")

            .q-mt-sm
              div.q-mb-sm.q-mt-xs(title="Applying the synchronisation will move this media in time")
                .ellipsis.q-mt-xs {{(mediaMetadata && mediaMetadata.title) || (media && media._uuid)}}

              q-btn.border-light.q-mr-sm(@click="setMarker(vidPlayer)") {{ $t('buttons.set_marker') }}
              template(v-if="vidMarkerTimecode") {{ vidMarkerTimecode }}

      //----------------------------------------------------------------------------------------------------- right side
      .col-12.col-md-6

        // distance to top placeholder in mobile view
        div.lt-md.q-mt-lg

        // reference media
        template(v-if="media && refIndex > -1")
          div.relative-position
            media-player.relative-position(:annotation="refMedia[refIndex]", :fine-controls="true",
            @ready="onTargetPlayerReady($event)", :key="refIndex")

          div.q-mb-sm.q-mt-sm(v-if="refIndex > -1",
            title="This media is used as source reference and will not be changed")

            q-item.q-pa-none

              // title
              q-item-main.ellipsis {{ getRefMediaTitle(refIndex) }}

              // "change reference media" button
              q-item-side.text-right(style="min-width: auto;")
                q-btn.cursor-pointer.button-offset.border-light(@click.native="handlerRefMediaTitle", icon="edit",
                  round, size="xs", title="Change media")

          .q-mt-sm
            q-btn.border-light.q-mr-sm(@click="setMarker(refVidPlayer, 1)") {{ $t('buttons.set_marker') }}
            template(v-if="refVidMarkerTimecode")
              span.q-mt-xs
                | {{ refVidMarkerTimecode }}

        // list with reference media
        template(v-else)

          q-list.q-py-none(v-if="refMedia && refIndex === -1")
            div.q-pb-sm.text-grey-8.ui-border-bottom Synchronize with:

            q-item.q-pa-none.cursor-pointer.relative-position(v-for="(vid, i) in refMedia", highlight, :key="vid._uuid",
              @click.native="refIndex = i")
              q-item-main.q-pa-none
                q-item-tile.q-py-sm(:class="{'q-caption': !isMobile}")
                  | {{ getRefMediaTitle(i) }}
                q-item-tile.bg-darker(v-if="i !== refMedia.length - 1", style="height: 1px;")

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
  import { Map } from 'mbjs-data-models'
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

        media: undefined,
        mediaMetadata: undefined,
        vidPlayer: undefined,
        vidTime: undefined,
        vidMarkerTimecode: undefined,
        vidMarkerSelector: undefined,

        refMedia: [],
        refMediaMetadata: {}, // media uuids are keys
        refIndex: -1,
        refVidPlayer: undefined,
        refVidTime: undefined,
        refVidMarkerTimecode: undefined,
        refVidMarkerSelector: undefined,

        modalMedia: false
      }
    },
    async mounted () {
      const _this = this
      this.media = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
      this.mediaMetadata = await this.$store.dispatch('metadata/get', this.media)
      const timelineUuid = parseURI(this.media.target.id).uuid
      this.timeline = await this.$store.dispatch('maps/get', timelineUuid)
      const query = {
        'target.id': this.timeline.id,
        'body.purpose': 'linking',
        'body.type': { $in: ['Video', 'Audio'] }
      }
      const result = await this.$store.dispatch('annotations/find', query)
      this.refMedia = result.items.filter(item => {
        return item._uuid !== _this.$route.params.uuid
      })
      await _this.fetchRefMediaMetadata()
      this.getMedia()
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    },
    methods: {
      handlerRefMediaTitle () {
        if (this.$q.platform.is.mobile) {
          this.modalMedia = true
          this.refVidMarkerSelector = undefined
          this.refVidMarkerTimecode = undefined
        }
        else this.clearButton('media')
      },
      handlerModalItem (i) {
        this.refIndex = i
        this.modalMedia = false
      },
      handlerModalButton () {
        this.modalMedia = true
      },
      clearButton (val) {
        switch (val) {
        case 'media':
          this.refIndex = -1
          this.refVidMarkerSelector = undefined
          this.refVidMarkerTimecode = undefined
        }
      },
      async getMedia () {
        this.media = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        this.timeline = await this.$store.dispatch('maps/get', parseURI(this.media.target.id).uuid)
        this.$root.$emit('setBackButton', '/piecemaker/timelines/' + parseURI(this.media.target.id).uuid + '/media')
      },
      getRefMediaTitle (index) {
        if (index >= 0 && this.refMedia[index]) {
          const refMedia = this.refMedia[index]
          if (this.refMediaMetadata[refMedia._uuid]) {
            return this.refMediaMetadata[refMedia._uuid].title || 'Unknown Title'
          }
          else {
            return refMedia._uuid
          }
        }
        else {
          return 'Unknown Title'
        }
      },
      async fetchRefMediaMetadata () {
        if (this.refMedia && this.refMedia.length > 0) {
          for (const v of this.refMedia) {
            let refMediaMeta = await this.$store.dispatch('metadata/get', v)
            if (refMediaMeta) Vue.set(this.refMediaMetadata, v._uuid, refMediaMeta)
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
        // calculate the relative difference between media and reference media:
        // diff = (reference_annotation - reference_marker) - (media_annotation + media_marker)
        const
          _this = this,
          vidSelector = DateTime.fromMillis(_this.media.target.selector._valueMillis),
          refMedia = this.refMedia[this.refIndex],
          refMediaSelector = DateTime.fromMillis(refMedia.target.selector._valueMillis),
          refMediaMarkerGlobalTime = refMediaSelector.plus(this.refVidMarkerSelector.toMillis()),
          mediaMarkerGlobalTime = vidSelector.plus(this.vidMarkerSelector.toMillis()),
          markerDiff = refMediaMarkerGlobalTime.toMillis() - mediaMarkerGlobalTime.toMillis()
        // apply difference to media annotation:
        // new_media_annotation = media_annotation + diff
        const selectorUpdated = vidSelector.plus(markerDiff)
        const tempMap = new Map()
        const end = _this.media.target.selector._valueDuration
          ? selectorUpdated.plus(_this.media.target.selector._valueDuration) : undefined
        const target = tempMap.getInterval(selectorUpdated.toISO(), end)
        const update = {
          target: ObjectUtil.merge({}, _this.media.target, {
            selector: {
              value: target.selector.value
            }
          })
        }
        await this.$store.dispatch('annotations/patch', [_this.media._uuid, update])
          .then(() => {
            // console.debug(
            //   'sync updated',
            //   _this.refVidMarkerSelector.toMillis(),
            //   _this.vidMarkerSelector.toMillis(),
            //   markerDiff,
            //   refMediaSelector.toMillis(),
            //   vidSelector.toMillis(),
            //   refMediaSelector.toMillis() - vidSelector.toMillis(),
            //   _this.media._uuid
            // )
            _this.$store.commit('notifications/addMessage', {
              type: 'success',
              body: `Synchronized media “${_this.mediaMetadata.title}”`
            })
            _this.$router.push(`/piecemaker/timelines/${_this.timeline._uuid}/media`)
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

  /*.media-titles*/
  /*margin-bottom 1em*/

  /*
  .media-player
    .media-list
      q-list
        position absolute
        width 100%

    .reference-media
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
