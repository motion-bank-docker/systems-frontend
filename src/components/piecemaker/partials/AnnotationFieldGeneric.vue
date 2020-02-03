<template lang="pug">

  .row.q-mt-sm.round-borders(v-shortkey="shortcuts.focusInput", @shortkey="focusInput()",
  :class="[hasTransparency && !isFocused && !isVisible ? 'bg-with-transparency' : 'bg-dark']")

    // button toggles vocabulary

    <!--q-btn.text-primary.q-mr-sm.q-mt-sm(v-if="!vocabularyVisible && staging", round, flat, icon="local_offer",-->
      <!--v-shortkey="shortcuts.showVocabulary", @shortkey.native="toggleVocabulary()", @click="toggleVocabulary()")-->

    // input area
    div.round-borders(:class="{ 'shadow-4': vocabularyVisible }", style="width: 40vw;")

      q-item.q-pa-none.q-pa-sm(multiline)
        q-item-side(style="min-width: auto;")
          q-btn.q-mt-xs(v-if="!vocabularyVisible && staging", round, flat,
          icon="local_offer", @click="toggleVocabulary()", size="sm",
          :class="[isVisible ? 'bg-primary text-white' : '']")

        q-item-main
          q-input(v-on:keydown="onKeyDown", @focus="onInputFocus", @blur="onInputBlur",
            v-model="annotationText", ref="textInput", type="textarea", dark
            :class="[vocabularyVisible ? 'q-pl-xl text-primary' : 'text-white']")

        q-item-side(v-if="isVisible && staging", style="min-width: auto;")
          q-btn(@click="clearInputField", icon="clear", size="sm", round, flat, :disabled="!annotationText")

      // CLOSE BUTTON (unused?)

      .absolute-top.q-mt-sm(v-if="staging", style="width: 3rem;")
        <!--q-btn.q-ml-sm.q-mt-xs.q-mr-none.text-primary(round, flat, icon="clear", size="sm",-->
          <!--v-if="vocabularyVisible", v-shortkey="shortcuts.showVocabulary",-->
          <!--@shortkey.native="toggleVocabulary()", @click="toggleVocabulary()")-->
        q-btn.q-ml-sm.q-mt-xs.q-mr-none.text-primary(
          round, flat, icon="clear", size="sm",
          v-if="vocabularyVisible", @click="toggleVocabulary()"
          )

      // vocabularies

      div
        object-list(
          ref="vocabulary",
          :media="media",
          @select-entry="selectEntry",
          @focus="focusInput",
          @clear-input-field="clearInputField",
          :highlight="selectedEntry")

</template>

<script>
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'

  import ObjectList from './ObjectList'

  export default {
    components: {
      ObjectList
    },
    props: {
      newVocabularyEntry: String,
      submitOnNumEnters: {
        type: Number,
        default: 2
      },
      selectorValue: Object,
      hasTransparency: Boolean,
      media: Object
    },
    data () {
      const defaultBodyText = {
        purpose: 'tagging',
        type: 'TextualBody'
      }
      const defaultBodyVocabulary = {
        source: {
          id: undefined
        },
        purpose: 'tagging'
      }
      return {
        defaultBodyText,
        defaultBodyVocabulary,

        annotationText: undefined,
        currentBody: ObjectUtil.merge({}, defaultBodyText),
        currentSelectorValue: undefined,

        shortcuts: {
          focusInput: ['tab'],
          showVocabulary: [],
          preventStartAnnotationOnKeys: ['alt', 'tab', 'control', 'meta', 'shift', 'backspace']
        },
        enterDown: 0,
        selectedEntry: undefined,
        staging: process.env.IS_STAGING,
        isFocused: false,
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
        else if (!this.selectedEntry) this.currentSelectorValue = this.getSelectorValue()
        if (this.$refs.vocabulary && this.$refs.vocabulary.visible) {
          this.$refs.vocabulary.updateFilter(text)
        }
      },
      selectedEntry (entry) {
        if (entry) {
          this.currentSelectorValue = this.getSelectorValue()
          this.annotationText = entry.label
        }
        else this.annotationText = undefined
      }
    },
    methods: {
      clearInputField () {
        // alert('bla')
        this.annotationText = undefined
      },
      getSelectorValue () {
        return this.currentSelectorValue || this.selectorValue || { key: 'datetime-t', value: DateTime.local().toISO() }
      },
      focusInput () {
        if (this.$refs.textInput) this.$refs.textInput.focus()
      },
      blurInput () {
        if (this.$refs.textInput) this.$refs.textInput.blur()
      },
      toggleVocabulary () {
        if (!this.$refs.vocabulary) return
        this.$refs.vocabulary.toggle()
        this.isVisible = this.$refs.vocabulary.visible
        this.focusInput()
      },
      selectEntry (entry, andCreate = false) {
        this.selectedEntry = entry
        this.currentBody = ObjectUtil.merge({}, this.defaultBodyVocabulary, {
          source: { id: entry.url, type: entry.type }
        })
        if (andCreate) {
          this.createAnnotation()
        }
        else {
          this.focusInput()
        }
      },
      addToVocabulary (annotation) {
        this.$refs.vocabulary.addEntry(annotation.body.value)
      },
      reset () {
        if (this.selectedEntry && this.$refs.vocabulary) {
          this.$refs.vocabulary.updateFilter()
          this.toggleVocabulary()
        }
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
            this.blurInput()
          }
          else {
            this.enterDown += 1
          }
        }
        else if (key === 'escape') {
          console.debug('onKeyDown: escape')
          this.blurInput()
          this.reset()
        }
        else if (key === 'backspace') {
          console.debug('onKeyDown: backspace', this.annotationText)
          if (this.annotationText !== undefined) {
            if (this.annotationText.length === 1) {
              this.blurInput()
              this.reset()
            }
          }
        }
        else if (this.annotationText === undefined && !this.shortcuts.preventStartAnnotationOnKeys.includes(key) && event.code !== 'Space') {
          this.enterDown = 0
          if (event.target.tagName.toLowerCase() !== 'textarea') {
            // only set focus if not already in a textfield
            this.focusInput()
          }
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
                  [this.currentSelectorValue.key]: this.currentSelectorValue.value
                }
              }
            }
          }
          if (!this.selectedEntry && this.annotationText) {
            annotation.body.value = this.annotationText.trim()
          }
          else if (this.selectedEntry && this.selectedEntry.value) {
            annotation.body.value = this.selectedEntry.value
          }
          this.reset()
          this.$emit('annotation', annotation)
          console.debug('AnnotationField: createAnnotation', annotation)
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
