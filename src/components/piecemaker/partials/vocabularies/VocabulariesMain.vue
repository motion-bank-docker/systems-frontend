<template lang="pug">

  // TOP CENTER
  //
  //
  .row.q-mt-md

    // q-btn.fixed-bottom-left.q-ma-md(color="primary", outline) alt

    // SET SHORTCUT

    modal(ref="shortcutModal", close-icon="clear")
      template(slot="content")
        | Press a key between
        span.text-primary.q-mx-sm a
        | and
        span.text-primary.q-mx-sm z
        | to define a new shortcut.

    // SET NEW VOCABULARY

    modal-confirm(ref="vocabularyModal", close-icon="clear", @confirm="extendVocabulary(newVocabulary)")
      template(slot="content")
        .text-center
          div Do you want to include
          div.text-primary {{ newVocabulary }}
          div into your vocabularies?

    // BUTTON - SWITCH BETWEEN TEXT INPUT AND TAG BOX

    .col-xs-2.offset-xs-1.col-md-1.offset-md-1.col-lg-1.offset-lg-2.text-right.q-pa-sm.q-pr-md
      q-btn.text-primary.bg-grey-10(v-if="!showTagBox && staging", @click="showTagBox = true, setFocusOnInput()", round, icon="local_offer")

    .col-xs-8.col-md-8.col-lg-6.bg-grey-10.relative-position(:class="[showTagBox ? 'shadow-4' : '']")

      // TEXT INPUT

      q-input.q-pa-md(
      v-model="currentBody.value", ref="textInput",
      :class="[showTagBox ? 'q-pl-xl text-primary' : 'text-white']",
      @keyup="keyMonitor", @keydown.18="keyPressAlt('down')", @keyup.18="keyPressAlt('up')", type="textarea", autofocus, dark)

      // CLOSE BUTTON

      .absolute-top.q-mt-sm(v-if="staging", style="width: 3rem;")
        q-btn.q-ml-sm.q-mt-xs.q-mr-none.text-primary(
        v-if="showTagBox", @click="showTagBox = false, setFocusOnInput()", round, flat, icon="clear", size="sm")

      // TAG BOX

      div(v-if="showTagBox && staging", ref="tagbox")
        .q-pa-md
          q-btn.q-px-lg.q-mr-sm(@click="changeVocabularies(vocabsNull)", size="sm") SEAM
          q-btn.q-px-lg.q-mr-sm(@click="changeVocabularies(vocabsOne)", size="sm") shortterms
          q-btn.q-px-lg.q-mr-sm(@click="changeVocabularies(vocabsTwo)", size="sm") selected categories
          q-btn.q-px-lg(@click="changeVocabularies(vocabsThree)", size="sm") all terms
        vocabularies(:parent="parent", :str="currentBody.value", :vocabulary="vocabs", :pressedAlt="altIsPressed",
        @clickTag="clickTag", @emitFocus="setFocusOnInput", @highlightedTag="highlightTag", @openShortcut="openShortcut")

</template>

