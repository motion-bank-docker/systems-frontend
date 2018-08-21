<template lang="pug">

  // TOP CENTER
  //
  //
  .row.q-mt-md

    // SET SHORTCUT

    q-modal(v-model="showShortcutModal", minimized)
      .bg-dark
        q-list.no-paddin.no-border.text-white.bg-dark
          q-item – Press a new key now to define a new shortcut.
          q-item – Press escape to abort.

    // BUTTON - SWITCH BETWEEN TEXT INPUT AND TAG BOX

    .col-xs-2.offset-xs-1.col-md-1.offset-md-1.col-lg-1.offset-lg-2.text-right.q-pa-sm.q-pr-md
      q-btn.text-primary.bg-grey-10(v-if="!showTagBox && staging", @click="showTagBox = true, setFocusOnInput()", round) #

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
    methods: {
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
          if (e.keyCode >= 65 && e.keyCode <= 90) { // [a] - [z] only
            this.vocabs[this.currentTag - 1].shortcutKey.code = e.keyCode
            this.vocabs[this.currentTag - 1].shortcutKey.value = e.key
            this.showShortcutModal = false
          }
          else {
            this.vocabs[this.currentTag - 1].shortcutKey.code = undefined
            this.vocabs[this.currentTag - 1].shortcutKey.value = undefined
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
        if (this.prevKey === 13 && e.keyCode === 13 && !this.showTagBox) { // [enter] text input
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
        else if (e.keyCode === 13 && this.showTagBox) { // [enter] vocabulary
          this.currentVal.string = this.highlightedTag
          this.currentVal.time = this.currentSelector.value
          this.$emit('currentString', this.currentVal)
          this.showTagBox = false
          this.currentBody.value = undefined
        }
        else if (e.keyCode === 27) { // [escape]
          this.showTagBox = false
          this.currentBody.value = undefined
        }
        else if (e.keyCode === 18) { // [alt]
        }
        else if (e.keyCode === 220 || e.keyCode === 40) { // [#] or [arrow down]
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
