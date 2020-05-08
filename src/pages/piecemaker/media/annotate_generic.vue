<template lang="pug">

  // POST ANNOTATION
  //
  //
  .bg-dark(style="height: calc(100vh - 52px); overflow: hidden;")

    q-window-resize-observable(@resize="onViewportResize")

    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    .bg-dark.relative-position(style="height: calc(100vh - 52px);")

      // player time
      .absolute-top-right.q-mt-md.q-mr-sm.bg-with-transparency.text-white.z-max.shadow-3.q-pa-xs.round-borders.q-caption {{ getPlayerTime() }}
      // .absolute-top-left.z-max.q-ma-md.q-caption(style="text-shadow: 0 0 10px rgba(0, 0, 0, .5);")
        span {{ getPlayerTime() }}

      // meta player

      div.relative-position(:style="{height: videoHeight + 'px', maxHeight: viewport.height - 52 - 250 + 'px'}",
      :class="[!visibilitySwimlanes ? 'fit' : '']")
        media-player.full-height.relative-position(v-if="media", :annotation="media", :fine-controls="true",
        @ready="playerReady($event)", @timeupdate="onPlayerTime($event)", :auth="playerAuth", :ratio="ratio")

      // swimlane content

      .absolute-bottom-right.bg-dark.full-width.ui-border-top(
        v-if="visibilitySwimlanes",
        :style="{height: swimlanesHeight + 'px', minHeight: '250px'}",
        ref="swimlaneWrap"
      )
        swim-lane(
          v-if="media",
          ref="swimLane",
          :mode="mode",
          :markerDetails="false",
          :resizable="true",
          :start="0",
          :duration="getMediaDuration()",
          :annotations="annotations",
          :media="media",
          :key="componentKey",
          :selectedMillis="selectedMillis",
          :focusedAnnotation="focusedAnnotation",
          @emitHandler="handlerToggle('swimlanes')",
          @timecodeChange="gotoMillis",
          @updateAnnotation="updateAnnotation"
          )

      // input field for new annotations

      q-page-sticky(position="top")
        annotation-field(
        @annotation="onAnnotation",
        :media="media",
        ref="annotationField",
        :playerTime="getPlayerTime()",
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
      :breakpoint="0",
      behavior="desktop",
      :width="400")
      .absolute.fit.bg-dark(style="")
      q-list.bg-dark.q-py-none(dark, @mouseleave.native="currentHover === undefined")

        q-item.annotation-list-item.q-pb-lg(
          dark,
          v-for="(annotation, i) in annotations",
          :key="annotation.id",
          :ref="annotation.id",
          :class="{'is-selected' : currentIndex === i || editAnnotationIndex === i, 'is-being-edited': editAnnotationIndex === i}",
          @mouseover.native="setHover(annotation.id)"
          )
          q-item-main
            q-item-tile.relative-position

              .row.items-center.q-mt-sm
                annotation-icon.q-mr-sm.cursor-pointer(
                  :annotation="annotation",
                  :isSelected="selectedAnnotation ? selectedAnnotation.id === annotation.id : false",
                  @click.native="gotoSelector(annotation.target.selector, false, annotation)"
                  )
                timecode-label(
                  @click.native="gotoSelector(annotation.target.selector, false, annotation)",
                  :millis="annotation.target.selector._valueMillis",
                  :videoDate="mode === 'global' ? getMediaDate() : undefined",
                  :mode="mode"
                  )
                // annotation has duration
                template(v-if="annotation.target.selector._valueDuration")
                  .timecode-label-duration-spacer
                  timecode-label(
                    @click.native="gotoSelector(annotation.target.selector, true, annotation)",
                    :millis="getAnnotationEndMillis(annotation)",
                    :videoDate="mode === 'global' ? getMediaDate() : undefined",
                    :mode="mode"
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
              .absolute-top-right.annotation-list-item-buttons.show-on-hover.show-on-edit(style="margin-top: -4px;")
                q-btn.float-right(@click="$refs.confirmModal.show('messages.confirm_delete', annotation, 'buttons.delete')",
                size="xs", flat, icon="delete", round)

                q-btn.q-mr-sm(
                v-if="!isEditingAnnotations && annotation.body.type === 'TextualBody'",
                @click="setEditIndex(i)", size="xs", icon="edit", round, flat)

                q-btn.float-right.q-mr-sm(v-if="annotation.body.type === 'TextualBody' && editAnnotationIndex === i",
                @click="updateAnnotation(annotation)", size="xs", :color="isAnnotationDirty ? 'primary' : undefined",
                icon="save", round, flat)

            // text content

            q-item-tile
              markdown-display.markdown-display.q-mt-sm(v-if="!isEditingAnnotations || editAnnotationIndex !== i",
              :content="getAnnotationContent(annotation)", :options="mdOptions")
              q-input.q-mt-sm.q-mb-sm(v-if="annotation.body.type === 'TextualBody' && editAnnotationIndex === i", color="white",
              type="textarea", v-model="annotation.body.value", dark)

</template>

<script>
  import { mapGetters } from 'vuex'
  import { scroll, AppFullscreen } from 'quasar'
  import { DateTime, Interval } from 'luxon'

  import { ObjectUtil, Assert } from 'mbjs-utils'
  import { userHasFeature } from 'mbjs-quasar/src/lib'
  import constants from 'mbjs-data-models/src/constants'
  import { Annotation } from 'mbjs-data-models'
  import Selector from 'mbjs-data-models/src/models/annotation/sub-models/selector'

  import AnnotationField from '../../../components/piecemaker/partials/AnnotationFieldGeneric'
  import SwimLane from '../../../components/piecemaker/partials/SwimLane/SwimLane'
  import TimecodeLabel from '../../../components/piecemaker/partials/TimecodeLabel'
  import AnnotationIcon from '../../../components/piecemaker/partials/AnnotationIcon'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      AnnotationIcon,
      AnnotationField,
      SwimLane,
      TimecodeLabel
    },
    async mounted () {
      console.debug('Mode', this.mode)
      this.$root.$emit('setBackButton', '/piecemaker/media')
      if (this.$route.params.id) {
        this.$q.loading.show()
        const { annotation, metadata } = await this.$store.dispatch('media/get', this.$route.params.id)
        this.media = annotation
        this.metadata = metadata
        console.debug('Media metadata', metadata)
        await this.$store.dispatch('autosuggest/loadTypes', this.media.body.source.id)
        await this.getAnnotations()
        this.$q.loading.hide()
      }
      this.drawer = this.visibilityDrawer
      this.setupScreen()
      this.videoHeight = this.viewport.height - this.swimlanesHeight - this.headerHeight

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
        backupId: undefined,
        annotations: [],
        metadata: {},
        currentHover: undefined,
        fullscreen: false,
        headerHeight: 52,
        inputStyle: true,
        player: undefined,
        playerTime: 0.0,
        selector: undefined,
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
        visibilitySwimlanes: 'swimLane/getVisibilitySwimlanes',
        visibilityDetails: 'swimLane/getVisibilityDetails',
        isMobile: 'globalSettings/getIsMobile'
      }),
      mode () {
        return this.$route.params.mode || 'global'
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
        if (this.mode === 'local') {
          return { key: 't', value: this.playerTime }
        }
        else {
          if (!this.media) return { key: 'date-time:t', value: DateTime.local().toISO() }
          const
            parsed = this.media.target.selector.parse(),
            start = Array.isArray(parsed['date-time:t']) ? parsed['date-time:t'][0] : parsed['date-time:t']
          return { key: 'date-time:t', value: start.plus(this.playerTime * 1000).toISO() }
        }
      },
      baseMillis () {
        if (this.mode === 'local') return this.playerTime * 1000
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
      playerAuth () {
        const auth = { query: {} }
        if (this.$auth.token) {
          auth.query[this.$auth.tokenType.toLowerCase()] = this.$auth.token
        }
        return auth
      },
      ratio () {
        if (this.metadata && this.metadata.aspect_ratio) return this.metadata.aspect_ratio
      }
    },
    watch: {
      storeCursorTop (val) {
        this.mediaHeight = val - this.headerHeight
        this.swimlanesHeight = (this.viewport.height - val)
        this.videoHeight = this.viewport.height - this.swimlanesHeight - this.headerHeight
      },
      visibilityDrawer (val) {
        this.drawer = val
        this.$refs.swimLane.updateCache(400)
      },
      currentIndex (val) {
        if (typeof this.editAnnotationIndex === 'number') return
        if (this.annotations[val]) this.scrollToAnnotation(this.annotations[val].id)
      }
    },
    methods: {
      getPlayerTime () {
        if (this.playerTime) {
          let
            hour = DateTime.fromSeconds(this.playerTime).hour,
            minute = DateTime.fromSeconds(this.playerTime).minute,
            second = DateTime.fromSeconds(this.playerTime).second
          if (hour < 10) hour = '0' + hour
          if (minute < 10) minute = '0' + minute
          if (second < 10) second = '0' + second
          return hour + ':' + minute + ':' + second
        }
      },
      async getAnnotations () {
        try {
          // this.annotations = await this.$store.dispatch('queue/enqueue',
          //   this.$store.dispatch('annotations/find', this.media.body.source.id))
          this.annotations = await this.$store.dispatch('annotations/find', this.media.body.source.id)
        }
        catch (err) {
          this.$handleError(this, err, 'errors.list_annotations_failed')
        }
      },
      getAnnotationContent (annotation) {
        if (annotation.body['rdf:label']) {
          return `${annotation.body['rdf:label']}`
        }
        return annotation.body.value
      },
      setupScreen () {
        this.$store.commit('swimLane/setSelectedAnnotation', null)
        if (this.$store.state.swimLane.cursorTop) {
          this.mediaHeight = this.$store.state.swimLane.cursorTop - this.headerHeight
          this.swimlanesHeight = (this.viewport.height - this.$store.state.swimLane.cursorTop)
        }
        else {
          this.mediaHeight = this.viewport.height / 2 - this.headerHeight
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
          this.mediaHeight = this.viewport.height - 52 - this.swimlanesHeight
        }
      },
      */
      onViewportResize (size) {
        this.viewport.height = size.height
        this.viewport.width = size.width
        this.mediaHeight = this.viewport.height - 52 - this.swimlanesHeight
        this.videoHeight = this.viewport.height - this.swimlanesHeight - this.headerHeight
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
        await this.deleteAnnotation(annotation.id)
      },
      toggleFullscreen () {
        AppFullscreen.toggle()
        this.fullscreen = !this.fullscreen
      },
      onAnnotation (annotation) {
        if (annotation) this.createAnnotation(annotation)
      },
      async createAnnotation (annotation = {}) {
        try {
          let target = {}
          if (annotation.body) {
            annotation.body.type = annotation.body.type || 'SpecificResource'
          }
          target = Object.assign({}, annotation.target)
          target.selector.type = 'FragmentSelector'
          target.selector.value = { t: [target.selector.value.t, target.selector.value.t] }
          target.type = 'Video'
          target.id = this.media.body.source.id
          const payload = new Annotation(ObjectUtil.merge(annotation, target ? { target } : {}))
          // const result = await this.$store.dispatch('queue/enqueue',
          //   this.$store.dispatch('annotations/post', payload))
          const result = await this.$store.dispatch('annotations/post', payload)
          console.debug('createAnnotation', payload.toObject(), result)
          this.annotations.push(result)
          this.annotations = this.annotations.sort(this.$sort.onRef)
          setTimeout(() => this.scrollToAnnotation(result.id), 500)
        }
        catch (err) {
          this.$handleError(this, err, 'errors.create_annotation_failed')
        }
      },
      scrollToAnnotation (id, duration = 100) {
        const el = this.$refs[id] ? this.$refs[id].$el || this.$refs[id][0].$el : undefined
        if (el) {
          setScrollPosition(getScrollTarget(el), el.offsetTop - el.scrollHeight, duration)
        }
      },
      async updateAnnotation (annotation) {
        try {
          Assert.isType(annotation, 'object')
          // const payload = {
          //   body: annotation.body.toObject(),
          //   target: annotation.target.toObject()
          // }
          // await this.$store.dispatch('queue/enqueue',
          //   this.$store.dispatch('annotations/patch', [annotation.id, annotation]))
          const updated = await this.$store.dispatch('annotations/patch', [annotation.id, annotation])
          if (updated) {
            const index = this.annotations.findIndex(a => a.id === updated.id)
            this.annotations.splice(index, 1, updated)
            this.annotations = this.annotations.sort(this.$sort.onRef)
            setTimeout(() => this.scrollToAnnotation(updated.id), 500)
          }
          // await this.getAnnotations()
        }
        catch (err) {
          this.$handleError(this, err)
        }
        this.editAnnotationBuffer = undefined
        this.editAnnotationIndex = undefined
      },
      async deleteAnnotation (id) {
        try {
          // await this.$store.dispatch('queue/enqueue',
          //   this.$store.dispatch('annotations/delete', id))
          const index = this.annotations.findIndex(a => a.id === id)
          await this.$store.dispatch('annotations/delete', id)
          this.annotations.splice(index, 1)
          // await this.getAnnotations()
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
        const parsed = selector.parse()
        let start, millis
        if (parsed['date-time:t']) {
          start = Array.isArray(parsed['date-time:t']) ? parsed['date-time:t'][0] : parsed['date-time:t']
          millis = selector._valueMillis - this.media.target.selector._valueMillis
          this.$router.push({ query: { datetime: start } })
        }
        else if (parsed.t) {
          start = Array.isArray(parsed.t) ? parsed.t[0] : parsed.t
          millis = start * 1000
          this.$router.push({ query: { t: start } })
        }
        if (useDuration) {
          millis += selector._valueDuration || 0
          this.selectedMillis = (this.mode === 'local' ? 0 : selector._valueMillis) + selector._valueDuration
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
        if (this.hashValue) {
          const result = this.annotations.filter(annotation => annotation.id === this.hashValue)
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
      getMediaDate () {
        return DateTime.fromMillis(0)
      },
      getMediaDuration () {
        const duration = this.media.target.selector.getDuration()
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
          const currentStart = annotation.target.selector._valueMillis * 0.001
          const newTimecode = this.playerTime + this.media.target.selector._valueMillis * 0.001

          let value
          if (newTimecode !== currentStart) {
            if (newTimecode > currentStart) {
              value = { t: [currentStart, newTimecode] }
            }
            else {
              value = { t: [newTimecode, currentStart] }
            }
            annotation.target.selector = new Selector({
              type: 'FragmentSelector',
              value,
              conformsTo: annotation.target.selector.conformsTo
            })
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

  .video-js
    background-color transparent
    .vjs-tech
      max-width 100%
      max-height 100%
      top 50%
      transform translateY(-50%)
</style>
