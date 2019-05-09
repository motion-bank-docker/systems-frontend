<template lang="pug">

  // POST ANNOTATION
  //
  //
  .bg-dark(style="height: calc(100vh - 52px); overflow: hidden;")

    q-window-resize-observable(@resize="onViewportResize")

    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    .bg-dark.relative-position(style="height: calc(100vh - 52px);")

      // video player

      div.relative(:style="{height: videoHeight + 'px', maxHeight: viewport.height - 52 - 250 + 'px'}",
      :class="[!visibilitySwimlanes ? 'fit' : '']")
        video-player.full-height.relative-position(v-if="video", :annotation="video", :fine-controls="true",
        @ready="playerReady($event)", @time="onPlayerTime($event)")

      // back button

      q-page-sticky(position="top-left", style="z-index: 2100;")
        back-button.q-ma-md

      // button toggles annotations

      q-page-sticky(position="top-right", style="z-index: 2100;")
        q-btn.q-ma-md(@click="handlerToggle('annotations')", color="dark", round,
        :class="[drawer ? 'rotate-180' : '']", icon="keyboard_backspace", size="sm")

      // swimlane content

      .absolute-bottom-right.bg-dark.full-width.shadow-up-4(v-if="visibilitySwimlanes",
      :style="{height: swimlanesHeight + 'px', borderTop: '1px solid #333', minHeight: '250px'}",
      ref="swimlaneWrap")
        swim-lane(
        v-if="timeline",
        :map="timeline",
        :timelineUuid="timeline._uuid",
        :markerDetails="false",
        :resizable="true",
        :start="getVideoDate().toMillis()",
        :duration="getVideoDuration()",
        :annotations="annotations",
        :video="video",
        :key="componentKey",
        :currentAnnotation="selectorMillis",
        :forceRendererMarker="fRendererMarker",
        @emitHandler="handlerToggle('swimlanes')",
        @forceRenderer="onForceRenderer",
        @timecodeChange="gotoMillis",
        @updateAnnotation="updateAnnotation"
        )

      // button toggles swimlanes visibility

      q-page-sticky.q-pa-md(position="bottom-right")
        q-btn(v-if="!visibilitySwimlanes && userHasSwimlane", @click="handlerToggle('swimlanes')", color="dark", round,
        :class="[visibilitySwimlanes ? 'rotate-270' : 'rotate-90']", icon="keyboard_backspace", size="sm")

      // input field for new annotations

      q-page-sticky(position="top")
        annotation-field(
        @annotation="onAnnotation",
        ref="annotationField",
        :submit-on-num-enters="1",
        :selector-value="baseSelector",
        :hasTransparency="true")

    // anntoation list filters, settings, etc.

    div.fixed-right-top.bg-light.q-pr-md.q-pl-md(style="width: 400px; top: 50px; z-index: 1010; border-bottom: 1px solid #444")
      q-input(float-label="Filter", value="")

    // annotations list
    q-layout-drawer.bg-dark(v-if="annotations", v-model="drawer", side="right", :width="400")
      .absolute.fit.bg-dark(style="border-left: 1px solid #333;")
      q-list.no-border.bg-dark.q-py-none(dark, @mouseleave.native="currentHover === undefined")

        q-item.annotation-list-item.q-pb-lg(
        dark,
        v-for="(annotation, i) in annotations",
        :key="annotation._uuid",
        :ref="annotation._uuid",
        :class="{'is-selected' : currentIndex === i || editAnnotationIndex === i, 'is-being-edited': editAnnotationIndex === i}",
        style="border-left: 1px solid #444; border-top: 1px solid #444;",
        @mouseover.native="setHover(annotation._uuid)"
        )
          q-item-main
            q-item-tile.relative-position

              .annotation-list-item-header
                annotation-icon.cursor-pointer(
                  :annotation="annotation",
                  :isSelected="selectedAnnotation ? selectedAnnotation._uuid === annotation._uuid : false",
                  @click.native="selectAnnotation(annotation)"
                  )
                timecode-label(
                  @click.native="gotoSelector(annotation.target.selector, false, annotation)",
                  :millis="annotation.target.selector._valueMillis",
                  :videoDate="getVideoDate()"
                  )
                // annotation has duration
                template(v-if="annotation.target.selector._valueDuration")
                  .timecode-label-duration-spacer
                  timecode-label(
                    @click.native="gotoSelector(annotation.target.selector, true, annotation)",
                    :millis="getAnnotationEndMillis(annotation)",
                    :videoDate="getVideoDate()"
                    )
                // add timecode button
                template(v-else)
                  .timecode-label-duration-spacer.show-on-hover
                  timecode-label.show-on-hover(
                    @click.native="addDurationToAnnotation(annotation)",
                    :text="'Add current timecode'"
                    )

              // buttons

              <!--div.float-right(v-if="currentHover === annotation.uuid")-->
              .absolute-top-right.annotation-list-item-buttons.show-on-hover.show-on-edit
                q-btn.float-right(@click="$refs.confirmModal.show('messages.confirm_delete', annotation, 'buttons.delete')",
                size="xs", flat, icon="delete", round)

                q-btn.q-mr-sm(
                v-if="(!isEditingAnnotations && annotation.body.type === 'TextualBody' || editAnnotationIndex !== i && annotation.body.type !== 'VocabularyEntry')",
                @click="setEditIndex(i)", size="xs", icon="edit", round, flat)

                q-btn.float-right.q-mr-sm(v-if="annotation.body.type === 'TextualBody' && editAnnotationIndex === i",
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
  import TimecodeLabel from '../../../components/piecemaker/partials/TimecodeLabel'
  import AnnotationIcon from '../../../components/piecemaker/partials/AnnotationIcon'

  // import { EventHub } from '../../../components/piecemaker/partials/SwimLane/EventHub'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      AnnotationIcon,
      AnnotationField,
      SwimLane,
      TimecodeLabel
    },
    async mounted () {
      if (this.$route.params.uuid) {
        this.$q.loading.show()
        await this.getVideo()
        await this.getAnnotations()
        this.$q.loading.hide()
      }
      this.setupScreen()
    },
    beforeDestroy () {
      AppFullscreen.exit()
    },
    data () {
      return {
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
        video: undefined,
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
        selectorMillis: undefined,
        fRendererMarker: false
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        selectedAnnotation: 'swimLaneSettings/getSelectedAnnotation',
        drawer: 'swimLaneSettings/getVisibilityDrawer',
        visibilitySwimlanes: 'swimLaneSettings/getVisibilitySwimlanes',
        visibilityDetails: 'swimLaneSettings/getVisibilityDetails'
      }),
      storeCursorTop () {
        return this.$store.state.swimLaneSettings.cursorTop
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
        if (!this.video) return DateTime.local().toISO()
        const
          parsed = this.video.target.selector.parse(),
          start = Array.isArray(parsed['date-time:t']) ? parsed['date-time:t'][0] : parsed['date-time:t']
        return start.plus(this.playerTime * 1000).toISO()
      },
      baseMillis () {
        if (!this.video) return DateTime.local().toMillis()
        return this.video.target.selector._valueMillis + this.playerTime * 1000
      },
      isEditingAnnotations () {
        return typeof this.editAnnotationIndex === 'number'
      },
      isAnnotationDirty () {
        return this.isEditingAnnotations &&
          this.annotations[this.editAnnotationIndex].body.value !== this.editAnnotationBuffer
      }
    },
    watch: {
      storeCursorTop (val) {
        this.videoHeight = val - this.headerHeight
        this.swimlanesHeight = (this.viewport.height - val)
      },
      visibilityDetails () {
        this.onForceRenderer()
      },
      currentIndex (val) {
        if (typeof this.editAnnotationIndex === 'number') return
        if (this.annotations[val]) this.scrollToAnnotation(this.annotations[val]._uuid)
      }
    },
    created () {
      this.$root.$on('emitSelector', this.gotoSelector)
      this.$root.$on('annotationEndMillis', this.getAnnotationEndMillis)
    },
    methods: {
      setupScreen () {
        this.$store.commit('swimLaneSettings/setSelectedAnnotation', null)
        if (this.$store.state.swimLaneSettings.cursorTop) {
          this.videoHeight = this.$store.state.swimLaneSettings.cursorTop - this.headerHeight
          this.swimlanesHeight = (this.viewport.height - this.$store.state.swimLaneSettings.cursorTop)
        }
        else {
          this.videoHeight = this.viewport.height / 2 - this.headerHeight
          this.swimlanesHeight = this.viewport.height / 2
        }
      },
      onForceRenderer () {
        this.componentKey += 1
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
          this.videoHeight = this.viewport.height - 52 - this.swimlanesHeight
        }
      },
      */
      onViewportResize (size) {
        this.viewport.height = size.height
        this.viewport.width = size.width
        this.videoHeight = this.viewport.height - 52 - this.swimlanesHeight
      },
      handlerToggle (val) {
        switch (val) {
        case 'annotations':
          this.$store.commit('swimLaneSettings/setVisibilityDrawer')
          setTimeout(() => {
            this.onForceRenderer()
          }, 200)
          break
        case 'swimlanes':this.$store.commit('swimLaneSettings/setVisibilitySwimlanes')
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
      async getVideo () {
        this.video = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        this.timeline = await this.$store.dispatch('maps/get', parseURI(this.video.target.id).uuid)
        if (this.video) {
          this.metadata = await this.$store.dispatch('metadata/getLocal', this.video)
        }
        // console.log('video', this.video)
      },
      async getAnnotations () {
        const
          _this = this,
          query = {
            'target.id': this.timeline.id,
            'target.type': constants.mapTypes.MAP_TYPE_TIMELINE,
            'target.selector._valueMillis': { $gte: this.video.target.selector._valueMillis },
            'body.type': { $in: ['TextualBody', 'VocabularyEntry'] }
          }
        if (this.video.target.selector._valueDuration) {
          query['target.selector._valueMillis']['$lte'] = this.video.target.selector._valueMillis +
            this.video.target.selector._valueDuration
        }
        const results = await this.$store.dispatch('annotations/find', query)
        for (let item of results.items) {
          if (item.body.type === 'VocabularyEntry') {
            const entry = await this.$vocabularies.getEntry(item.body.source.id)
            item.body.value = entry.value
          }
        }
        if (results && Array.isArray(results.items)) {
          _this.annotations = results.items.sort(this.$sort.onRef)
        }
      },
      onAnnotation (annotation) {
        console.debug('received annotation...', annotation)
        if (annotation) this.createAnnotation(annotation)
      },
      async createAnnotation (annotation = {}) {
        try {
          const target = this.timeline.getInterval(annotation.target.selector.value['date-time:t'])
          const payload = ObjectUtil.merge(annotation, { target })
          console.debug('create annotation', target, payload)
          const result = await this.$store.dispatch('annotations/post', payload)
          if (result.body.type === 'VocabularyEntry') {
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
            await this.getAnnotations()
            this.$store.commit('notifications/addMessage', {
              body: 'messages.updated_annotation',
              mode: 'alert',
              type: 'success'
            })
          }
          catch (err) {
            this.$handleError(this, err, 'errors.update_annotation_failed')
          }
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
          this.$store.commit('swimLaneSettings/setTimecode', millis)
        }
      },
      gotoSelector (selector, useDuration, annotation) {
        const
          parsed = selector.parse(),
          start = Array.isArray(parsed['date-time:t']) ? parsed['date-time:t'][0] : parsed['date-time:t']
        this.$router.push({ query: { datetime: start } })
        let millis = selector._valueMillis - this.video.target.selector._valueMillis
        if (useDuration) {
          millis += selector._valueDuration
          this.selectorMillis = selector._valueMillis + selector._valueDuration
        }
        else {
          this.selectorMillis = selector._valueMillis
        }
        this.gotoMillis(millis)
        this.$store.commit('swimLaneSettings/setSelectedAnnotation', annotation)
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
        const videoDate = DateTime.fromMillis(this.video.target.selector._valueMillis)
        return Interval.fromDateTimes(videoDate, annotationDate)
          .toDuration()
          .toFormat(constants.config.TIMECODE_FORMAT)
      },
      onPlayerTime (seconds) {
        this.playerTime = seconds
        this.$store.commit('swimLaneSettings/setTimecode', seconds * 1000)
      },
      setEditIndex (i) {
        this.editAnnotationIndex = i
        this.editAnnotationBuffer = this.annotations[i].body.value
      },
      getVideoDate () {
        return DateTime.fromMillis(this.video.target.selector._valueMillis)
      },
      getVideoDuration () {
        const duration = this.video.target.selector.getDuration()
        if (duration) {
          return duration.as('milliseconds')
        }
        return 0
      },

      // Annotation list items specific
      getAnnotationEndMillis (annotation) {
        return annotation.target.selector._valueMillis + annotation.target.selector._valueDuration
      },
      addDurationToAnnotation (annotation) {
        if (annotation.target.selector) {
          const currentStart = annotation.target.selector._valueMillis
          const newTimecode = Math.round(this.playerTime * 1000) + this.video.target.selector._valueMillis

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
        // this.selectorMillis = annotation.target.selector._valueMillis
        this.gotoSelector(annotation.target.selector)
        this.$store.commit('swimLaneSettings/setSelectedAnnotation', annotation)
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

  .annotation-list-item
    &:not(:hover) .show-on-hover
      display: none
    &.is-being-edited
      .annotation-list-item-buttons
        display: block
    &.is-selected
      background-color $darker
    .annotation-list-item-header
      margin-top 5px
      > *
        display inline-block
        vertical-align middle
      .annotation-icon
        margin 1px 8px 0 0
</style>
