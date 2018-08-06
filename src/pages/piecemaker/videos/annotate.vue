<template lang="pug">

  div.bg-dark(style="height: calc(100vh - 52px); overflow: hidden;")

    div.bg-dark(style="height: calc(100vh - 52px); overflow: hidden; position: relative;")

      // VIDEO
      //
      video-player(v-if="video", :annotation="video", @ready="playerReady($event)", @time="onPlayerTime($event)")

      // BUTTONS
      //
      div.absolute-top.q-mt-sm.q-ml-sm
        q-btn(@click="$router.push(timelines + gtimelines + '/videos')",
        color="grey", icon="keyboard_backspace", round, flat, small)
        q-btn(v-if="!fullscreen", @click="toggleFullscreen(), fullscreenHandler()", icon="fullscreen", round, flat, small)
        q-btn(v-if="fullscreen", @click="toggleFullscreen(), fullscreenHandler()", icon="fullscreen_exit", round, flat, small)

      q-btn.absolute-bottom-right.q-mb-md.q-mr-md(v-if="!drawer", @click="drawer = true")
        q-icon(name="keyboard_backspace")

      // POP-UP
      //
      .absolute-top-right.q-ma-md.cursor-pointer(style="width: 33%;")
        q-btn.q-mb-md.q-ml-md.float-right(v-if="!drawer", @click="drawer = true", color="dark", round)
          q-icon(name="keyboard_backspace")
        q-btn.q-mb-md.q-ml-md.float-right(v-else, @click="drawer = false", color="dark", round)
          q-icon.flip-horizontal(name="keyboard_backspace")
        div.bg-dark.q-pa-md.text-right.float-right(@click="toggleForm()", v-if="!active", color="primary", style="right: 0; opacity: .8;")
          | Start typing or click here

        div.bg-dark.q-pa-md.float-right(v-if="active")
          q-input(@keyup.enter="createAnnotation()", @keyup.esc="toggleForm(); closePopUp()",
            v-model="currentBody.value", type="textarea", float-label="Start typing", autofocus, dark)
          div.row
            .col-6
              q-btn(@click="toggleForm()", small) Esc
            .col-6.text-right
              q-btn(@click="createAnnotation()", small) Enter

    // ANNOTATIONS
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
              q-btn(v-if="annotation.target.selector", :color="currentIndex === i ? 'primary' : 'dark'", @click="gotoSelector(annotation.target.selector.value), changeState()", size="sm") {{ formatSelectorForList(annotation.target.selector.value) }}
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

  import VideoPlayer from '../../../components/shared/media/VideoPlayer'
  import Username from '../../../components/shared/partials/Username'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      VideoPlayer,
      Username
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
        drawer: true,
        fullscreen: false,
        player: undefined,
        playerTime: 0.0,
        video: undefined,
        timelineId: undefined,
        selector: undefined,
        baseSelector: undefined,
        metadata: undefined,
        active: false,
        annotations: [],
        currentBody: {
          value: undefined,
          purpose: 'commenting',
          type: 'TextualBody'
        },
        currentSelector: {
          type: 'Fragment',
          value: undefined
        },
        filtertypes: [{
          title: 'Comment'
        }, {
          title: 'Marker'
        }
        ]
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
        return this.$store.dispatch('annotations/post', annotation)
          .then(res => {
            _this.getAnnotations().then(() => {
              const targets = this.$refs[res.uuid]
              if (targets && targets.length) _this.scrollToElement(targets[0])
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
