<template lang="pug">

  // POST ANNOTATION

  .bg-dark(style="height: calc(100vh - 52px); overflow: hidden;")

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

        q-btn(@click="$router.push({name: 'piecemaker.videos.list', params: {timelineId: timelineId}})",
        color="grey", icon="keyboard_backspace", round, flat, small)

      // TOP RIGHT
      //
      //
      .absolute-top-right.cursor-pointer.q-pa-md(style="z-index: 2100;")

        // BUTTONS: SWITCH TO FULLSCREEN

        q-btn(v-if="!fullscreen", @click="toggleFullscreen(), fullscreenHandler()", icon="fullscreen", round)
        q-btn(v-if="fullscreen", @click="toggleFullscreen(), fullscreenHandler()", icon="fullscreen_exit", round)

        // BUTTONS: SHOW/HIDE ANNOTATIONS

        q-btn.q-ml-xs(v-if="!drawer", @click="drawer = true", color="dark", round)
          q-icon(name="keyboard_backspace")
        q-btn.q-ml-xs(v-else, @click="drawer = false", color="dark", round)
          q-icon.flip-horizontal(name="keyboard_backspace")

      // TOP CENTER
      //
      //
      // .fixed-top(style="top: 50px; width: 100%; z-index: 1000;")
      .absolute-top(style="width: 100%;")
        vocabularies-main(@currentString="currentString")

        // INFO TEXT

        // .bg-dark.q-pa-md.q-mt-md.q-mr-md.text-center(
          .bg-dark.q-pa-md.cursor-pointer(
          v-if="!active && inputStyle", @click="toggleForm()", color="primary", style="opacity: .6;")
            | Start typing or click here.

        // TEXT INPUT

        // .q-pa-md(v-if="active")
          div(v-if="active && inputStyle")
            q-input.q-px-sm(
            @keyup.enter="createAnnotation()", @keyup.esc="toggleForm(); closePopUp()",
            v-model="currentBody.value", type="textarea", float-label="Start typing", autofocus, dark,
            style="background-color: rgba( 0, 0, 0, .5 );", rounded
            )
          // .row
            .col-6
              q-btn.bg-dark(@click="toggleForm()", small) Esc
            .col-6.text-right
              q-btn.bg-dark(@click="createAnnotation()", small) Enter

      // VOCABULARIES

        div.fixed-top.q-mt-md.absolute-top.moba-vocabs(v-if="!inputStyle", style="width: 60%; left: 20%;")
          div.bg-dark.q-pa-md(style="opacity: .6;") Vocabularies
          vocabularies.q-px-sm.q-pt-sm(:parent='parent')

      //
        q-collapsible.fixed-top.q-mt-md.absolute-top.moba-hover(
        v-if="!inputStyle", style="width: 60%; left: 20%;", label="Hover the rectangle below to show vocabularies", opened
        )
          vocabularies(:parent='parent')

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
              @click="gotoSelector(annotation.target.selector.value), changeState()", size="sm")
                | {{ formatSelectorForList(annotation.target.selector.value) }}
              q-btn.float-right(@click="deleteAnnotation(annotation.uuid), changeState()", size="sm") {{ $t('buttons.delete') }}
              q-btn.float-right(@click="updateAnnotation(annotation), addKeypressListener()", size="sm") {{ $t('buttons.save') }}
            q-item-tile.q-caption.q-my-xs
              span {{ annotation.author.name }}
            q-item-tile.q-caption
              q-input(@click="changeState(), hideForm()", color="white", type="textarea", v-model="annotation.body.value", dark)

</template>

