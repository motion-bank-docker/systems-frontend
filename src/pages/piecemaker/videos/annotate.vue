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
      video-player(v-if="video", :annotation="video", @ready="playerReady($event)", @time="onPlayerTime($event)")

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
          :selector-factory="getCurrentSelector")

    // ANNOTATIONS
    //
    //
    q-layout-drawer.bg-dark(v-model="drawer", side="right")
      .absolute.fit.bg-dark
      q-list.no-border.bg-dark(dark)
        // q-item
          q-btn.full-width(@click="drawer = false")
            q-icon.flip-horizontal(name="keyboard_backspace")
        q-item.bg-dark(dark, v-for="(annotation, i) in annotations", :key="annotation.uuid", :ref="annotation.uuid")
          q-item-main
            q-item-tile
              q-btn(
              v-if="annotation.target.selector", :color="currentIndex === i ? 'primary' : 'dark'",
              @click="gotoSelector(annotation.target.selector.value)", size="sm")
                | {{ formatSelectorForList(annotation.target.selector.value) }}
              q-btn.float-right(@click="$refs.confirmModal.show('messages.confirm_delete', annotation, 'buttons.delete')", size="sm") {{ $t('buttons.delete') }}
              q-btn.float-right(@click="updateAnnotation(annotation)", size="sm") {{ $t('buttons.save') }}
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
  import { DateTime, Duration } from 'luxon'
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import constants from 'mbjs-data-models/src/constants'
  import { parseURI, Sorting } from 'mbjs-data-models/src/lib'
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
        baseSelector: undefined,
        drawer: true,
        fullscreen: false,
        filtertypes: [{
          title: 'Comment'
        }, {
          title: 'Marker'
        }],
        inputStyle: true,
        metadata: undefined,
        player: undefined,
        playerTime: 0.0,
        selector: undefined,
        staging: process.env.IS_STAGING,
        timelineId: undefined,
        video: undefined
      }
    },
    computed: {
      currentIndex () {
        if (!this.annotations.length) return
        let selector, baseMillis = this.baseSelector.toMillis() + this.playerTime * 1000
        for (let idx in this.annotations) {
          selector = this.annotations[idx].target.selector
            ? DateTime.fromISO(this.annotations[idx].target.selector.value).toMillis() : 0
          if (selector >= baseMillis) return parseInt(idx)
        }
      }
    },
    methods: {
      getCurrentSelector () {
        // store the current time of the player in relation to annotation upon first key press / term selection
        return this.baseSelector.plus(this.playerTime * 1000).toISO()
      },
      handleConfirmModal (annotation) {
        this.deleteAnnotation(annotation.uuid)
      },
      toggleFullscreen () {
        AppFullscreen.toggle()
        this.fullscreen = !this.fullscreen
      },
      async getVideo () {
        const result = await this.$store.dispatch('annotations/get', this.$route.params.id)
        if (result.body) {
          this.timelineId = parseURI(result.target.id).uuid
          this.video = result
          this.selector = DateTime.fromISO(result.target.selector.value)
          this.baseSelector = this.selector
          this.metadata = await this.$store.dispatch('metadata/get', result.uuid)
        }
      },
      async getAnnotations () {
        const
          _this = this,
          query = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${_this.timelineId}`,
            'target.type': constants.MAP_TYPE_TIMELINE,
            'target.selector.value': { $gte: this.baseSelector.toISO() },
            'body.type': { $in: ['TextualBody', 'VocabularyEntry'] }
          }
        if (this.metadata.duration) {
          query['target.selector.value']['$lte'] = this.baseSelector.plus(this.metadata.duration * 1000).toISO()
        }
        const results = await this.$store.dispatch('annotations/find', query)
        for (let item of results.items) {
          if (item.body.type === 'VocabularyEntry') {
            const entry = await this.$vocabularies.getEntry(item.body.source.id)
            item.body.value = entry.value
          }
        }
        if (results && Array.isArray(results.items)) {
          _this.annotations = results.items.sort(Sorting.sortOnTarget)
        }
      },
      onAnnotation (annotation) {
        console.debug('received annotation...', annotation)
        if (annotation) this.createAnnotation(annotation)
      },
      async createAnnotation (annotation = {}) {
        const payload = ObjectUtil.merge(annotation, {
          target: {
            id: `${process.env.TIMELINE_BASE_URI}${this.timelineId}`,
            type: constants.MAP_TYPE_TIMELINE
          }
        })
        const result = await this.$store.dispatch('annotations/post', payload)
        if (result.body.type === 'VocabularyEntry') {
          const entry = await this.$vocabularies.getEntry(result.body.source.id)
          result.body.value = entry.value
        }
        this.annotations.push(result)
        this.annotations = this.annotations.sort(Sorting.sortOnTarget)
        // FIXME: scroll seems broken, cannot find ref
        // this.scrollToAnnotation(result.uuid)
      },
      scrollToAnnotation (uuid, duration = 1000) {
        const el = this.$refs[uuid][0].$el
        setScrollPosition(getScrollTarget(el), el.offsetTop - el.scrollHeight, duration)
      },
      updateAnnotation (annotation) {
        Assert.isType(annotation, 'object')
        Assert.ok(uuidValidate(annotation.uuid))
        Assert.isType(annotation.body.value, 'string')
        return this.$store.dispatch('annotations/patch', [annotation.uuid, annotation])
          .then(() => this.getAnnotations())
      },
      deleteAnnotation (uuid) {
        Assert.ok(uuidValidate(uuid))
        return this.$store.dispatch('annotations/delete', uuid)
          .then(() => this.getAnnotations())
      },
      gotoSelector (selector) {
        const millis = DateTime.fromISO(selector).toMillis() - this.baseSelector.toMillis()
        this.player.currentTime(millis * 0.001)
      },
      playerReady (player) {
        this.player = player
      },
      formatSelectorForList (val) {
        const selector = DateTime.fromISO(val)
        // TODO: this is displaying 'HH:00:00.000' for times that are less than an hour
        return Duration
          .fromMillis(selector.toMillis() - this.baseSelector.toMillis())
          .toFormat(constants.TIMECODE_FORMAT)
          .replace(/[^0-9.:]+/, '')
          .replace(/^[^0-9]/, '')
          .replace(/[^0-9]$/, '')
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
