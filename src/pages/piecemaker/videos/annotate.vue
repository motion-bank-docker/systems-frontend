<template lang="pug">

  div.bg-dark(style="height: calc(100vh - 52px); overflow: hidden;")

    div.bg-dark(style="height: calc(100vh - 52px); overflow: hidden; position: relative;")

      // VIDEO
      //
      video-player(v-if="video", :src="video.body.source.id", @ready="playerReady($event)", @time="onPlayerTime($event)")

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
        div.bg-dark.q-pa-md.text-right.absolute(@click="toggleForm()", v-if="!active", color="primary", style="right: 0; opacity: .8;")
          | Start typing or click here

        div.bg-dark.q-pa-md(v-if="active")
          q-input(@keyup.enter="createAnnotation()", @keyup.esc="toggleForm(); closePopUp()",
            v-model="currentBody.value", type="textarea", float-label="Start typing", autofocus, dark)
          div.row
            .col-6
              q-btn(@click="toggleForm()", small) Esc
            .col-6.text-right
              q-btn(@click="createAnnotation()", small) Enter

    // ANNOTATIONS
    //
    q-layout-drawer.bg-dark(dark, v-model="drawer", side="right")
      q-list.no-border.bg-dark(dark)
        q-item
          q-btn.full-width(@click="drawer = false")
            q-icon.flip-horizontal(name="keyboard_backspace")
        q-item.bg-dark(dark, v-for="(annotation, i) in annotations", :class="{ highlight: i === currentIndex }", :key="annotation.uuid", :ref="annotation.uuid")
          q-item-main
            q-item-tile
              q-btn(v-if="annotation.target.selector", @click="gotoSelector(annotation.target.selector.value), changeState()", size="sm") {{ formatSelectorForList(annotation.target.selector.value) }}
              q-btn.float-right(@click="deleteAnnotation(annotation.uuid), changeState()", size="sm") {{ $t('buttons.delete') }}
              q-btn.float-right(@click="updateAnnotation(annotation), addKeypressListener()", size="sm") {{ $t('buttons.save') }}
            q-item-tile.q-caption.q-my-xs
              span {{ annotation.author.name }}
            q-item-tile.q-caption
              q-input(@click="changeState(), hideForm()", type="textarea", v-model="annotation.body.value", dark, color="white")

</template>

<script>
  import { scroll, AppFullscreen } from 'quasar'
  const { getScrollTarget, setScrollPosition } = scroll
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import uuidValidate from 'uuid-validate'
  import VideoPlayer from '../../../components/shared/media/VideoPlayer'
  import annotations from '../../../lib/annotations'
  import constants from '../../../lib/constants'
  import Username from '../../../components/shared/partials/Username'

  const TimelineSelector = annotations.selectors.TimelineSelector

  export default {
    components: {
      VideoPlayer,
      Username
    },
    mounted () {
      const _this = this
      if (this.$route.params.id) {
        this.getVideo().then(() => _this.getAnnotations())
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
        currentIndex: undefined,
        video: undefined,
        groupId: undefined,
        baseSelector: undefined,
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
      getVideo () {
        const _this = this
        return this.$store.dispatch('annotations/get', _this.$route.params.id)
          .then(result => {
            if (result.body) {
              _this.groupId = result.target.id
              _this.video = result
              _this.baseSelector = TimelineSelector.fromISOString(result.target.selector.value)
            }
          })
      },
      getAnnotations () {
        const
          _this = this,
          query = {
            'target.id': _this.groupId,
            'target.type': constants.MAP_TYPE_TIMELINE,
            'body.type': 'TextualBody'
          }
        return this.$store.dispatch('annotations/find', query)
          .then(results => {
            console.log(results)
            if (results && Array.isArray(results.items)) {
              _this.annotations = results.items.sort(annotations.Sorting.sortOnTarget)
            }
          })
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
          const selector = TimelineSelector.fromDateTime(this.baseSelector.dateTime)
          let seconds = this.player.currentTime()
          selector.add(seconds * 1000)
          this.currentSelector.value = selector.isoString
          this.active = true
        }
      },
      createAnnotation () {
        const _this = this
        const annotation = {
          body: ObjectUtil.merge({}, _this.currentBody),
          target: {
            id: _this.groupId,
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
        selector = TimelineSelector.fromISOString(selector)
        selector.subtract(this.baseSelector.millis)
        this.player.currentTime(selector.millis * 0.001)
      },
      playerReady (player) {
        this.player = player
      },
      formatSelectorForList (val) {
        const selector = TimelineSelector.fromISOString(val)
        // selector.subtract(this.baseSelector.millis)
        return selector.toFormat(constants.TIMECODE_FORMAT)
      },
      onPlayerTime (seconds) {
        this.playerTime = seconds
        this.updateHighlight(seconds)
      },
      updateHighlight (seconds) {
        if (!this.annotations.length) return
        let
          baseMillis = this.baseSelector.millis + seconds * 1000,
          annoCount = this.annotations.length,
          selector, idx = 0, running = true
        while (running && this.annotations[idx]) {
          selector = this.annotations[idx].target.selector
            ? TimelineSelector.fromISOString(this.annotations[idx].target.selector.value) : undefined
          running = selector && baseMillis < selector.millis
          if (!running) this.currentIndex = idx
          if (idx >= annoCount) break
          idx++
        }
        if (running) this.currentIndex = undefined
      }
    }
  }
</script>

<style scoped>
  .highlight {
    /* background-color: rgba( 0, 255, 0, .5 );
    transition: background-color ease 500ms; */
  }
</style>
