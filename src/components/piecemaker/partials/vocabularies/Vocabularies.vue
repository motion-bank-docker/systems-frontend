<template lang="pug">
  div(:class="[parent === 'post-annotate' ? 'moba-post-annotate' : '']", style="max-height: 50vh; overflow-y: scroll;")

    // SHORTCUT MODAL
    //
    q-modal(v-model="activeShortcutFeature", minimized)
      .bg-dark
        .text-white.q-pa-lg.text-center {{ currentTag.title }}
        .text-white.q-pa-lg.text-center
          | Setting new shortcut,
          br
          | press a new key now
          br
          | or escape to abort
          br
          | Current shortcut is&nbsp;
          span.text-grey-8 {{ currentTag.shortcutKey }}
          div (target-ID: {{ currentTag.targetId }})

    // LIST RESULTS
    //
    .q-pa-sm
      // (TODO: most used?)
      q-list.no-border.no-margin.no-padding

        // WORKARAOUND, because q-items don't accept mouse events (quasar bug)
        div(v-for="(tag, i) in filteredTags", @mouseenter="hoverTag(i)")

          q-item.no-padding.moba-tag-hover(
          :key="i", :class="[i == tagHighlight ? 'bg-grey-9' : '']")

            q-item-side.q-px-sm(style="min-width: 5rem;")
              span.text-grey-6 {{ getInitials(tag.title) }}

            q-item-main
              q-btn.full-width.text-white(@click="clickTag(tag)" , no-caps, flat, align="left") {{ tag.title }}

            q-item-side.q-px-sm.q-py-xs
              q-btn.text-primary(v-if="tag.shortcutKey.value != undefined",
              @click="activeShortcutFeature = true, currentTag.title = tag.title, currentTag.shortcutKey = tag.shortcutKey.value, currentTag.targetId = tag.id",
              no-caps, round) {{ tag.shortcutKey.value }}

              q-btn.text-grey-8.cursor-pointer.no-margin(v-else, round, flat,
              @click="activeShortcutFeature = true, currentTag.title = tag.title, currentTag.shortcutKey = tag.shortcutKey.value, currentTag.targetId = tag.id")
                q-icon(name="keyboard")

        q-item(v-if="filteredTags.length <= 0")
          q-item-main.text-italic.text-center
            | no matches

</template>

<script>
  export default {
    props: ['parent', 'pressedKey', 'str'],
    watch: {
      str: function (val) {
        this.tagHighlight = -1
        const filterItems = (val) => {
          return this.vocabs.filter((el) =>
            el.title.toLowerCase().indexOf(val.toLowerCase()) > -1
          )
        }
        // console.log(val)
        this.filteredTags = filterItems(val).sort()
      }
    },
    mounted () {
      window.addEventListener('keydown', this.tagHightlighting)
      window.addEventListener('keydown', this.setShortcut)
      this.filteredTags = this.vocabs
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.tagHightlighting)
      window.removeEventListener('keydown', this.setShortcut)
    },
    data () {
      return {
        currentTag: {
          shortcutKey: '',
          targetId: '',
          title: ''
        },
        filteredTags: [],
        activeShortcutFeature: false,
        results: [],
        tagHighlight: -1,
        // vocabs: ['movement direction', 'facial orientation', 'direction body/body parts', 'weight engagement individual', 'weight engagement with partner', 'weight regulation with partner', 'synchronisation in rythm', 'synchonisation in phrase']
        vocabs: [{
          id: 1,
          shortcutKey: {
            code: undefined,
            value: undefined
          },
          title: 'movement direction'
        }, {
          id: 2,
          shortcutKey: {
            code: undefined,
            value: undefined
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
        }]
      }
    },
    methods: {
      setShortcut (e) {
        console.log('--------', e.keyCode)
        if (this.activeShortcutFeature) {
          if (e.keyCode !== 8) {
            // console.log(this.currentTag.targetId)
            // console.log(this.vocabs[this.currentTag.targetId].shortcutKey)
            this.vocabs[this.currentTag.targetId - 1].shortcutKey.code = e.keyCode
            this.vocabs[this.currentTag.targetId - 1].shortcutKey.value = e.key
          }
          else if (e.keyCode === 8) { // backspace
            this.vocabs[this.currentTag.targetId - 1].shortcutKey.code = ''
            this.vocabs[this.currentTag.targetId - 1].shortcutKey.value = ''
          }
          this.activeShortcutFeature = false
        }
      },
      hoverTag (val) {
        // console.log(val)
        this.tagHighlight = val
        // this.$emit('selectedVocab', val)
      },
      clickTag (val) {
        // console.log(val)
        this.$emit('selectedVocab', val)
      },
      tagHightlighting (e) {
        if (e.keyCode === 40 && this.tagHighlight < this.filteredTags.length - 1) {
          this.tagHighlight++
          this.$emit('selectedVocab', this.filteredTags[this.tagHighlight].title)
        }
        else if (e.keyCode === 38 && this.tagHighlight > 0) {
          this.tagHighlight--
          this.$emit('selectedVocab', this.filteredTags[this.tagHighlight].title)
        }
        // console.log(this.filteredTags[this.tagHighlight])
      },
      getInitials (val) {
        return val.split(' ').map((n) => n[0]).join('').toUpperCase()
        // console.log(val)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  /* .moba-tag-hover:hover
    background-color $primary */

  /* .moba-post-annotate
    background-color rgba( 255, 255, 255, 0 )
    .q-btn
      color white!important
      border 1px solid rgba(255, 255, 255, .2)
  .moba-post-annotate:hover
    background-color rgba( 0, 0, 0, .3 )
    .q-btn
      color white!important
      border 1px solid rgba(255, 255, 255, .2)!important
    .q-btn:hover
      opacity 1
      background-color white!important
      color black!important
      border 0px solid transparent!important */
</style>
