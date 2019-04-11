<template lang="pug">

  .row.q-mt-sm.q-pl-sm.q-pr-md.round-borders(v-shortkey="shortcuts.focusInput", @shortkey="setFocusOnInput()",
  :class="[hasTransparency && !isFocused && !isVisible ? 'bg-with-transparency' : 'bg-dark']")

    // button toggles vocabulary

    q-btn.text-primary.q-mr-sm.q-mt-sm(v-if="!vocabularyVisible && staging", round, flat, icon="local_offer",
      v-shortkey="shortcuts.showVocabulary", @shortkey.native="toggleVocabulary()", @click="toggleVocabulary()")

    // input area

    div.round-borders(:class="{ 'shadow-4': vocabularyVisible }", style="width: 40vw;")

      q-input.q-pa-md(v-on:keydown="onKeyDown", @focus="onInputFocus", @blur="onInputBlur",
        v-model="annotationText", ref="textInput", type="textarea", autofocus, dark
        :class="[vocabularyVisible ? 'q-pl-xl text-primary' : 'text-white']"
        )

      // CLOSE BUTTON (unused?)

      .absolute-top.q-mt-sm(v-if="staging", style="width: 3rem;")
        q-btn.q-ml-sm.q-mt-xs.q-mr-none.text-primary(round, flat, icon="clear", size="sm",
          v-if="vocabularyVisible", v-shortkey="shortcuts.showVocabulary",
          @shortkey.native="toggleVocabulary()", @click="toggleVocabulary()")

      // vocabularies

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
      selectorValue: String,
      hasTransparency: Boolean
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
      return {
        defaultBodyText,
        defaultBodyVocabulary,

        annotationText: undefined,
        currentBody: ObjectUtil.merge({}, defaultBodyText),
        currentSelectorValue: undefined,

        shortcuts: {
          focusInput: ['tab'],
          showVocabulary: ['alt']
        },
        enterDown: 0,
        selectedEntry: undefined,
        staging: process.env.IS_STAGING,
        isFocused: Boolean,
        isVisible: false
      }
    },
    mounted () {
      window.addEventListener('keydown', this.onKeyDown)
      // window.addEventListener('keyup', this.onKeyUp)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.onKeyDown)
      // window.removeEventListener('keyup', this.onKeyUp)
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
        if (!text) this.currentSelectorValue = undefined
        else if (!this.selectedEntry) {
          this.currentSelectorValue = this.getSelectorValue()
        }
      },
      selectedEntry (entry) {
        if (entry) {
          this.currentSelectorValue = this.getSelectorValue()
          this.annotationText = entry.value
        }
        else this.annotationText = undefined
      }
    },
    methods: {
      getSelectorValue () {
        console.log('get selector', this.currentSelectorValue, this.selectorValue)
        return this.currentSelectorValue || this.selectorValue || DateTime.local().toISO()
      },
      setFocusOnInput () {
        if (this.$refs.textInput) this.$refs.textInput.focus()
      },
      toggleVocabulary () {
        if (!this.$refs.vocabulary) return
        this.$refs.vocabulary.toggle()
        this.isVisible = this.$refs.vocabulary.visible
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
        this.currentSelectorValue = undefined
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
      onInputFocus () {
        window.removeEventListener('keydown', this.onKeyDown)
        this.isFocused = true
      },
      onInputBlur () {
        window.addEventListener('keydown', this.onKeyDown)
        this.isFocused = false
      },
      createAnnotation () {
        const text = this.annotationText && this.annotationText.trim()
        if (text && text.length > 0) {
          const annotation = {
            body: ObjectUtil.merge({}, this.currentBody),
            target: {
              selector: {
                value: {
                  'date-time:t': this.currentSelectorValue
                }
              }
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

<style lang="stylus">
  @import '~variables'

  .bg-with-transparency
    background-color rgba(0, 0, 0, .25)

  .bg-with-transparency:hover
    background-color $dark
</style>
