<template lang="pug">

  // TOP CENTER
  //
  //
  .row.q-mt-md(v-shortkey="shortcuts.focusInput", @shortkey="setFocusOnInput()")

    // q-btn.fixed-bottom-left.q-ma-md(color="primary", outline) alt

    // BUTTON - SWITCH BETWEEN TEXT INPUT AND VOCABULARY

    .col-xs-2.offset-xs-1.col-md-1.offset-md-1.col-lg-1.offset-lg-2.text-right.q-pa-sm.q-pr-md
      q-btn.text-primary.bg-grey-10(v-if="!vocabularyVisible && staging", round, icon="local_offer",
        v-shortkey="shortcuts.showVocabulary", @shortkey.native="toggleVocabulary()", @click="toggleVocabulary()")

    .col-xs-8.col-md-8.col-lg-6.bg-grey-10.relative-position(:class="{ 'shadow-4': vocabularyVisible }")

      // TEXT INPUT

      q-input.q-pa-md(v-model="annotationText", ref="textInput", type="textarea", autofocus, dark,
        :class="[vocabularyVisible ? 'q-pl-xl text-primary' : 'text-white']")

      // CLOSE BUTTON

      .absolute-top.q-mt-sm(v-if="staging", style="width: 3rem;")
        q-btn.q-ml-sm.q-mt-xs.q-mr-none.text-primary(round, flat, icon="clear", size="sm",
          v-if="vocabularyVisible", v-shortkey="shortcuts.showVocabulary",
          @shortkey.native="toggleVocabulary()", @click="toggleVocabulary()")

      // VOCABULARY (staging)

      div(v-if="staging")
        vocabulary(
          ref="vocabulary",
          @select-entry="selectEntry",
          @focus="setFocusOnInput",
          :highlight="selectedEntry")

</template>

<script>
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'

  import Vocabulary from './Vocabulary'

  export default {
    components: {
      Vocabulary
    },
    props: {
      newVocabularyEntry: String,
      submitOnNumEnters: {
        type: Number,
        default: 2
      },
      selectorValue: String
    },
    data () {
      const defaultBodyText = {
        purpose: 'commenting',
        type: 'TextualBody'
      }
      const defaultBodyVocabulary = {
        source: {
          id: undefined
        },
        purpose: 'linking',
        type: 'VocabularyEntry'
      }
      const defaultSelector = {
        type: 'Fragment'
      }
      return {
        defaultBodyText,
        defaultBodyVocabulary,
        defaultSelector,

        annotationText: undefined,
        currentBody: ObjectUtil.merge({}, defaultBodyText),
        currentSelector: ObjectUtil.merge({}, defaultSelector),

        shortcuts: {
          focusInput: ['tab'],
          showVocabulary: ['alt']
        },
        enterDown: 0,
        selectedEntry: undefined,
        staging: process.env.IS_STAGING
      }
    },
    mounted () {
      window.addEventListener('keydown', this.onKeyDown)
      window.addEventListener('keyup', this.onKeyUp)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.onKeyDown)
      window.removeEventListener('keyup', this.onKeyUp)
    },
    computed: {
      vocabularyVisible () {
        return this.$refs.vocabulary && this.$refs.vocabulary.visible
      }
    },
    watch: {
      newVocabularyEntry: function (val) {
        this.$refs.vocabularyModal.show(val)
      },
      annotationText (text) {
        if (!text) this.currentSelector.value = undefined
        else if (!this.selectedEntry) {
          this.currentSelector.value = this.getSelectorValue()
        }
      },
      selectedEntry (entry) {
        if (entry) {
          this.currentSelector.value = this.getSelectorValue()
          this.annotationText = entry.value
        }
        else this.annotationText = undefined
      }
    },
    methods: {
      getSelectorValue () {
        return this.currentSelector.value || this.selectorValue || DateTime.local().toISO()
      },
      setFocusOnInput () {
        this.$refs.textInput.focus()
      },
      toggleVocabulary () {
        if (!this.$refs.vocabulary) return
        this.$refs.vocabulary.toggle()
        this.setFocusOnInput()
      },
      selectEntry (entry, andCreate = false) {
        this.selectedEntry = entry
        this.currentBody = ObjectUtil.merge({}, this.defaultBodyVocabulary, {
          source: { id: entry.id }
        })
        if (andCreate) {
          this.createAnnotation()
        }
        else {
          this.setFocusOnInput()
        }
      },
      addToVocabulary (annotation) {
        this.$refs.vocabulary.addEntry(annotation.body.value)
      },
      reset () {
        if (this.selectedEntry && this.$refs.vocabulary) this.toggleVocabulary()
        this.enterDown = 0
        this.selectedEntry = undefined
        this.annotationText = undefined
        this.currentBody = ObjectUtil.merge({}, this.defaultBodyText)
        this.currentSelector = ObjectUtil.merge({}, this.defaultSelector)
      },
      onKeyDown (event) {
        const key = event.key.toLowerCase().replace(/\s/g, '')
        if (key === 'enter') {
          if (this.enterDown === this.$props.submitOnNumEnters - 1) {
            event.preventDefault()
            this.createAnnotation()
          }
          else {
            this.enterDown += 1
          }
        }
        else if (key === 'escape') {
          console.debug('esc')
          this.reset()
        }
        else {
          this.enterDown = 0
          if (event.target.tagName.toLowerCase() !== 'textarea') this.setFocusOnInput() // only set focus if not already in a textfield
        }
      },
      createAnnotation () {
        const text = this.annotationText && this.annotationText.trim()
        if (text && text.length > 0) {
          const annotation = {
            body: ObjectUtil.merge({}, this.currentBody),
            target: {
              selector: ObjectUtil.merge({}, this.currentSelector)
            }
          }
          if (!this.selectedEntry && this.annotationText) annotation.body.value = this.annotationText.trim()
          this.reset()
          this.$emit('annotation', annotation)
        }
      }
    }
  }
</script>
