<template lang="pug">

  .bg-dark(style="height: calc(100vh - 52px); overflow: hidden;")

    q-window-resize-observable(@resize="onViewportResize")

    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    .bg-dark.relative-position(style="height: calc(100vh - 52px);")

      // media player

      div.relative-position(:style="{height: videoHeight + 'px', maxHeight: viewport.height - 52 - 250 + 'px'}",
      :class="[!visibilitySwimlanes ? 'fit' : '']")

        bvh-player.full-height.relative-position(v-if="media && isBvh", :auth="playerAuth",
          @ready="playerReady($event)", @timeupdate="onPlayerTime($event)",
          :bvh-path="media.body.source.id", :scale="0.05", :loop="true",
          background-color="#181818")

        media-player.full-height.relative-position(v-if="media && isVideo", :annotation="media", :fine-controls="true",
        :post-errors="true", @ready="playerReady($event)", @timeupdate="onPlayerTime($event)" :auth="playerAuth")

        q-chip.q-ma-md.absolute-top-left(v-if="isLive") {{ $t('labels.live') }}

      // swimlane content

      .absolute-bottom-right.bg-dark.full-width.ui-border-top(
      v-if="visibilitySwimlanes",
      :style="{height: swimlanesHeight + 'px', minHeight: '250px'}",
      ref="swimlaneWrap")

        swim-lane(
        v-if="timeline",
        ref="swimLane",
        :map="timeline",
        :timelineUuid="timeline._uuid",
        :markerDetails="false",
        :resizable="true",
        :mayEdit="mayEdit",
        :isLive="isLive",
        :start="mediaDate.toMillis()",
        :duration="mediaDuration",
        :annotations="annotations",
        :media="media",
        :key="componentKey",
        :selectedMillis="selectedMillis",
        :focusedAnnotation="focusedAnnotation",
        @emitHandler="handlerToggle('swimlanes')",
        @timecodeChange="gotoMillis",
        @updateAnnotation="updateAnnotation")

      // input field for new annotations

      q-page-sticky(position="top")

        annotation-field(
        v-if="mayEdit",
        @annotation="onAnnotation",
        ref="annotationField",
        :submit-on-num-enters="1",
        :selector-value="baseSelector",
        :hasTransparency="true")

    // anntoation list filters, settings, etc.

    div.fixed-right-top.bg-light.q-pr-md.q-pl-md(style="width: 400px; top: 50px; z-index: 1010;")
      q-input(float-label="Filter", value="")

    // annotations list

    q-layout-drawer.bg-dark(
    v-if="annotations && drawer !== undefined",
    v-model="drawer",
    side="right",
    :width="400")

      .absolute.fit.bg-dark(style="")

      q-list.bg-dark.q-py-none(dark, @mouseleave.native="currentHover === undefined")
        q-item.annotation-list-item.q-pb-lg(
        dark,
        v-for="(annotation, i) in annotations",
        :key="annotation._uuid",
        :ref="annotation._uuid",
        :class="{'is-selected' : currentIndex === i || editAnnotationIndex === i, 'is-being-edited': editAnnotationIndex === i}",
        @mouseover.native="setHover(annotation._uuid)")

          q-item-main
            q-item-tile.relative-position

              .row.items-center.q-mt-sm
                annotation-icon.q-mr-sm.cursor-pointer(
                :annotation="annotation",
                :isSelected="selectedAnnotation ? selectedAnnotation._uuid === annotation._uuid : false",
                @click.native="gotoSelector(annotation.target.selector, false, annotation)")

                timecode-label(
                @click.native="gotoSelector(annotation.target.selector, false, annotation)",
                :millis="annotation.target.selector._valueMillis",
                :videoDate="mediaDate")

                // annotation has duration

                template(v-if="annotation.target.selector._valueDuration")
                  .timecode-label-duration-spacer

                  timecode-label(
                  @click.native="gotoSelector(annotation.target.selector, true, annotation)",
                  :millis="getAnnotationEndMillis(annotation)",
                  :videoDate="mediaDate")

                // add timecode button

                template(v-else)
                  .timecode-label-duration-spacer.show-on-hover(v-if="mayEdit")

                  timecode-label.show-on-hover(
                  v-if="mayEdit",
                  @click.native="addDurationToAnnotation(annotation)",
                  text="Add current timecode")

              .q-caption.q-ml-lg.q-mt-xs.q-pl-sm(style="color: #fff8;") {{ annotation.creator.name }}

              // buttons

              <!--div.float-right(v-if="currentHover === annotation.uuid")-->
              .absolute-top-right.annotation-list-item-buttons.show-on-hover.show-on-edit(style="margin-top: -4px;")

                q-btn.float-right(v-if="mayEdit", @click="$refs.confirmModal.show('messages.confirm_delete', annotation, 'buttons.delete')",
                size="xs", flat, icon="delete", round)

                q-btn.q-mr-sm(
                v-if="mayEdit && (!isEditingAnnotations && annotation.body.type === 'TextualBody' || editAnnotationIndex !== i && annotation.body.type !== 'VocabularyEntry')",
                @click="setEditIndex(i)", size="xs", icon="edit", round, flat)

                q-btn.float-right.q-mr-sm(v-if="mayEdit && annotation.body.type === 'TextualBody' && editAnnotationIndex === i",
                @click="updateAnnotation(annotation)", size="xs", :color="isAnnotationDirty ? 'primary' : undefined",
                icon="save", round, flat)

            // text content

            q-item-tile
              markdown-display.markdown-display.q-mt-sm(v-if="!isEditingAnnotations || editAnnotationIndex !== i",
              :content="annotation.body.value", :options="mdOptions")

              q-input.q-mt-sm.q-mb-sm(v-if="annotation.body.type === 'TextualBody' && editAnnotationIndex === i", color="white",
              type="textarea", v-model="annotation.body.value", dark)

