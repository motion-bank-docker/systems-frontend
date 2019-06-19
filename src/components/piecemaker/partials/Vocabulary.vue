<template lang="pug">
  div
    // SET SHORTCUT

    modal-confirm(ref="shortcutModal", close-icon="clear", @confirm="setShortcut", @cancel="exitSetShortcut")
      template(slot="content", v-if="newShortcutEntry")
        p Press one or more keys to set the shortcut for "{{ newShortcutEntry.value }}".
        p Current key(s):
        p.text-primary(v-if="newShortcut.length") {{ newShortcut.join(' + ') }}
        p.text-primary(v-else) none selected
        p Save configuration?

    // SET NEW VOCABULARY

    modal-confirm(v-if="selectedVocabulary", ref="vocabularyModal", close-icon="clear",
    @confirm="selectedVocabulary.addTerm(newVocabularyEntry)")
      template(slot="content")
        .text-center
          div Do you want to include
          div.text-primary {{ newVocabularyEntry }}
          div into your vocabularies?

    // ----------------------------------------------------------------------------------------------- select vocabulary

    q-list.q-py-none.ui-border-top(v-if="visible && !loading",
    :class="{'q-pb-sm': checkedVocabularies.length > 0 && vocabulariesVisibility, 'ui-border-bottom': checkedVocabularies.length > 0}")

      // add-button
      q-item.q-pr-sm.q-py-xs.moba-tag-hover-dark

        q-item-main
          q-icon.q-mr-md(name="add", size="sm", round, flat)
          | Select vocabulary
          q-popover
            q-list
              q-item.q-py-sm.q-px-xs.moba-tag-hover-dark(v-for="vocabulary in vocabularyLabels")
                q-checkbox.full-width(v-model="checkedVocabularies", :val="vocabulary", :label="vocabulary.label",
                :key="vocabulary.id", checked-icon="check", unchecked-icon="xxxxxx",
                @input="handlerActivity(vocabulary)")

        q-item-side.text-right
          q-btn(@click="handlerVocabulariesVisibility()", :class="{'rotate-180': vocabulariesVisibility}",
          icon="keyboard_arrow_down", size="sm", flat, round)

      // selected vocabularies
      template(v-if="vocabulariesVisibility")
        template(v-if="checkedVocabularies.length > 0")

          q-item.q-pl-md.q-pr-sm.q-py-none.moba-tag-hover-dark.cursor-pointer(v-for="vocabulary in checkedVocabularies",
          tag="label")

            q-item-side(style="min-width: auto;")
              q-checkbox(v-model="activeVocabulariesModel", :val="vocabulary", :key="vocabulary.id",
              size="sm", round, flat, checked-icon="remove_red_eye", unchecked-icon="none")

            q-item-main.text-grey-7
              q-item-tile.ellipsis(label) {{ vocabulary.label }}

            q-item-side.text-right.buttons
              q-btn(@click="handlerRemoveVocabulary(vocabulary)", icon="clear", size="sm", round, flat)

    // --------------------------------------------------------------------------------------- no selection notification

    .ui-border-top.text-grey-7.text-italic.q-px-md.q-py-sm(v-if="visible && !loading && checkedVocabularies <= 0")
      | No vocabulary selected yet.

    // ------------------------------------------------------------------------------------------------- vocabulary list

    div(ref="tagList", v-if="visible", style="max-height: 50vh; overflow-y: scroll;")

      .q-my-md.q-px-sm(v-if="loading")
        q-spinner.q-mr-md.q-ml-xs(:size="25")
        span Loading vocabularies...

      // results
      q-list.q-py-sm(v-for="(aV, i) in activeVocabularies",
      :class="{'ui-border-bottom': i < activeVocabularies.length - 1}")

        // vocabulary label
        q-item.q-py-xs(:class="{'q-mb-xs': filteredItems(aV.items).length > 0}")
          q-item-main.text-grey-7 {{ aV.label }}

        // vocabulary items
        q-item.moba-tag-hover.cursor-pointer.q-pa-none(v-for="item in filteredItems(aV.items)")
          q-item-main
            div.q-px-md.q-py-xs(@click="selectEntry(item)") {{ item.value }}
            //
              q-btn.full-width(
              v-shortkey="entry.key",
              @shortkey.native="selectEntry(entry)",
              @dblclick.native="selectEntry(entry, true)",
              @click="selectEntry(entry)",
              no-caps, flat, align="left",
              color="transparent")
                .text-white.text-weight-regular {{ entry.value }}
          // q-item-side

      // LIST RESULTS - OLD
      //
        div(v-if="selectedVocabulary")
          // (todo: most used?)
          q-list.no-border.no-margin.q-px-none.q-pt-none.q-pb-sm

            // q-item.no-padding.moba-tag-hover(v-for="(entry, i) in entries", :key="`entry-${entry.id}-${i}`",
            // :class="{ 'bg-grey-9': highlight && entry.id === highlight.id }")
            //q-item.no-padding.moba-tag-hover(v-for="(entry, i) in loadedVocabularies", :key="`entry-${entry.id}-${i}`",
            //:class="{ 'bg-grey-9': highlight && entry.id === highlight.id }")
            q-item.no-padding.moba-tag-hover(v-if="entriesNew", v-for="(entry, i) in entriesNew", :key="`entry-${entry.id}-${i}`",
            // :class="{ 'bg-grey-9': highlight && entry.id === highlight.id }")

              // q-item-side.q-px-sm.q-caption(style="min-width: 5rem;")
                span.text-grey-6 {{ getInitials(tag.title) }}

              // q-item-side.q-px-sm.q-py
                // div(v-if="!pressedAlt")
              //   div
              //     q-btn.text-primary(no-caps, round, size="sm") {{ getInitials(entry.value) }}

              //     q-btn.text-grey-8.cursor-pointer.no-margin(
              //       icon="keyboard",
              //       round, size="sm",
              //       @click="enterSetShortcut(entry.id)") {{ getShortcutKey(entry) }}
                // div(v-else)
              //     .text-primary {{ tag.shortcutKey.value }}

              q-item-main
                q-btn.full-width(
                  v-shortkey="entry.key",
                  @shortkey.native="selectEntry(entry)",
                  @dblclick.native="selectEntry(entry, true)",
                  @click="selectEntry(entry)",
                  no-caps, flat, align="left",
                  color="transparent")
                    .text-white.text-weight-regular {{ entry.value }}
              // q-item-side
                q-btn(icon="clear", size="sm", round, flat)
            div(v-else) empty

            q-item(v-if="!selectedVocabulary.length")
              q-item-main.text-italic.text-center no matches

</template>

<script>
  import { mapGetters } from 'vuex'
  import { userHasFeature } from 'mbjs-quasar/src/lib'
  import ModalConfirm from '../../shared/dialogs/ModalConfirm'

  export default {
    components: {
      ModalConfirm
    },
    props: {
      highlight: Object
    },
    data () {
      return {
        visible: false,
        loading: false,

        vocabularies: [],
        selectedVocabularyId: undefined,
        selectedVocabularyLabel: 'select a vocabulary',
        selectedVocabulary: undefined,
        filterValue: undefined,

        checkedVocabularies: [],
        activeVocabulariesModel: [], // checkbox model to be watched
        activeVocabularies: [], // vocabulary list to be rendered

        vocabulariesVisibility: true, // show/hide checked vocabularies list

        shortcuts: {},
        keyBlacklist: ['enter', '#', 'arrowdown', 'tab', 'delete', 'alt'],
        isSetShortcut: false,
        newShortcut: [],
        newShortcutEntry: undefined
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        vocabularyLabels: 'vocabularies/getLabels'
      })
      /*
      entries () {
        if (this.selectedVocabulary && this.filterValue) {
          return this.selectedVocabulary
            .filter(entry => entry.value.toLocaleLowerCase().indexOf(this.filterValue) > -1)
        }
        return this.selectedVocabulary
      }
      */
      /*
      entriesNew () {
        if (this.loadedVocabularies && this.filterValue) {
          return this.loadedVocabularies
            .filter(entry => entry.value.toLocaleLowerCase().indexOf(this.filterValue) > -1)
        }
        return this.loadedVocabularies
      }
      */
    },
    watch: {
      /*
      checkedVocabularies () {
        this.selectVoc(this.checkedVocabularies)
      },
      */
      activeVocabulariesModel () {
        this.setVocabularyVisibility(this.activeVocabulariesModel)
      }
    },
    async mounted () {
      window.addEventListener('keypress', this.onKeyPress)

      this.loading = true

      if (userHasFeature(this.user, 'pba')) await this.$store.dispatch('vocabularies/loadPBATitles')
      if (this.vocabularyLabels.length) this.selectVocabulary(this.vocabularyLabels[0])

      for (let key of Object.keys(this.shortcuts)) {
        if (Array.isArray(this.shortcuts[key])) {
          this.keyBlacklist = this.keyBlacklist.concat(this.shortcuts[key])
        }
      }

      this.loading = false
    },
    beforeDestroy () {
      window.removeEventListener('keypress', this.onKeyPress)
    },
    methods: {
      handlerActivity (vocab) {
        if (!this.activeVocabulariesModel.includes(vocab)) {
          this.activeVocabulariesModel.push(vocab)
          this.checkedVocabularies.sort((a, b) => (a.label - b.label) ? 1 : -1)
        }
        else this.handlerRemoveVocabulary(vocab)
      },
      handlerVocabulariesVisibility () {
        this.vocabulariesVisibility = !this.vocabulariesVisibility
      },
      filteredItems (el) {
        if (el && this.filterValue) {
          return el
            .filter(entry => entry.value.toLocaleLowerCase().indexOf(this.filterValue) > -1)
        }
        return el
      },
      handlerRemoveVocabulary (vocab) {
        this.checkedVocabularies = this.checkedVocabularies.filter(item => item !== vocab)

        let _activeVocabulariesModel = this.activeVocabulariesModel
        let _activeVocabularies = this.activeVocabularies

        let index = _activeVocabulariesModel.indexOf(vocab)
        if (index > -1) _activeVocabulariesModel.splice(index, 1)

        let indexActive = _activeVocabularies.indexOf(vocab)
        if (indexActive > -1) _activeVocabularies.splice(indexActive, 1)
      },
      toggle () {
        this.visible = !this.visible
      },
      async selectVocabulary (v) {
        this.selectedVocabularyLabel = v.label
        this.selectedVocabularyId = v.id
        this.selectedVocabulary = await this.$store.dispatch('vocabularies/get', v.id)
      },
      /*
      async selectVoc (vocabs) {
        this.loadedVocabularies = []
        // this.activeVocabularies = []
        for (let i = 0; i < vocabs.length; i++) {
          let vocab = await this.$store.dispatch('vocabularies/get', vocabs[i].id)
          // this.activeVocabularies.push({label: vocabs[i].label, items: vocab})
          for (let k = 0; k < vocab.length; k++) {
            this.loadedVocabularies.push(vocab[k])
          }
        }
        // console.log(this.activeVocabularies)
      },
      */
      async setVocabularyVisibility (vocabs) {
        this.activeVocabularies = []
        for (let i = 0; i < vocabs.length; i++) {
          let vocab = await this.$store.dispatch('vocabularies/get', vocabs[i].id)
          /*
          console.log(this.checkedVocabularies)
          console.log(vocabs[i])
          console.log(this.checkedVocabularies.includes(vocabs[i]))
          console.log('----------')
          */
          if (this.checkedVocabularies.includes(vocabs[i])) {
            this.activeVocabularies.push({label: vocabs[i].label, items: vocab})
          }
          else {
            this.handlerRemoveVocabulary(vocabs[i])
          }
        }
        this.activeVocabularies.sort((a, b) => (a.label > b.label) ? 1 : -1)
      },
      async addEntry () {
        if (this.selectedVocabulary) {
          // await this.selectedVocabulary.addTerm(value)
        }
      },
      async selectEntry (entry, createImmediatly = false) {
        this.$emit('select-entry', entry, createImmediatly)
      },
      async enterSetShortcut () {
        // this.isSetShortcut = true
        // this.$refs.shortcutModal.show()
        // const result = await this.selectedVocabulary.find({ id: val })
        // if (result.length) this.newShortcutEntry = result[0]
      },
      exitSetShortcut () {
        this.isSetShortcut = false
        this.newShortcutEntry = undefined
        this.newShortcut = []
      },
      async setShortcut () {
        // TODO: store it properly!
        // console.debug('set shortcut', this.newShortcut, this.newShortcutEntry)
        // await this.selectedVocabulary.setKey(this.newShortcutEntry.id, this.newShortcut)
        // this.exitSetShortcut()
      },
      getInitials (val) {
        return val.split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      },
      shortenLabel (value, length = 10) {
        if (value && value.length > length) return value.substr(0, length) + '…'
        return value
      },
      getShortcutKey (val) {
        if (val.shortcut) {
          return val.shortcut.join('')
        }
        return ''
      },
      onKeyPress (event) {
        const key = event.key.toLowerCase().replace(/\s/g, '')
        if (this.isSetShortcut) {
          // FIXME: delete does not get captured
          if (key === 'delete' && this.newShortcut.length) this.newShortcut.pop()
          else if (this.keyBlacklist.indexOf(key) === -1) this.newShortcut.push(key)
        }
        else if (key === 'arrowdown') {
          console.debug('arrowdown')
          // TODO: cycle through selected vocabulary values
        }
        else if (key === '#') {
          // TODO: filter terms
        }
      },
      updateFilter (value) {
        if (value && !value.length) {
          this.filterValue = undefined
        }
        else this.filterValue = value ? value.trim().toLocaleLowerCase() : undefined
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .q-item
    min-height auto

  .moba-tag-hover
    &:hover
      background-color: $grey-9

  .moba-tag-hover-dark
    &:hover
      background-color: $grey-10

  .q-item
    .buttons
      opacity 0
    &:hover
      .buttons
        opacity 1
</style>
