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

    .q-pa-md(v-if="visible")
      q-btn.q-px-lg.q-mr-sm(v-for="vocabulary in vocabularies",
        @click="selectVocabulary(vocabulary)", size="sm") {{ vocabulary.title }}

    div(ref="tagList", v-if="visible", style="max-height: 66vh; overflow-y: scroll;")

      // LIST RESULTS
      //
      .q-pa-sm(v-if="selectedVocabulary")
        // (todo: most used?)
        q-list.no-border.no-margin.no-padding

          q-item.no-padding.moba-tag-hover(v-for="(entry, i) in selectedVocabulary.entries", :key="`entry-${entry.id}-${i}`",
            :class="{ 'bg-grey-9': highlight && entry.id === highlight.id }")

            // q-item-side.q-px-sm.q-caption(style="min-width: 5rem;")
              span.text-grey-6 {{ getInitials(tag.title) }}

            q-item-side.q-px-sm.q-py
              // div(v-if="!pressedAlt")
              div
                q-btn.text-primary(no-caps, round, size="sm") {{ getInitials(entry.value) }}

                q-btn.text-grey-8.cursor-pointer.no-margin(
                  icon="keyboard",
                  round, size="sm",
                  @click="enterSetShortcut(entry.id)") {{ getShortcutKey(entry) }}
              // div(v-else)
                .text-primary {{ tag.shortcutKey.value }}

            q-item-main
              q-btn.full-width(
                v-shortkey="entry.key",
                @shortkey.native="selectEntry(entry.id)",
                @dblclick.native="selectEntry(entry.id, true)",
                @click="selectEntry(entry.id)",
                no-caps, flat, align="left",
                color="transparent")
                  .text-white.text-weight-regular {{ entry.value }}

          q-item(v-if="!selectedVocabulary.length")
            q-item-main.text-italic.text-center no matches

</template>

<script>
  import ModalConfirm from '../../shared/partials/ModalConfirm'

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

        vocabularies: [],
        selectedVocabulary: undefined,

        shortcuts: {},
        keyBlacklist: ['enter', '#', 'arrowdown', 'tab', 'delete', 'alt'],
        isSetShortcut: false,
        newShortcut: [],
        newShortcutEntry: undefined
      }
    },
    async mounted () {
      window.addEventListener('keypress', this.onKeyPress)
      for (let key of Object.keys(this.shortcuts)) {
        if (Array.isArray(this.shortcuts[key])) {
          this.keyBlacklist = this.keyBlacklist.concat(this.shortcuts[key])
        }
      }
      this.vocabularies = await this.$vocabularies.find()
      if (this.vocabularies && this.vocabularies.length > 0) this.selectVocabulary(this.vocabularies[0])
    },
    beforeDestroy () {
      window.removeEventListener('keypress', this.onKeyPress)
    },
    methods: {
      toggle () {
        this.visible = !this.visible
      },
      selectVocabulary (vocabulary) {
        this.selectedVocabulary = vocabulary
      },
      async addEntry (value) {
        await this.selectedVocabulary.addEntry(value)
      },
      async selectEntry (id, createImmediatly = false) {
        const entry = await this.selectedVocabulary.get(id)
        this.$emit('select-entry', entry, createImmediatly)
      },
      async enterSetShortcut (val) {
        this.isSetShortcut = true
        this.$refs.shortcutModal.show()
        const result = await this.selectedVocabulary.find({ id: val })
        if (result.length) this.newShortcutEntry = result[0]
      },
      exitSetShortcut () {
        this.isSetShortcut = false
        this.newShortcutEntry = undefined
        this.newShortcut = []
      },
      async setShortcut () {
        // TODO: store it properly!
        console.debug('set shortcut', this.newShortcut, this.newShortcutEntry)
        await this.selectedVocabulary.setKey(this.newShortcutEntry.id, this.newShortcut)
        this.exitSetShortcut()
      },
      getInitials (val) {
        return val.split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
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
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .moba-tag-hover
    &:hover
      background-color: $grey-9
</style>
