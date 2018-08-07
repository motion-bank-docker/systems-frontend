<template lang="pug">
  // q-collapsible.q-mt-md.absolute-top.moba-hover(style="width: 60%; left: 20%;", label="Vocabulary", opened)
  div(:class="[parent === 'post-annotate' ? 'moba-post' : '']", style="column-count: 3;")
    q-btn.q-mr-xs.q-mt-sm.full-width(
    @click="emitVocabulary('hallo 123456')",
    :class="[parent === 'post-annotate' ? 'q-caption text-black' : 'text-white bg-grey-10']",
    v-for="dummy in dummyVocabularies", no-caps, rounded, flat
    )
      // span.text-grey-6 [key]:&nbsp;
      | {{ dummy }}
      q-popover.bg-dark.q-pa-sm.cursor-pointer.q-caption(
      :class="[parent === 'post-annotate' ? 'q-caption' : '']",
      anchor="bottom middle", self="top middle", dark
      )
        div.q-pa-sm(v-for="n in 3") {{ dummy }}
</template>

<script>
  export default {
    props: ['parent'],
    data () {
      return {
        dummyVocabularies: [
          'movement direction', 'facial orientation', 'body/body part direction',
          'weight engage. individual', 'weight engag. partner', 'weight regul. partner',
          'sync rythm', 'sync phrase',
          'still', 'mirroring', 'contingently responsive',
          'movement direction', 'facial orientation', 'body/body part direction',
          'weight engage. individual', 'weight engag. partner', 'weight regul. partner',
          'sync rythm', 'sync phrase',
          'still', 'mirroring', 'contingently responsive',
          'movement direction', 'facial orientation', 'body/body part direction',
          'weight engage. individual', 'weight engag. partner', 'weight regul. partner',
          'sync rythm', 'sync phrase',
          'still', 'mirroring', 'contingently responsive'
        ]
      }
    },
    methods: {
      emitVocabulary (val) {
        // console.log(val, '--------')
        // this.$emit('handlerClickVocabulary', val)
        this.$q.notify({
          message: val,
          position: 'bottom-right',
          color: 'white',
          textColor: 'black'
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .moba-post
    border 1px solid rgba( 255, 255, 255, .1 )
    background-color rgba( 255, 255, 255, 0 )
    .q-btn
      background-color white
      opacity 0
      border 0px solid black
  .moba-post:hover
    // border 1px solid rgba( 255, 255, 255, .1 )
    background-color rgba( 255, 255, 255, 0 )
    .q-btn
      opacity .5
      background-color white
      border 0px solid transparent!important
    .q-btn:hover
      opacity 1
      background-color white!important
      border 0px solid transparent!important
</style>
