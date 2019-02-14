<template lang="pug">

  // POST ANNOTATION
  //
  //
  .bg-dark(style="height: calc(100vh - 52px); overflow: hidden;")
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    .bg-dark.relative-position(style="height: calc(100vh - 52px);")

      // VIDEO
      //
      //
      video-player(v-if="video", :annotation="video", :fine-controls="true",
      @ready="playerReady($event)", @time="onPlayerTime($event)", @canplay.once="gotoHashvalue")

      // TOP LEFT
      //
      //
      q-page-sticky.q-pa-md(position="top-left", style="z-index: 2100;")
        // BUTTON: GO BACK
        back-button

      // TOP RIGHT
      //
      //
      q-page-sticky.q-pa-md(position="top-right", style="z-index: 2100;")

        // BUTTONS: SWITCH TO FULLSCREEN

        // q-btn(v-if="!fullscreen", @click="toggleFullscreen()", icon="fullscreen", round)
        // q-btn(v-if="fullscreen", @click="toggleFullscreen()", icon="fullscreen_exit", round)

        // BUTTONS: SHOW/HIDE ANNOTATIONS

        q-btn.q-ml-xs.bg-dark(v-if="metadata", color="white", round, flat, icon="info")
          q-popover.bg-dark.q-py-sm
            q-item(multiline)
              q-item-side Title:
              q-item-main {{ metadata.title }}
        q-btn.q-ml-xs.bg-dark(v-if="!drawer", @click="drawer = true", color="white", round, flat)
          q-icon(name="fullscreen_exit")
        q-btn.q-ml-xs.bg-dark(v-else, @click="drawer = false", color="white", round, flat)
          q-icon.flip-horizontal(name="fullscreen")

      // TOP CENTER
      //
      //
      .absolute-top(style="width: 100%;")
        annotation-field(
        @annotation="onAnnotation",
        ref="annotationField",
        :submit-on-num-enters="1",
        :selector-value="baseSelector")

    // ANNOTATIONS
    //
    //
    q-layout-drawer.bg-dark(v-model="drawer", side="right")
      .absolute.fit.bg-dark
      q-list.no-border.bg-dark(dark)
        // q-item
          q-btn.full-width(@click="drawer = false")
            q-icon.flip-horizontal(name="keyboard_backspace")
        q-item.bg-dark(dark, v-for="(annotation, i) in annotations", :key="annotation.uuid", :ref="annotation.uuid",
        :class="[currentIndex === i ? 'bg-grey-9' : '']")
          q-item-main
            q-item-tile
              q-btn(
              v-if="annotation.target.selector", :color="currentIndex === i ? 'primary' : 'dark'",
              @click="gotoSelector(annotation.target.selector.value)", size="sm")
                | {{ formatSelectorForList(annotation.target.selector.value) }}

              q-btn.float-right(@click="$refs.confirmModal.show('messages.confirm_delete', annotation, 'buttons.delete')", size="sm") {{ $t('buttons.delete') }}
              q-btn.float-right(v-if="(!isEditingAnnotations && annotation.body.type === 'TextualBody') || editAnnotationIndex !== i",
                @click="setEditIndex(i)", size="sm") {{ $t('buttons.edit') }}
              q-btn.float-right(v-if="annotation.body.type === 'TextualBody' && editAnnotationIndex === i",
                @click="updateAnnotation(annotation)", size="sm", :color="isAnnotationDirty ? 'primary' : undefined") {{ $t('buttons.save') }}
            q-item-tile.q-caption.q-my-xs
              span {{ annotation.author.name }}
            q-item-tile
              markdown-display.markdown-display.q-mt-sm(v-if="!isEditingAnnotations || editAnnotationIndex !== i", :content="annotation.body.value")
              q-input.q-mt-sm.q-mb-sm(v-if="annotation.body.type === 'TextualBody' && editAnnotationIndex === i", color="white",
                type="textarea", v-model="annotation.body.value", dark)

</template>

<script>
  import { scroll, AppFullscreen } from 'quasar'
  import uuidValidate from 'uuid-validate'
  import { DateTime } from 'luxon'

  import { ObjectUtil, Assert, uuid } from 'mbjs-utils'
  import constants from 'mbjs-data-models/src/constants'
  import parseURI from 'mbjs-data-models/src/lib/parse-uri'

  import AnnotationField from '../../../components/piecemaker/partials/AnnotationField'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      AnnotationField
    },
    async mounted () {
      if (this.$route.params.id) {
        await this.getVideo()
        await this.getAnnotations()
      }
    },
    beforeDestroy () {
      AppFullscreen.exit()
    },
    data () {
      return {
        active: false,
        annotations: [],
        drawer: true,
        fullscreen: false,
        inputStyle: true,
        metadata: undefined,
        player: undefined,
        playerTime: 0.0,
        selector: undefined,
        staging: process.env.IS_STAGING,
        timelineId: undefined,
        timeline: undefined,
        video: undefined,
        editAnnotationIndex: undefined,
        editAnnotationBuffer: undefined,
        hashTimeout: undefined
      }
    },
    computed: {
      hashValue () {
        return this.$route.hash.length ? this.$route.hash.substr(1) : undefined
      },
      currentIndex () {
        if (!this.annotations.length) return

        let idx = -1, annotation = this.annotations[0]
        while (annotation && idx < this.annotations.length &&
          DateTime.fromISO(this.baseSelector) >= DateTime.fromISO(annotation.target.selector.value)) {
          idx++
          annotation = this.annotations[idx + 1]
        }
        return idx
      },
      baseSelector () {
        if (!this.video) return DateTime.local().toISO()
        return DateTime.fromISO(this.video.target.selector.value)
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
        if (this.annotations[val]) this.scrollToAnnotation(this.annotations[val].uuid)
      }
    },
    methods: {
      async handleConfirmModal (annotation) {
        await this.deleteAnnotation(annotation.uuid)
      },
      toggleFullscreen () {
        AppFullscreen.toggle()
        this.fullscreen = !this.fullscreen
      },
      async getVideo () {
        this.video = await this.$store.dispatch('annotations/get', this.$route.params.id)
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
          setTimeout(() => this.scrollToAnnotation(result.uuid), 500)
        }
        catch (err) {
          this.$handleError(this, err, 'errors.create_annotation_failed')
        }
      },
      scrollToAnnotation (uuid, duration = 100) {
        const el = this.$refs[uuid][0].$el
        setScrollPosition(getScrollTarget(el), el.offsetTop - el.scrollHeight, duration)
      },
      async updateAnnotation (annotation) {
        if (annotation.body.value !== this.editAnnotationBuffer) {
          try {
            Assert.isType(annotation, 'object')
            Assert.ok(uuidValidate(annotation.uuid))
            Assert.isType(annotation.body.value, 'string')
            await this.$store.dispatch('annotations/patch', [annotation.uuid, annotation])
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
        const millis = DateTime.fromISO(selector).toMillis() -
          DateTime.fromISO(this.video.target.selector.value).toMillis()
        const targetMillis = millis * 0.001
        if (this.playerTime !== targetMillis) this.player.currentTime(targetMillis)
      },
      gotoHashvalue () {
        if (this.hashValue && uuid.isUUID(this.hashValue)) {
          const result = this.annotations.filter(annotation => annotation.uuid === this.hashValue)
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
        const annotationDate = DateTime.fromISO(val)
        const videoDate = DateTime.fromISO(this.video.target.selector.value).toMillis()
        return annotationDate
          .minus(videoDate)
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
</style>