</template>

<script>
  import { mapGetters } from 'vuex'
  import { scroll, AppFullscreen } from 'quasar'
  import uuidValidate from 'uuid-validate'
  import { DateTime, Interval } from 'luxon'

  import { ObjectUtil, Assert, uuid } from 'mbjs-utils'
  import { userHasFeature } from 'mbjs-quasar/src/lib'
  import constants from 'mbjs-data-models/src/constants'
  import parseURI from 'mbjs-data-models/src/lib/parse-uri'

  import AnnotationField from '../../../components/piecemaker/partials/AnnotationField'
  import SwimLane from '../../../components/piecemaker/partials/SwimLane/SwimLane'
  import TimecodeLabel from '../../../components/shared/partials/TimecodeLabel'
  import AnnotationIcon from '../../../components/piecemaker/partials/AnnotationIcon'
  import BvhPlayer from '../../../components/shared/media/BvhPlayer'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      AnnotationIcon,
      AnnotationField,
      BvhPlayer,
      SwimLane,
      TimecodeLabel
    },
    async mounted () {
      if (this.$route.params.uuid) {
        this.$q.loading.show()
        await this.getMedia()
        await this.getAnnotations()
        this.$q.loading.hide()
      }
      this.drawer = this.visibilityDrawer
      this.setupScreen()
      this.setVideoHeight()

      this.$root.$on('emitSelector', this.gotoSelector)
      this.$root.$on('annotationEndMillis', this.getAnnotationEndMillis)
    },
    beforeDestroy () {
      this.$root.$off('emitSelector', this.gotoSelector)
      this.$root.$off('annotationEndMillis', this.getAnnotationEndMillis)

      this.$store.commit('swimLane/setSelectedAnnotation')
      AppFullscreen.exit()
    },
    data () {
      return {
        mayEdit: false,
        active: false,
        annotations: [],
        currentHover: undefined,
        fullscreen: false,
        headerHeight: 52,
        inputStyle: true,
        metadata: undefined,
        player: undefined,
        playerTime: 0.0,
        selector: undefined,
        staging: process.env.IS_STAGING,
        timelineUuid: undefined,
        timeline: undefined,
        media: undefined,
        // detailsSize: 300,
        editAnnotationIndex: undefined,
        editAnnotationBuffer: undefined,
        hashTimeout: undefined,
        mdOptions: {
          target: '_blank'
        },
        viewport: {height: undefined, width: undefined},
        swimlanesHeight: undefined,
        videoHeight: undefined,
        detailsWidth: undefined,
        componentKey: 0,
        selectedMillis: undefined,
        fRendererMarker: false,
        drawer: undefined
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        selectedAnnotation: 'swimLane/getSelectedAnnotation',
        visibilityDrawer: 'swimLane/getVisibilityDrawer',
        visibilitySwimlanesSetting: 'swimLane/getVisibilitySwimlanes',
        visibilityDetails: 'swimLane/getVisibilityDetails',
        isMobile: 'globalSettings/getIsMobile'
      }),
      visibilitySwimlanes () {
        return !this.isBvh && this.visibilitySwimlanesSetting
      },
      storeCursorTop () {
        return this.$store.state.swimLane.cursorTop
      },
      userHasSwimlane () {
        return userHasFeature(this.user, 'swimlane')
      },
      hashValue () {
        return this.$route.hash.length ? this.$route.hash.substr(1) : undefined
      },
      currentIndex () {
        if (!this.annotations || !this.annotations.length) return

        let idx = -1, annotation = this.annotations[0]
        while (annotation && idx < this.annotations.length && this.baseMillis >= annotation.target.selector._valueMillis) {
          idx++
          annotation = this.annotations[idx + 1]
        }
        return idx
      },
      baseSelector () {
        if (!this.media) return { key: 'date-time:t', value: DateTime.local().toISO() }
        const
          parsed = this.media.target.selector.parse(),
          start = Array.isArray(parsed['date-time:t']) ? parsed['date-time:t'][0] : parsed['date-time:t']
        return { key: 'date-time:t', value: start.plus(this.playerTime * 1000).toISO() }
      },
      baseMillis () {
        if (!this.media) return DateTime.local().toMillis()
        return this.media.target.selector._valueMillis + this.playerTime * 1000
      },
      isEditingAnnotations () {
        return typeof this.editAnnotationIndex === 'number'
      },
      isAnnotationDirty () {
        return this.isEditingAnnotations &&
          this.annotations[this.editAnnotationIndex].body.value !== this.editAnnotationBuffer
      },
      mediaDate () {
        if (this.media && this.media.target.selector) {
          return DateTime.fromMillis(this.media.target.selector._valueMillis)
        }
        else return DateTime.local()
      },
      mediaDuration () {
        if (this.media && this.media.target.selector) {
          let duration = this.media.target.selector.getDuration()
          if (duration) {
            return duration.as('milliseconds')
          }
          else {
            const videoDate = DateTime.fromMillis(this.media.target.selector._valueMillis)
            duration = Interval.fromDateTimes(videoDate, DateTime.local()).toDuration()
            return duration.as('milliseconds')
          }
        }
        return 0
      },
      playerAuth () {
        const auth = { query: {} }
        if (this.isApiSource && this.$auth.token) {
          auth.query[this.$auth.tokenType.toLowerCase()] = this.$auth.token
        }
        return auth
      },
      isApiSource () {
        if (!this.media) return
        return this.media.body.source.id.indexOf(process.env.API_HOST) === 0
      },
      isLive () {
        return this.metadata && this.metadata.liveBroadcastContent === 'live'
      },
      isVideo () {
        if (!this.media) return false
        return this.media.body.source.type.indexOf('video') === 0
      },
      isBvh () {
        if (!this.media) return false
        return this.media.body.source.type === 'animation/bvh'
      }
    },
    watch: {
      storeCursorTop (val) {
        // this.mediaHeight = val - this.headerHeight
        this.swimlanesHeight = (this.viewport.height - val)
        this.setVideoHeight()
      },
      visibilityDrawer (val) {
        this.drawer = val
        this.$refs.swimLane.updateCache(400)
      },
      currentIndex (val) {
        if (typeof this.editAnnotationIndex === 'number') return
        if (this.annotations[val]) this.scrollToAnnotation(this.annotations[val]._uuid)
      }
    },
    methods: {
      setVideoHeight () {
        this.videoHeight = this.viewport.height - this.swimlanesHeight - this.headerHeight
      },
      setupScreen () {
        this.$store.commit('swimLane/setSelectedAnnotation', null)
        if (this.$store.state.swimLane.cursorTop) {
          // this.mediaHeight = this.$store.state.swimLane.cursorTop - this.headerHeight
          this.swimlanesHeight = (this.viewport.height - this.$store.state.swimLane.cursorTop)
        }
        else {
          // this.mediaHeight = this.viewport.height / 2 - this.headerHeight
          this.swimlanesHeight = this.viewport.height / 4
        }
      },
      setHover (val) {
        this.currentHover = val
      },
      getInitials (val) {
        let matches = val.split(' ').map((n) => n[0]).join('')
        return matches
      },
      /*
      onEmitResize (val) {
        if (this.swimlanes) {
          this.swimlanesHeight = (this.viewport.height + this.headerHeight - val)
          // this.mediaHeight = this.viewport.height - 52 - this.swimlanesHeight
        }
      },
      */
      onViewportResize (size) {
        this.viewport.height = size.height
        this.viewport.width = size.width
        // this.mediaHeight = this.viewport.height - 52 - this.swimlanesHeight
        this.setVideoHeight()
      },
      handlerToggle (val) {
        switch (val) {
        case 'annotations':
          this.$store.commit('swimLane/setVisibilityDrawer')
          setTimeout(() => {
            this.onForceRenderer()
          }, 200)
          break
        case 'swimlanes':this.$store.commit('swimLane/setVisibilitySwimlanes')
          break
        }
      },
      async handleConfirmModal (annotation) {
        await this.deleteAnnotation(annotation._uuid)
      },
      toggleFullscreen () {
        AppFullscreen.toggle()
        this.fullscreen = !this.fullscreen
      },
      async getMedia () {
        this.media = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        this.timeline = await this.$store.dispatch('maps/get', parseURI(this.media.target.id).uuid)
        if (this.timeline) {
          try {
            const acl = await this.$store.dispatch('acl/isAllowed',
              { id: this.timeline.id, permission: 'get' })
            this.mayEdit = !!(acl || {}).get
          }
          catch (err) {
            this.$handleError(this, err)
          }
        }
        this.$root.$emit('setBackButton', '/piecemaker/timelines/' + parseURI(this.media.target.id).uuid + '/media')
        if (this.media) {
          let duration
          if (this.media.target.selector) duration = this.media.target.selector.getDuration()
          if (!duration) {
            try {
              this.metadata = await this.$store.dispatch('metadata/get', this.media)
            }
            catch (err) {
              this.metadata = await this.$store.dispatch('metadata/getLocal', this.media)
              this.$handleError(this, err, 'errors.failed_to_get_media_metadata')
            }
          }
          else this.metadata = await this.$store.dispatch('metadata/getLocal', this.media)
        }
      },
      async getAnnotations () {
        const
          _this = this,
          query = {
            'target.id': this.timeline.id,
            'target.type': constants.mapTypes.MAP_TYPE_TIMELINE,
            'target.selector._valueMillis': { $gte: this.media.target.selector._valueMillis },
            'body.type': { $in: ['TextualBody', 'VocabularyEntry'] }
          }
        if (this.media.target.selector._valueDuration) {
          query['target.selector._valueMillis']['$lte'] = this.media.target.selector._valueMillis +
            this.media.target.selector._valueDuration
        }
        const results = await this.$store.dispatch('annotations/find', query)
        for (let item of results.items) {
          if (item.body.type === 'VocabularyEntry' && !item.body.value) {
            const entry = await this.$vocabularies.getEntry(item.body.source.id)
            item.body.value = entry.value
          }
        }
        if (results && Array.isArray(results.items)) {
          _this.annotations = results.items.sort(this.$sort.onRef)
        }
      },
      onAnnotation (annotation) {
        if (annotation) this.createAnnotation(annotation)
      },
      async createAnnotation (annotation = {}) {
        try {
          const target = this.timeline.getInterval(annotation.target.selector.value['date-time:t'])
          const payload = ObjectUtil.merge(annotation, { target })
          const result = await this.$store.dispatch('annotations/post', payload)
          if (result.body.type === 'VocabularyEntry' && !result.body.value) {
            const entry = await this.$vocabularies.getEntry(result.body.source.id)
            result.body.value = entry.value
          }
          this.annotations.push(result)
          this.annotations = this.annotations.sort(this.$sort.onRef)
          setTimeout(() => this.scrollToAnnotation(result._uuid), 500)
        }
        catch (err) {
          this.$handleError(this, err, 'errors.create_annotation_failed')
        }
      },
      scrollToAnnotation (uuid, duration = 100) {
        const el = this.$refs[uuid] ? this.$refs[uuid].$el || this.$refs[uuid][0].$el : undefined
        if (el) {
          setScrollPosition(getScrollTarget(el), el.offsetTop - el.scrollHeight, duration)
        }
      },
      async updateAnnotation (annotation) {
        if (annotation.body.value !== this.editAnnotationBuffer) {
          try {
            Assert.isType(annotation, 'object')
            Assert.ok(uuidValidate(annotation._uuid))
            Assert.isType(annotation.body.value, 'string')
            await this.$store.dispatch('annotations/patch', [annotation.id, annotation])
            // this.$store.commit('notifications/addMessage', {
            //   body: 'messages.updated_annotation',
            //   mode: 'alert',
            //   type: 'success',
            //   options: {
            //     position: 'top',
            //     timeout: 200
            //   }
            // })
          }
          catch (err) {
            this.$handleError(this, err, 'errors.update_annotation_failed')
          }
          await this.getAnnotations()
        }
        this.editAnnotationBuffer = undefined
        this.editAnnotationIndex = undefined
      },
      async deleteAnnotation (uuid) {
        try {
          Assert.ok(uuidValidate(uuid))
          await this.$store.dispatch('annotations/delete', uuid)
          await this.getAnnotations()
        }
        catch (err) {
          this.$handleError(this, err, 'errors.delete_annotation_failed')
        }
      },
      gotoMillis (millis) {
        const targetMillis = millis * 0.001
        if (this.playerTime !== targetMillis) {
          this.player.currentTime(targetMillis)
          // SwimLane
          // FIXME this is the second call when timecode change is triggered from inside SwimLane
          this.$store.commit('swimLane/setTimecode', millis)
        }
      },
      gotoSelector (selector, useDuration, annotation) {
        const
          parsed = selector.parse(),
          start = Array.isArray(parsed['date-time:t']) ? parsed['date-time:t'][0] : parsed['date-time:t']
        this.$router.push({ query: { datetime: start } })
        let millis = selector._valueMillis - this.media.target.selector._valueMillis
        if (useDuration) {
          millis += selector._valueDuration
          this.selectedMillis = selector._valueMillis + selector._valueDuration
        }
        else {
          this.selectedMillis = selector._valueMillis
        }
        this.gotoMillis(millis)

        if (annotation) {
          this.$store.commit('swimLane/setSelectedAnnotation', annotation)
        }
        this.fRendererMarker = !this.fRendererMarker
      },
      gotoHashvalue () {
        if (this.hashValue && uuid.isUUID(this.hashValue)) {
          const result = this.annotations.filter(annotation => annotation._uuid === this.hashValue)
          if (result.length) {
            this.scrollToAnnotation(this.hashValue)
            this.gotoSelector(result[0].target.selector)
            if (this.hashTimeout) this.hashTimeout = false
          }
        }
      },
      playerReady (player) {
        this.player = player
      },
      formatSelectorForList (val) {
        const annotationDate = DateTime.fromMillis(val._valueMillis)
        const videoDate = DateTime.fromMillis(this.media.target.selector._valueMillis)
        return Interval.fromDateTimes(videoDate, annotationDate)
          .toDuration()
          .toFormat(constants.config.TIMECODE_FORMAT)
      },
      onPlayerTime (seconds) {
        this.playerTime = seconds
        this.$store.commit('swimLane/setTimecode', seconds * 1000)
      },
      setEditIndex (i) {
        this.editAnnotationIndex = i
        this.editAnnotationBuffer = this.annotations[i].body.value
      },

      // Annotation list items specific
      getAnnotationEndMillis (annotation) {
        return annotation.target.selector._valueMillis + annotation.target.selector._valueDuration
      },
      addDurationToAnnotation (annotation) {
        if (annotation.target.selector) {
          const currentStart = annotation.target.selector._valueMillis
          const newTimecode = Math.round(this.playerTime * 1000) + this.media.target.selector._valueMillis

          if (newTimecode !== currentStart) {
            const d0 = DateTime.fromMillis(currentStart)
            const d1 = DateTime.fromMillis(newTimecode)
            if (newTimecode > currentStart) {
              annotation.target.selector = this.timeline.getInterval(d0, d1).selector
            }
            else {
              annotation.target.selector = this.timeline.getInterval(d1, d0).selector
            }
            this.updateAnnotation(annotation)
          }
        }
      },
      selectAnnotation (annotation) {
        // this.selectedMillis = annotation.target.selector._valueMillis
        this.gotoSelector(annotation.target.selector)
        // this.gotoMillis(annotation.target.selector._valueMillis - this.media.target.selector._valueMillis)
        this.$store.commit('swimLane/setSelectedAnnotation', annotation)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .moba-vocabs div:last-of-type
    display none
  .moba-vocabs:hover div:first-of-type
    display none
  .moba-vocabs:hover div:last-of-type
    display block

  .markdown-display
    padding-top: 2px

  .md-content
    font-size: 1rem
    line-height: 24px
  .fit
    max-height 100% !important

  .timecode-label-duration-spacer
    border-bottom: 1px solid $faded
    width: 8px

  .ui-border-left
    border-left: 1px solid $darker

  .annotation-list-item
    position: relative
    margin-top: -1px
    &::before
      content: ''
      position: absolute
      top: 0
      left: 16px
      width: calc(100% - 32px)
      height: 1px
      background: $darker
    &:not(:hover) .show-on-hover
      display: none
    &.is-being-edited
      .annotation-list-item-buttons
        display: block
    &.is-selected
      background-color $darker
</style>
