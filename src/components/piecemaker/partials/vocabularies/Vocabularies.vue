<template lang="pug">
  div(ref="tagList",  :class="[parent === 'post-annotate' ? 'moba-post-annotate' : '']", style="max-height: 66vh; overflow-y: scroll;")

    // LIST RESULTS
    //
    .q-pa-sm
      // (todo: most used?)
      q-list.no-border.no-margin.no-padding

        // (workaround -- q-items don't accept mouse events (quasar bug))
        div(v-for="(tag, i) in filteredTags", @mouseenter="hoverTag(i)")

          q-item.no-padding.moba-tag-hover(
          :key="i", :class="[i == tagHighlight ? 'bg-grey-9' : '']")

            // q-item-side.q-px-sm.q-caption(style="min-width: 5rem;")
              span.text-grey-6 {{ getInitials(tag.title) }}

            q-item-side.q-px-sm.q-py
              // div(v-if="!pressedAlt")
              div
                q-btn.text-primary(v-if="tag.shortcutKey.value != undefined",
                @click="emitId(tag.id), currentTag.title = tag.title, currentTag.shortcutKey = tag.shortcutKey.value, currentTag.targetId = tag.id",
                no-caps, round, size="sm") {{ tag.shortcutKey.value }}

                q-btn.text-grey-8.cursor-pointer.no-margin(v-else, round, size="sm",
                @click="emitId(tag.id), currentTag.title = tag.title, currentTag.shortcutKey = tag.shortcutKey.value, currentTag.targetId = tag.id")
                  q-icon(name="keyboard")
              // div(v-else)
                .text-primary {{ tag.shortcutKey.value }}

            q-item-main
              q-btn.full-width(@click="clickTag(tag), emitFocus()" , no-caps, flat, align="left", color="transparent")
                .text-white.text-weight-regular {{ tag.title }}

        q-item(v-if="filteredTags.length <= 0")
          q-item-main.text-italic.text-center
            | no matches

</template>

<script>
  export default {
    props: ['parent', 'pressedAlt', 'str', 'vocabulary'],
    watch: {
      str: function (val) {
        this.tagHighlight = -1
        const filterItems = (val) => {
          return this.vocabs.filter((el) =>
            el.title.toLowerCase().indexOf(val.toLowerCase()) > -1
          )
        }
        this.filteredTags = filterItems(val).sort()
      },
      vocabulary: function (val) {
        this.filteredTags = val
      }
    },
    mounted () {
      window.addEventListener('keydown', this.tagHightlighting)
      this.filteredTags = this.vocabs
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.tagHightlighting)
    },
    data () {
      return {
        currentTag: {
          shortcutKey: '',
          targetId: '',
          title: ''
        },
        filteredTags: [],
        results: [],
        tagHighlight: -1,
        vocabs: this.vocabulary
      }
    },
    methods: {
      setFocusOnTaglist () {
        this.$refs.tagList.focus()
      },
      emitFocus () {
        this.$emit('emitFocus')
      },
      emitId (val) {
        this.$emit('openShortcut', val)
      },
      hoverTag (val) {
        this.tagHighlight = val
        // this.$emit('highlightedTag', val)
      },
      clickTag (val) {
        // console.log(this.filteredTags, val.title)
        // console.log(this.filteredTags)
        // console.log(val.title)
        this.$emit('clickTag', val.title)
      },
      tagHightlighting (e) {
        if (e.keyCode === 40 && this.tagHighlight < this.filteredTags.length - 1) { // [down]
          this.tagHighlight++
          this.$emit('highlightedTag', this.filteredTags[this.tagHighlight].title)
        }
        else if (e.keyCode === 38 && this.tagHighlight > 0) { // [up]
          this.tagHighlight--
          this.$emit('highlightedTag', this.filteredTags[this.tagHighlight].title)
        }
        this.setFocusOnTaglist()
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
</style>
