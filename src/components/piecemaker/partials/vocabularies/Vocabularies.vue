<template lang="pug">
  div(:class="[parent === 'post-annotate' ? 'moba-post-annotate' : '']", style="max-height: 50vh; overflow-y: scroll;")
    .q-pa-sm
      // (TODO: most used)
      q-list.no-border.no-margin.no-padding
        q-item.cursor-pointer.no-padding(v-for="(tag, i) in filteredTags", :key="i", :class="[i == tagHighlight ? 'bg-grey-9' : '']")
          q-item-side.q-pa-sm
            span.text-grey-6 {{ getInitials(tag) }}
          q-item-main
            q-btn.full-width.text-white(@click="clickTag(tag)" , no-caps, flat, align="left") {{ tag }}
          q-item-side.q-pa-sm
            span.text-grey-6 alt + {{ getInitials(tag) }}
        q-item(v-if="filteredTags.length <= 0")
          q-item-main.text-italic.text-center
            | no matches

</template>

<script>
  export default {
    props: ['parent', 'pressedKey', 'str'],
    watch: {
      str: function (val) {
        // console.log('--------')
        this.tagHighlight = -1
        const filterItems = (val) => {
          return this.vocabs.filter((el) =>
            el.toLowerCase().indexOf(val.toLowerCase()) > -1
          )
        }
        // console.log(filterItems(val))
        // console.log(filterItems(val).length)
        this.filteredTags = filterItems(val).sort()
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
        filteredTags: [],
        results: [],
        tagHighlight: -1,
        vocabs: ['movement direction', 'facial orientation', 'direction body/body parts', 'weight engagement individual', 'weight engagement with partner', 'weight regulation with partner', 'synchronisation in rythm', 'synchonisation in phrase']
      }
    },
    methods: {
      clickTag (val) {
        console.log(val)
      },
      tagHightlighting (e) {
        // console.log(e.keyCode, this.vocabs.length)
        if (e.keyCode === 40 && this.tagHighlight < this.filteredTags.length - 1) {
          this.tagHighlight++
        }
        else if (e.keyCode === 38 && this.tagHighlight > 0) {
          this.tagHighlight--
        }
        console.log(this.filteredTags[this.tagHighlight])
      },
      emitVocabulary (val) { // unused
        this.$emit('clickedVocabulary', val)
      },
      getInitials (val) {
        return val.split(' ').map((n) => n[0]).join('').toUpperCase()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

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
