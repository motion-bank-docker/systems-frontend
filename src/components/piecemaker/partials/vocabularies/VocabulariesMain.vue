<template lang="pug">

  // TOP CENTER
  //
  //
  .row.q-mt-md

    // SET SHORTCUT
    q-modal(v-model="showShortcutModal", minimized)
      .bg-dark
        ul.text-white.bg-dark
          li
            | Press a new key now to define a new shortcut.
          li
            | Press escape to abort.

    // BUTTON - SWITCH BETWEEN TEXT INPUT AND TAG BOX

    .col-xs-2.offset-xs-1.col-md-1.offset-md-1.col-lg-1.offset-lg-2.text-right.q-pa-sm.q-pr-md
      q-btn.text-primary.bg-grey-10(v-if="!tagBox && staging", @click="tagBox = true", round) #

    .col-xs-8.col-md-8.col-lg-6.bg-grey-10.relative-position(:class="[tagBox ? 'shadow-4' : '']")

      // TEXT INPUT

      q-input.q-pa-md(
      v-model="currentBody.value", :class="[tagBox ? 'q-pl-xl text-primary' : 'text-white']",
      @keyup="keyMonitor", @keydown.18="keyPressAlt('down')", @keyup.18="keyPressAlt('up')", type="textarea", autofocus, dark)

      .absolute-top.q-mt-sm(v-if="staging", style="width: 3rem;")
        q-btn.q-ml-sm.q-mt-xs.q-mr-none.text-primary(
        v-if="tagBox", @click="tagBox = false", round, flat, icon="clear", size="sm")

      // TAG BOX

      div(v-if="tagBox && staging")
        vocabularies(:parent='parent', :str="currentBody.value", :vocabulary="vocabs", @highlightedTag="highlightTag", @openShortcut="openShortcut")

</template>