<script>
  import { scroll, AppFullscreen } from 'quasar'
  import uuidValidate from 'uuid-validate'
  import { DateTime } from 'luxon'

  import { ObjectUtil, Assert } from 'mbjs-utils'
  import constants from 'mbjs-data-models/src/constants'
  import { parseURI, Sorting } from 'mbjs-data-models/src/lib'

  import { VideoPlayer, Username } from 'mbjs-quasar/src/components'
  // import Vocabularies from '../../../components/piecemaker/partials/vocabularies/Vocabularies'
  import VocabulariesMain from '../../../components/piecemaker/partials/vocabularies/VocabulariesMain'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      VideoPlayer,
      Username,
      // Vocabularies,
      VocabulariesMain
    },
    async mounted () {
      if (this.$route.params.id) {
        await this.getVideo()
        await this.getAnnotations()
      }
      window.addEventListener('keypress', this.toggleForm)
    },
    beforeDestroy () {
      window.removeEventListener('keypress', this.toggleForm)
      AppFullscreen.exit()
    },
    data () {
      return {
        active: false,
        annotations: [],
        baseSelector: undefined,
        currentBody: {
          value: undefined,
          purpose: 'commenting',
          type: 'TextualBody'
        },
        currentSelector: {
          type: 'Fragment',
          value: undefined
        },
        drawer: true,
        fullscreen: false,
        filtertypes: [{
          title: 'Comment'
        }, {
          title: 'Marker'
        }
        ],
        inputStyle: true,
        metadata: undefined,
        parent: 'post-annotate',
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
      toggleFullscreen () {
        AppFullscreen.toggle()
      },
      changeState () {
        this.active = false
        this.currentSelector.value = undefined
        this.currentBody.value = undefined
        window.addEventListener('keypress', this.toggleForm)
      },
      hideForm () {
        window.removeEventListener('keypress', this.toggleForm)
      },
      addKeypressListener () {
        window.addEventListener('keypress', this.toggleForm)
      },
      fullscreenHandler () {
        this.fullscreen = !this.fullscreen
      },
      /* toggleInputStyle () {
        this.inputStyle = !this.inputStyle
      }, */
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
            'body.type': 'TextualBody',
            'target.selector.value': { $gte: this.baseSelector.toISO() }
          }
        if (this.metadata.duration) {
          query['target.selector.value']['$lte'] = this.selector.plus(this.metadata.duration * 1000).toISO()
        }
        const results = await this.$store.dispatch('annotations/find', query)
        if (results && Array.isArray(results.items)) {
          _this.annotations = results.items.sort(Sorting.sortOnTarget)
        }
      },
      toggleForm () {
        if (this.active) {
          this.active = false
          this.currentSelector.value = undefined
          this.currentBody.value = undefined
          window.addEventListener('keypress', this.toggleForm)
        }
        else {
          window.removeEventListener('keypress', this.toggleForm)
          if (!this.player) return
          let selector = DateTime.fromISO(this.baseSelector.toISO())
          let seconds = this.player.currentTime()
          selector = selector.plus(seconds * 1000)
          this.currentSelector.value = selector.toISO()
          this.active = true
        }
      },
      currentString (val) {
        // console.log(val, '------')
        // alert(val)
        const bodyLength = val.string.length
        if (bodyLength > 2) {
          // this.currentBody.value = val.string.substr(0, bodyLength - 2)
          this.currentBody.value = val.string
          this.currentSelector.value = val.time
          this.createAnnotation()
        }
        else {
          this.currentBody.value = undefined
        }
      },
      createAnnotation () {
        const _this = this
        const annotation = {
          body: ObjectUtil.merge({}, _this.currentBody),
          target: {
            id: `${process.env.TIMELINE_BASE_URI}${_this.timelineId}`,
            type: constants.MAP_TYPE_TIMELINE,
            selector: ObjectUtil.merge({}, _this.currentSelector)
          }
        }
        annotation.body.value = annotation.body.value.trim()
        this.currentBody.value = undefined
        this.currentSelector.value = undefined
        return this.$store.dispatch('annotations/post', annotation)
          .then(res => {
            _this.getAnnotations().then(() => {
              const targets = this.$refs[res.uuid]
              if (targets && targets.length) _this.scrollToElement(targets[0].$el)
            })
          })
          .then(() => _this.toggleForm())
      },
      scrollToElement (el, duration = 1000) {
        let target = getScrollTarget(el)
        let offset = el.offsetTop - el.scrollHeight
        setScrollPosition(target, offset, duration)
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
        return selector.toFormat(constants.TIMECODE_FORMAT)
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
