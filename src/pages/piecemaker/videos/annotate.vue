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
      @ready="playerReady($event)", @time="onPlayerTime($event)")

      // TOP LEFT
      //
      //
      .absolute-top-left.q-ma-md(style="z-index: 2100;")
        // BUTTON: GO BACK
        back-button

      // TOP RIGHT
      //
      //
      .absolute-top-right.cursor-pointer.q-pa-md(style="z-index: 2100;")

        // BUTTONS: SWITCH TO FULLSCREEN

        // q-btn(v-if="!fullscreen", @click="toggleFullscreen()", icon="fullscreen", round)
        // q-btn(v-if="fullscreen", @click="toggleFullscreen()", icon="fullscreen_exit", round)

        // BUTTONS: SHOW/HIDE ANNOTATIONS

        q-btn.q-ml-xs(v-if="!drawer", @click="drawer = true", color="dark", round)
          q-icon(name="keyboard_backspace")
        q-btn.q-ml-xs(v-else, @click="drawer = false", color="dark", round)
          q-icon.flip-horizontal(name="keyboard_backspace")

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
              q-btn.float-right(@click="updateAnnotation(annotation)", size="sm") {{ $t('buttons.save') }}
              a.float-right.q-mr-sm(v-if="checkIfLink(annotation.body.value)", :href="annotation.body.value")
                q-icon(name="link")
            q-item-tile.q-caption.q-my-xs
              span {{ annotation.author.name }}
            q-item-tile.q-caption
              q-input(v-if="annotation.body.type === 'TextualBody'", color="white",
              type="textarea", v-model="annotation.body.value", dark)
              q-input(v-if="annotation.body.type === 'VocabularyEntry'", type="textarea",
              v-model="annotation.body.value", dark, disabled)

</template>

<script>
  import { scroll, AppFullscreen } from 'quasar'
  import uuidValidate from 'uuid-validate'
  import { DateTime } from 'luxon'

  import { ObjectUtil, Assert } from 'mbjs-utils'
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
        video: undefined
      }
    },
    computed: {
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
      }
    },
    methods: {
      checkIfLink (val) {
        let regexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
        return regexp.test(val)
        /* var urlRegex = /(https?:\/\/[^\s]+)/g
        return val.replace(urlRegex, function (url) {
          if (url) return true
        }) */
        /* return val.replace(urlRegex, function (url) {
          console.log(url)
          // return '<a href="' + url + '">' + url + '</a>'
        }) */
      },
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
          query['target.selector.value']['$lte'] = DateTime.fromISO(this.video.target.selector.value)
            .plus(this.metadata.duration * 1000)
            .toISO()
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
          // FIXME: scroll seems broken, cannot find ref, dom element probably not available yet
          // this.scrollToAnnotation(result.uuid)
        }
        catch (err) {
          this.$handleError(this, err, 'errors.create_annotation_failed')
        }
      },
      scrollToAnnotation (uuid, duration = 1000) {
        const el = this.$refs[uuid][0].$el
        setScrollPosition(getScrollTarget(el), el.offsetTop - el.scrollHeight, duration)
      },
      async updateAnnotation (annotation) {
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
        this.player.currentTime(millis * 0.001)
      },
      playerReady (player) {
        this.player = player
      },
      formatSelectorForList (val) {
        const annotationDate = DateTime.fromISO(val)
        const videoDate = DateTime.fromISO(this.video.target.selector.value).toMillis()
        return annotationDate
          .minus(videoDate)
          .toFormat(constants.TIMECODE_FORMAT).split(':').slice(1).join(':')
      },
      onPlayerTime (seconds) {
        this.playerTime = seconds
      }
    }
  }
</script>

<style lang="stylus">
  .moba-vocabs div:last-of-type
    display none
  .moba-vocabs:hover div:first-of-type
    display none
  .moba-vocabs:hover div:last-of-type
    display block
</style>