<script>
  import { DateTime } from 'luxon'

  import Modal from '../../../shared/partials/Modal'
  import ModalConfirm from '../../../shared/partials/ModalConfirm'
  import Vocabularies from './Vocabularies'
  // import { Notify } from 'quasar'

  const alerts = [
    { color: 'negative', message: 'Invalid', icon: 'clear' },
    { color: 'blue', message: 'Accepted', icon: 'thumb_up' }
  ]

  export default {
    components: {
      Modal,
      ModalConfirm,
      Vocabularies
    },
    data () {
      return {
        annotations: [],
        altIsPressed: false,
        buttonsVocabularies: [{
          title: '2',
          target: 'vocabTwo'
        }, {
          title: '3',
          target: 'vocabThree'
        }],
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
        vocabs: [],
        vocabsNull: [{
          id: 1, shortcutKey: {code: 65, value: 'a'}, title: 'movement direction'
        }, { id: 2, shortcutKey: {code: 66, value: 'b'}, title: 'facial orientation'
        }, { id: 3, shortcutKey: {code: undefined, value: undefined}, title: 'direction body/body parts'
        }, { id: 4, shortcutKey: {code: undefined, value: undefined}, title: 'weight engagement individual'
        }, { id: 5, shortcutKey: {code: undefined, value: undefined}, title: 'weight engagement with partner'
        }, { id: 6, shortcutKey: {code: undefined, value: undefined}, title: 'weight regulation with partner'
        }, { id: 7, shortcutKey: {code: undefined, value: undefined}, title: 'synchronisation in rythm'
        }, { id: 8, shortcutKey: {code: undefined, value: undefined}, title: 'synchonisation in phrase'
        }],
        vocabsOne: [{
          id: 1, shortcutKey: {code: undefined, value: undefined}, title: 'individual coloring'
        }, { id: 2, shortcutKey: {code: undefined, value: undefined}, title: 'approach'
        }, { id: 3, shortcutKey: {code: undefined, value: undefined}, title: 'technique'
        }, { id: 4, shortcutKey: {code: undefined, value: undefined}, title: 'physical/physicality'
        }],
        vocabsTwo: [{
          id: 1, shortcutKey: {code: undefined, value: undefined}, title: 'Agency'
        }, { id: 2, shortcutKey: {code: undefined, value: undefined}, title: 'Attention to detail'
        }, { id: 3, shortcutKey: {code: undefined, value: undefined}, title: 'Awareness of the space'
        }, { id: 4, shortcutKey: {code: undefined, value: undefined}, title: 'Sensibility'
        }, { id: 5, shortcutKey: {code: undefined, value: undefined}, title: 'Creativity'
        }, { id: 6, shortcutKey: {code: undefined, value: undefined}, title: 'Differentiation/unity'
        }, { id: 7, shortcutKey: {code: undefined, value: undefined}, title: 'Focus'
        }, { id: 8, shortcutKey: {code: undefined, value: undefined}, title: 'Consequent'
        }, { id: 9, shortcutKey: {code: undefined, value: undefined}, title: 'Control'
        }, { id: 10, shortcutKey: {code: undefined, value: undefined}, title: 'Authenticity in movement and presence'
        }, { id: 11, shortcutKey: {code: undefined, value: undefined}, title: 'Freedom/correctness balance'
        }, { id: 12, shortcutKey: {code: undefined, value: undefined}, title: 'Ability to connect and make contact'
        }],
        vocabsThree: [{
          id: 1, shortcutKey: {code: undefined, value: undefined}, title: 'Awareness of the space'
        }, { id: 2, shortcutKey: {code: undefined, value: undefined}, title: 'Ability to adapt'
        }, { id: 3, shortcutKey: {code: undefined, value: undefined}, title: 'Ability to communicate'
        }, { id: 4, shortcutKey: {code: undefined, value: undefined}, title: 'Ability to connect'
        }, { id: 5, shortcutKey: {code: undefined, value: undefined}, title: 'Ability to apply tools'
        }, { id: 6, shortcutKey: {code: undefined, value: undefined}, title: 'Ability to fully immerse'
        }, { id: 7, shortcutKey: {code: undefined, value: undefined}, title: 'Ability to systematically unravel complexity'
        }, { id: 8, shortcutKey: {code: undefined, value: undefined}, title: 'Agency'
        }, { id: 9, shortcutKey: {code: undefined, value: undefined}, title: 'Approach'
        }, { id: 10, shortcutKey: {code: undefined, value: undefined}, title: 'Sensibility'
        }, { id: 11, shortcutKey: {code: undefined, value: undefined}, title: 'Attention to detail'
        }, { id: 12, shortcutKey: {code: undefined, value: undefined}, title: 'Ability to communicate'
        }, { id: 13, shortcutKey: {code: undefined, value: undefined}, title: 'Aesthetic'
        }, { id: 14, shortcutKey: {code: undefined, value: undefined}, title: 'Confidence'
        }, { id: 15, shortcutKey: {code: undefined, value: undefined}, title: 'Consequent'
        }, { id: 16, shortcutKey: {code: undefined, value: undefined}, title: 'Control'
        }, { id: 17, shortcutKey: {code: undefined, value: undefined}, title: 'Creativity'
        }, { id: 18, shortcutKey: {code: undefined, value: undefined}, title: 'Curiosity'
        }, { id: 19, shortcutKey: {code: undefined, value: undefined}, title: 'Deepening'
        }, { id: 20, shortcutKey: {code: undefined, value: undefined}, title: 'Definition'
        }, { id: 21, shortcutKey: {code: undefined, value: undefined}, title: 'Devotion'
        }, { id: 22, shortcutKey: {code: undefined, value: undefined}, title: 'Determination'
        }, { id: 23, shortcutKey: {code: undefined, value: undefined}, title: 'Differentiation / unity'
        }, { id: 24, shortcutKey: {code: undefined, value: undefined}, title: 'Discipline'
        }, { id: 25, shortcutKey: {code: undefined, value: undefined}, title: 'Dignity'
        }, { id: 26, shortcutKey: {code: undefined, value: undefined}, title: 'Dynamics'
        }, { id: 27, shortcutKey: {code: undefined, value: undefined}, title: 'Eagerness'
        }, { id: 28, shortcutKey: {code: undefined, value: undefined}, title: 'Emotional awareness'
        }, { id: 29, shortcutKey: {code: undefined, value: undefined}, title: 'Expressivity'
        }, { id: 30, shortcutKey: {code: undefined, value: undefined}, title: 'Focus'
        }, { id: 31, shortcutKey: {code: undefined, value: undefined}, title: 'Freedom'
        }, { id: 32, shortcutKey: {code: undefined, value: undefined}, title: 'Genuine quality'
        }, { id: 33, shortcutKey: {code: undefined, value: undefined}, title: 'Grace'
        }, { id: 34, shortcutKey: {code: undefined, value: undefined}, title: 'Guts/courage/fearlessness'
        }, { id: 35, shortcutKey: {code: undefined, value: undefined}, title: 'Individual coloring'
        }, { id: 36, shortcutKey: {code: undefined, value: undefined}, title: 'Initiative'
        }, { id: 37, shortcutKey: {code: undefined, value: undefined}, title: 'Inner rest/quiet eye'
        }, { id: 38, shortcutKey: {code: undefined, value: undefined}, title: 'Inner mind/outer mind'
        }, { id: 39, shortcutKey: {code: undefined, value: undefined}, title: 'Innovation'
        }, { id: 40, shortcutKey: {code: undefined, value: undefined}, title: 'Intensity'
        }, { id: 41, shortcutKey: {code: undefined, value: undefined}, title: 'Investigative'
        }, { id: 42, shortcutKey: {code: undefined, value: undefined}, title: 'Kinesthetic awareness and imagination'
        }, { id: 43, shortcutKey: {code: undefined, value: undefined}, title: 'Lack of fear'
        }, { id: 44, shortcutKey: {code: undefined, value: undefined}, title: 'Meaningful'
        }, { id: 45, shortcutKey: {code: undefined, value: undefined}, title: 'Musicality'
        }, { id: 46, shortcutKey: {code: undefined, value: undefined}, title: 'Open mindedness'
        }, { id: 47, shortcutKey: {code: undefined, value: undefined}, title: 'Open awareness'
        }, { id: 48, shortcutKey: {code: undefined, value: undefined}, title: 'Physical appearance'
        }, { id: 49, shortcutKey: {code: undefined, value: undefined}, title: 'Physical control'
        }, { id: 50, shortcutKey: {code: undefined, value: undefined}, title: 'Physical drive'
        }, { id: 51, shortcutKey: {code: undefined, value: undefined}, title: 'Physicality'
        }, { id: 52, shortcutKey: {code: undefined, value: undefined}, title: 'Physical \'state\'/condition'
        }, { id: 53, shortcutKey: {code: undefined, value: undefined}, title: 'Posture'
        }, { id: 54, shortcutKey: {code: undefined, value: undefined}, title: 'Pride'
        }, { id: 55, shortcutKey: {code: undefined, value: undefined}, title: 'Readiness'
        }, { id: 56, shortcutKey: {code: undefined, value: undefined}, title: 'Refinement'
        }, { id: 57, shortcutKey: {code: undefined, value: undefined}, title: 'Reflection'
        }, { id: 58, shortcutKey: {code: undefined, value: undefined}, title: 'Respect'
        }, { id: 59, shortcutKey: {code: undefined, value: undefined}, title: 'Conscious risk taking'
        }],
        currentTag: undefined,
        highlightedTag: undefined,
        inputStyle: true,
        parent: 'live-annotate',
        prevKey: undefined,
        shortcutsActivated: false,
        staging: process.env.IS_STAGING,
        showTagBox: false
      }
    },
    mounted () {
      this.vocabs = this.vocabsNull
      window.addEventListener('keydown', this.setShortcut)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.setShortcut)
    },
    watch: {
      newVocabulary: function (val) {
        console.log(val)
        // console.log('watch newVocabulary: ' + val)
        this.$refs.vocabularyModal.show()
        // this.extendVocabulary(val)
      }
    },
    props: ['newVocabulary'],
    methods: {
      changeVocabularies (val) {
        this.vocabs = val
      },
      extendVocabulary (val) {
        let countId = this.vocabs.length + 1
        this.vocabs.push({ id: countId, shortcutKey: { code: undefined, value: undefined }, title: val })
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
        this.$refs.shortcutModal.show()
        this.currentTag = val
      },
      setShortcut (e) {
        if (e.key === 27) {
          this.setFocusOnInput()
        }
        if (this.$refs.shortcutModal.showModal) {
          // [a] - [z] only
          if (e.key >= 65 && e.key <= 90 && this.vocabs[this.currentTag - 1].shortcutKey.code !== e.key) {
            this.vocabs[this.currentTag - 1].shortcutKey.code = e.key
            this.vocabs[this.currentTag - 1].shortcutKey.value = e.key
            this.$refs.shortcutModal.close()
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
        var obj = this.vocabs.find(function (obj) { return obj.shortcutKey.code === e.key })
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
          this.altIsPressed = true
          window.addEventListener('keydown', this.applyQuickShortcut)
        }
        else {
          this.shortcutsActivated = false
          this.altIsPressed = false
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
        if (this.prevKey === 13 && e.key === 13 && !this.showTagBox) {
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
        else if (e.key === 13 && this.showTagBox) {
          this.currentVal.string = this.highlightedTag
          this.currentVal.time = this.currentSelector.value
          this.$emit('currentString', this.currentVal)
          this.showTagBox = false
          this.currentBody.value = undefined
        }
        // [escape]
        else if (e.key === 27) {
          this.showTagBox = false
          this.currentBody.value = undefined
          this.shortcutsActivated = false
          this.altIsPressed = false
          window.removeEventListener('keydown', this.applyQuickShortcut)
        }
        // [tab]
        else if (e.key === 9) {
        }
        // [alt]
        else if (e.key === 18) {
        }
        // [#] or [arrow down]
        else if (e.key === 220 || e.key === 40) {
          this.currentSelector.value = DateTime.local().toISO()
          this.showTagBox = true
          if (e.key === 220) this.currentBody.value = undefined
        }
        else {
          if (this.currentSelector.value === undefined) {
            this.currentSelector.value = DateTime.local().toISO()
          }
          this.prevKey = e.key
        }
        if (this.shortcutsActivated) {
          this.currentBody.value = ''
        }
      }
    }
  }
</script>
