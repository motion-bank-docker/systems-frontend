<template lang="pug">

  // TOP CENTER
  //
  //
  .row.q-mt-md

    // SET SHORTCUT

    q-modal(v-model="showShortcutModal", minimized)
      .bg-dark.position-relative.q-pa-xl
        | Press a key between
        span.text-primary.q-mx-sm a
        | and
        span.text-primary.q-mx-sm z
        | to define a new shortcut.

        q-btn.q-ml-lg(@click="showShortcutModal = false", icon="clear", round)

    // SET NEW VOCABULARY

    q-modal(v-model="showVocabularyModal", minimized)
      .bg-dark.position-relative.q-pa-xl
        | Do you want to include
        br
        span.text-primary.q-mx-sm ...
        br
        | in the vocabularies?

        q-btn.q-ml-lg(@click="showShortcutModal = false", icon="clear", round)

    // BUTTON - SWITCH BETWEEN TEXT INPUT AND TAG BOX

    .col-xs-2.offset-xs-1.col-md-1.offset-md-1.col-lg-1.offset-lg-2.text-right.q-pa-sm.q-pr-md
      q-btn.text-primary.bg-grey-10(v-if="!showTagBox && staging", @click="showTagBox = true, setFocusOnInput()", round, icon="local_offer")

    .col-xs-8.col-md-8.col-lg-6.bg-grey-10.relative-position(:class="[showTagBox ? 'shadow-4' : '']")

      // TEXT INPUT

      q-input.q-pa-md(
      v-model="currentBody.value", ref="textInput", :class="[showTagBox ? 'q-pl-xl text-primary' : 'text-white']",
      @keyup="keyMonitor", @keydown.18="keyPressAlt('down')", @keyup.18="keyPressAlt('up')", type="textarea", autofocus, dark)

      // CLOSE BUTTON

      .absolute-top.q-mt-sm(v-if="staging", style="width: 3rem;")
        q-btn.q-ml-sm.q-mt-xs.q-mr-none.text-primary(
        v-if="showTagBox", @click="showTagBox = false, setFocusOnInput()", round, flat, icon="clear", size="sm")

      // TAG BOX

      div(v-if="showTagBox && staging", ref="tagbox")
        vocabularies(:parent="parent", :str="currentBody.value", :vocabulary="vocabs",
        @clickTag="clickTag", @emitFocus="setFocusOnInput", @highlightedTag="highlightTag", @openShortcut="openShortcut")

</template>

<script>
  import Vocabularies from './Vocabularies'
  import { DateTime } from 'luxon'
  // import { Notify } from 'quasar'

  const alerts = [
    { color: 'negative', message: 'Invalid', icon: 'clear' },
    { color: 'blue', message: 'Accepted', icon: 'thumb_up' }
  ]

  export default {
    components: {
      Vocabularies
    },
    data () {
      return {
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
        showVocabularyModal: false,
        staging: process.env.IS_STAGING,
        showTagBox: false
      }
    },
    mounted () {
      window.addEventListener('keydown', this.setShortcut)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.setShortcut)
    },
    watch: {
      newVocabulary: function (val) {
        // console.log('watch newVocabulary: ' + val)
        this.showVocabularyModal = true
        this.extendVocabulary(val)
      }
    },
    props: ['newVocabulary'],
    methods: {
      extendVocabulary (val) {
        // console.log('extendVocabulary: ' + val)
        let countId = this.vocabs.length + 1
        this.vocabs.push({ id: countId, shortcutKey: { code: undefined, value: undefined }, title: val })
        /* this.vocabs.sort(function (a, b) {
          return a[2] - b[2]
        }) */
      },
      clickTag (val) {
        this.currentVal.string = val
        this.currentVal.time = this.currentSelector.value
        this.$emit('currentString', this.currentVal)
        this.currentBody.value = undefined
        // this.currentSelector.value = undefined
      },
      setFocusOnInput () {
        this.$refs.textInput.focus()
      },
      openShortcut (val) {
        this.showShortcutModal = true
        this.currentTag = val
      },
      setShortcut (e) {
        if (e.keyCode === 27) {
          this.setFocusOnInput()
        }
        if (this.showShortcutModal) {
          // [a] - [z] only
          if (e.keyCode >= 65 && e.keyCode <= 90 && this.vocabs[this.currentTag - 1].shortcutKey.code !== e.keyCode) {
            this.vocabs[this.currentTag - 1].shortcutKey.code = e.keyCode
            this.vocabs[this.currentTag - 1].shortcutKey.value = e.key
            this.showShortcutModal = false
            this.$q.notify({ color: alerts[1]['color'], message: alerts[1]['message'] })
          }
          else {
            this.vocabs[this.currentTag - 1].shortcutKey.code = undefined
            this.vocabs[this.currentTag - 1].shortcutKey.value = undefined
            this.$q.notify({ color: alerts[0]['color'], message: alerts[0]['message'] })
          }
        }
      },
      highlightTag (val) {
        this.highlightedTag = val
      },
      applyQuickShortcut (e) {
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
          window.addEventListener('keydown', this.applyQuickShortcut)
        }
        else {
          this.shortcutsActivated = false
          window.removeEventListener('keydown', this.applyQuickShortcut)
          this.currentBody.value = ''
        }
        if (this.currentVal.string !== undefined && val === 'up') this.$emit('currentString', this.currentVal)
        this.showTagBox = !this.showTagBox
        this.currentVal.string = undefined
        this.highlightedTag = undefined
      },
      keyMonitor (e) {
        // [enter] text input
        if (this.prevKey === 13 && e.keyCode === 13 && !this.showTagBox) {
          this.currentVal.string = this.currentBody.value
          this.currentVal.time = this.currentSelector.value
          this.prevKey = undefined
          this.showTagBox = false
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
        // [enter] vocabulary
        else if (e.keyCode === 13 && this.showTagBox) {
          this.currentVal.string = this.highlightedTag
          this.currentVal.time = this.currentSelector.value
          this.$emit('currentString', this.currentVal)
          this.showTagBox = false
          this.currentBody.value = undefined
        }
        // [escape]
        else if (e.keyCode === 27) {
          this.showTagBox = false
          this.currentBody.value = undefined
        }
        // [tab]
        else if (e.keyCode === 9) {
        }
        // [alt]
        else if (e.keyCode === 18) {
        }
        // [#] or [arrow down]
        else if (e.keyCode === 220 || e.keyCode === 40) {
          this.currentSelector.value = DateTime.local().toISO()
          this.showTagBox = true
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
      }
    }
  }
</script>

<style scoped>
</style>