<script>
  // import Full from 'mbjs-quasar/src/components/layouts/Full'
  import Vocabularies from './Vocabularies'
  // import { ObjectUtil, Assert } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  // import uuidValidate from 'uuid-validate'
  // import constants from 'mbjs-data-models/src/constants'
  // import { Sorting } from 'mbjs-data-models/src/lib'

  export default {
    components: {
      // Full,
      Vocabularies
    },
    data () {
      return {
        // activeShortcutFeature: false,
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
        currentVal: {
          time: undefined,
          string: undefined
        },
        vocabs: [{
          id: 1,
          shortcutKey: {
            code: 65,
            value: 'a'
          },
          title: 'movement direction'
        }, {
          id: 2,
          shortcutKey: {
            code: 66,
            value: 'b'
          },
          title: 'facial orientation'
        }, {
          id: 3,
          shortcutKey: {
            code: undefined,
            value: undefined
          },
          title: 'direction body/body parts'
        }, {
          id: 4,
          shortcutKey: {
            code: undefined,
            value: undefined
          },
          title: 'weight engagement individual'
        }, {
          id: 5,
          shortcutKey: {
            code: undefined,
            value: undefined
          },
          title: 'weight engagement with partner'
        }, {
          id: 6,
          shortcutKey: {
            code: undefined,
            value: undefined
          },
          title: 'weight regulation with partner'
        }, {
          id: 7,
          shortcutKey: {
            code: undefined,
            value: undefined
          },
          title: 'synchronisation in rythm'
        }, {
          id: 8,
          shortcutKey: {
            code: undefined,
            value: undefined
          },
          title: 'synchonisation in phrase'
        }],
        currentTag: undefined,
        highlightedTag: undefined,
        inputStyle: true,
        parent: 'live-annotate',
        prevKey: undefined,
        shortcutsActivated: false,
        showShortcutModal: false,
        staging: process.env.IS_STAGING,
        tagBox: false
      }
    },
    mounted () {
      window.addEventListener('keydown', this.setShortcut)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.setShortcut)
    },
    methods: {
      openShortcut (val) {
        this.showShortcutModal = true
        this.currentTag = val
      },
      setShortcut (e) {
        if (this.showShortcutModal) {
          if (e.keyCode !== 8) {
            this.vocabs[this.currentTag - 1].shortcutKey.code = e.keyCode
            this.vocabs[this.currentTag - 1].shortcutKey.value = e.key
          }
          else if (e.keyCode === 8) { // backspace
            this.vocabs[this.currentTag - 1].shortcutKey.code = undefined
            this.vocabs[this.currentTag - 1].shortcutKey.value = undefined
          }
          this.showShortcutModal = false
        }
      },
      highlightTag (val) {
        this.highlightedTag = val
      },
      shortcutTest (e) {
        var obj = this.vocabs.find(function (obj) { return obj.shortcutKey.code === e.keyCode })
        if (obj !== undefined) {
          this.currentVal.string = obj.title
          this.currentVal.time = this.currentSelector.value
        }
        this.$emit('currentString', this.currentVal)
      },
      keyPressAlt (val) {
        this.currentVal.string = this.highlightedTag
        this.currentVal.time = this.currentSelector.value
        if (val === 'down') {
          this.shortcutsActivated = true
          window.addEventListener('keydown', this.shortcutTest)
        }
        else {
          this.shortcutsActivated = false
          window.removeEventListener('keydown', this.shortcutTest)
          this.currentBody.value = ''
        }
        if (this.currentVal.string !== undefined && val === 'up') this.$emit('currentString', this.currentVal)
        this.tagBox = !this.tagBox
        this.currentVal.string = undefined
        this.highlightedTag = undefined
      },
      keyMonitor (e) {
        if (this.prevKey === 13 && e.keyCode === 13 && !this.tagBox) { // enter text input
          this.currentVal.string = this.currentBody.value
          this.currentVal.time = this.currentSelector.value
          // console.log(this.currentVal)
          this.prevKey = undefined
          this.tagBox = false
          const bodyLength = this.currentBody.value.length
          if (bodyLength > 2) {
            this.currentBody.value = this.currentVal.string.substr(0, bodyLength - 2)
            this.$emit('currentString', this.currentVal)
            this.currentBody.value = undefined
            this.currentSelector.value = undefined
          }
          else {
            this.currentBody.value = undefined
          }
        }
        else if (e.keyCode === 13 && this.tagBox) { // enter vocabulary
          this.currentVal.string = this.highlightedTag
          this.currentVal.time = this.currentSelector.value
          this.$emit('currentString', this.currentVal)
          this.tagBox = false
          this.currentBody.value = undefined
        }
        else if (e.keyCode === 27) { // escape
          this.tagBox = false
          this.currentBody.value = undefined
        }
        else if (e.keyCode === 18) { // alt
        }
        else if (e.keyCode === 220 || e.keyCode === 40) { // hashtag or arrow down
          this.currentSelector.value = DateTime.local().toISO()
          this.tagBox = true
          if (e.keyCode === 220) this.currentBody.value = undefined
        }
        else {
          if (this.currentSelector.value === undefined) {
            this.currentSelector.value = DateTime.local().toISO()
          }
          this.prevKey = e.keyCode
        }
        if (this.shortcutsActivated) {
          this.currentBody.value = ''
        }
      } /*,
      createAnnotation () {
        const _this = this
        const annotation = {
          body: ObjectUtil.merge({}, _this.currentBody),
          target: {
            id: `${process.env.TIMELINE_BASE_URI}${_this.$route.params.id}`,
            type: constants.MAP_TYPE_TIMELINE,
            selector: ObjectUtil.merge({}, _this.currentSelector)
          }
        }
        annotation.body.value = annotation.body.value.trim()
        this.currentBody.value = undefined
        this.currentSelector.value = undefined
        return this.$store.dispatch('annotations/post', annotation)
          .then(annotation => {
            _this.annotations.push(annotation)
            _this.annotations = _this.annotations.sort(Sorting.sortOnTarget)
            _this.scrollToElement()
            // _this.scrollToElement(annotation.uuid)
          })
      },
      deleteAnnotation (uuid, index) {
        Assert.ok(uuidValidate(uuid))
        Assert.isType(index, 'number')
        return this.$store.dispatch('annotations/delete', uuid)
          .then(() => {
            this.annotations.splice(index, 1)
          })
      },
      scrollToElement () {
        // alert(uuid)
        // window.location.href = '#' + uuid
        // window.scrollTo(0, document.body.scrollHeight)
        setTimeout(function () {
          window.scrollTo(0, document.body.scrollHeight)
        }, 250)
      },
      formatSelectorForList (val) {
        const selector = DateTime.fromISO(val)
        return selector.toFormat(constants.TIMECODE_FORMAT)
      } */
    }
  }
</script>

<style scoped>
</style>
