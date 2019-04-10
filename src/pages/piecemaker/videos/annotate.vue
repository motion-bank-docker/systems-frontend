<template lang="pug">

  // POST ANNOTATION
  //
  //
  .bg-dark(style="height: calc(100vh - 52px); overflow: hidden;")

    q-window-resize-observable(@resize="onViewportResize")

    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    .bg-dark.relative-position(style="height: calc(100vh - 52px);")

      // video player

      div.relative(:style="{height: videoHeight + 'px', maxHeight: viewport.height - 52 - 52 + 'px'}",
      :class="[!swimlanes ? 'fit' : '']")
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

      .absolute-bottom-right.bg-dark.full-width.shadow-up-4.q-px-md.q-pb-sm.scroll(v-if="swimlanes",
      :style="{height: swimlanesHeight + 'px', borderTop: '1px solid #333', minHeight: '52px'}")
        swim-lane(v-if="timeline", :timelineUuid="timeline._uuid", :markerDetails="false", :resizable="true",
        @emitHandler="handlerToggle('swimlanes')", @emitResize="onEmitResize",
        :key="visibilityDetails", @emitToggleDetails="onToggleDetails", :visibilityDetails="visibilityDetails"
        )

      q-page-sticky.q-pa-md(position="bottom-right")

        // button toggles swimlanes visibility

        q-btn(v-if="!swimlanes && userHasSwimlane", @click="handlerToggle('swimlanes')", color="dark", round,
        :class="[swimlanes ? 'rotate-270' : 'rotate-90']", icon="keyboard_backspace", size="sm")

      // input field for new annotations

      <!--.absolute-top(style="width: 100%;")-->
      q-page-sticky(position="top")
        annotation-field(
        @annotation="onAnnotation",
        ref="annotationField",
        :submit-on-num-enters="1",
        :selector-value="baseSelector")

    // annotations list

    q-layout-drawer.bg-dark(v-if="annotations", v-model="drawer", side="right")
      .absolute.fit.bg-dark
      q-list.no-border.bg-dark.q-py-none(dark, @mouseleave.native="currentHover === undefined")

        q-item.bg-dark(dark, v-for="(annotation, i) in annotations", :key="annotation._uuid", :ref="annotation._uuid",
        :class="[currentIndex === i ? 'bg-grey-9' : '']", style="border-left: 1px solid #333;",
        @mouseover.native="setHover(annotation._uuid)")
          q-item-main
            q-item-tile

              // timestamp

              q-btn.float-left(
              v-if="annotation.target.selector", :color="currentIndex === i ? 'primary' : 'dark'",
              @click="gotoSelector(annotation.target.selector.value)", size="sm")
                | {{ formatSelectorForList(annotation.target.selector.value) }}

              // author

              q-btn.q-caption.float-left.text-grey-7(size="sm", flat) {{ getInitials(annotation.author.name) }}
                q-tooltip.bg-grey-10.shadow-6(:offset="[0, 5]") {{ annotation.author.name }}

              // buttons

              <!--div.float-right(v-if="currentHover === annotation._uuid")-->
              div.float-right(:class="[currentHover === annotation._uuid ? '' : 'invisible']")
                q-btn.float-right(@click="$refs.confirmModal.show('messages.confirm_delete', annotation, 'buttons.delete')",
                size="sm", icon="delete", round)

                q-btn.q-mr-sm(
                v-if="(!isEditingAnnotations && annotation.body.type === 'TextualBody' || editAnnotationIndex !== i && annotation.body.type !== 'VocabularyEntry')",
                @click="setEditIndex(i)", size="sm", icon="edit", round)

                q-btn.float-right.q-mr-sm(v-if="annotation.body.type === 'TextualBody' && editAnnotationIndex === i",
                @click="updateAnnotation(annotation)", size="sm", :color="isAnnotationDirty ? 'primary' : undefined",
                icon="save", round)

            br

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

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      AnnotationField,
      SwimLane
    },
    async mounted () {
      if (this.$route.params.uuid) {
        this.$q.loading.show()
        await this.getVideo()
        await this.getAnnotations()
        this.$q.loading.hide()
      }
      this.videoHeight = this.viewport.height / 2 - 52
    },
    beforeDestroy () {
      AppFullscreen.exit()
    },
    data () {
      return {
        active: false,
        annotations: [],
        currentHover: undefined,
        drawer: true,
        fullscreen: false,
        headerHeight: 52,
        inputStyle: true,
        metadata: undefined,
        player: undefined,
        playerTime: 0.0,
        selector: undefined,
        staging: process.env.IS_STAGING,
        swimlanes: false,
        swimlanesHeight: undefined,
        timelineUuid: undefined,
        timeline: undefined,
        video: undefined,
        videoHeight: undefined,
        viewport: {height: undefined, width: undefined},
        visibilityDetails: false,
        detailsSize: 300,
        editAnnotationIndex: undefined,
        editAnnotationBuffer: undefined,
        hashTimeout: undefined,
        mdOptions: {
          target: '_blank'
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      userHasSwimlane () {
        return userHasFeature(this.user, 'swimlane')
      },
      hashValue () {
        return this.$route.hash.length ? this.$route.hash.substr(1) : undefined
      },
      currentIndex () {
        if (!this.annotations || !this.annotations.length) return

        let idx = -1, annotation = this.annotations[0]
        while (annotation && idx < this.annotations.length &&
          DateTime.fromISO(this.baseSelector, { setZone: true }) >=
            DateTime.fromISO(annotation.target.selector.value, { setZone: true })) {
          idx++
          annotation = this.annotations[idx + 1]
        }
        return idx
      },
      baseSelector () {
        if (!this.video) return DateTime.local().toISO()
        return DateTime.fromISO(this.video.target.selector.value, { setZone: true })
          .plus(this.playerTime * 1000)
          .toISO()
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
      currentIndex (val) {
        if (typeof this.editAnnotationIndex === 'number') return
        if (this.annotations[val]) this.scrollToAnnotation(this.annotations[val]._uuid)
      }
    },
    methods: {
      setHover (val) {
        this.currentHover = val
      },
      getInitials (val) {
        let matches = val.split(' ').map((n) => n[0]).join('')
        return matches
      },
      onToggleDetails (val) {
        this.visibilityDetails = !this.visibilityDetails
        this.detailsSize += 100
        console.log(val, this.detailsSize, this.visibilityDetails)
      },
      // onTtoggleDetails (val) {
      //   alert(val)
      // },
      onEmitResize (val) {
        if (this.swimlanes) {
          this.swimlanesHeight = (this.viewport.height + this.headerHeight - val)
          this.videoHeight = this.viewport.height - 52 - this.swimlanesHeight
        }
      },
      onViewportResize (size) {
        this.viewport.height = size.height
        this.viewport.width = size.width
        this.videoHeight = this.viewport.height - 52 - this.swimlanesHeight
      },
      handlerToggle (val) {
        switch (val) {
        case 'annotations':
          this.drawer = !this.drawer
          break
        case 'swimlanes':
          this.swimlanes = !this.swimlanes

          if (this.swimlanes) this.swimlanesHeight = this.viewport.height - this.headerHeight - this.videoHeight
          else this.swimlanesHeight = 0

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
          this.metadata = await this.$store.dispatch('metadata/get', this.video)
        }
      },
      async getAnnotations () {
        const
          _this = this,
          query = {
            'target.id': this.timeline.id,
            'target.type': constants.MAP_TYPE_TIMELINE,
            'target.selector.value': { $gte: this.video.target.selector.value },
            'body.type': { $in: ['TextualBody', 'VocabularyEntry'] }
          }
        if (this.metadata.duration) {
          const start = DateTime.fromISO(this.video.target.selector.value, { setZone: true })
          query['target.selector.value']['$lte'] = start.plus(this.metadata.duration * 1000).toISO()
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
          const target = this.timeline.getTimelineTarget(annotation.target.selector.value)
          const payload = ObjectUtil.merge(annotation, {
            target: ObjectUtil.merge({}, annotation.target, target)
          })
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
            await this.$store.dispatch('annotations/patch', [annotation._uuid, annotation])
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
      gotoSelector (selector) {
        this.$router.push({ query: { datetime: selector } })
        const millis = DateTime.fromISO(selector, { setZone: true }).toMillis() -
          DateTime.fromISO(this.video.target.selector.value, { setZone: true }).toMillis()
        const targetMillis = millis * 0.001
        if (this.playerTime !== targetMillis) this.player.currentTime(targetMillis)
      },
      gotoHashvalue () {
        if (this.hashValue && uuid.isUUID(this.hashValue)) {
          const result = this.annotations.filter(annotation => annotation._uuid === this.hashValue)
          if (result.length) {
            this.scrollToAnnotation(this.hashValue)
            this.gotoSelector(result[0].target.selector.value)
            if (this.hashTimeout) this.hashTimeout = false
          }
        }
      },
      playerReady (player) {
        this.player = player
      },
      formatSelectorForList (val) {
        const annotationDate = DateTime.fromISO(val, { setZone: true })
        const videoDate = DateTime.fromISO(this.video.target.selector.value, { setZone: true })
        return Interval.fromDateTimes(videoDate, annotationDate)
          .toDuration()
          .toFormat(constants.TIMECODE_FORMAT)
      },
      onPlayerTime (seconds) {
        this.playerTime = seconds
      },
      setEditIndex (i) {
        this.editAnnotationIndex = i
        this.editAnnotationBuffer = this.annotations[i].body.value
      }
    }
  }
</script>

<style scoped lang="stylus">
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
    max-height 100%!important
</style>
