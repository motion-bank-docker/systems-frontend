<template lang="pug">
  q-collapsible.q-mt-md.absolute-top.moba-hover(style="width: 60%; left: 20%;", label="Vocabulary", opened)
    div(style="column-count: 3;")
      q-btn.q-mr-xs.q-mt-sm.text-black.full-width(v-for="dummy in dummyVocabularies", size="sm", no-caps, rounded, flat)
        // span.text-grey-6 [key]:&nbsp;
        | {{ dummy }}
        q-popover.bg-dark.q-pa-sm.cursor-pointer.q-caption(anchor="bottom middle", self="top middle", dark)
          div.q-pa-sm(v-for="n in 3") {{ dummy }}
</template>

<script>
  export default {
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
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .moba-hover
    border 1px solid rgba( 255, 255, 255, .1 )
    background-color rgba( 255, 255, 255, 0 )
    .q-btn
      background-color white
      opacity 0
      border 0px solid black
  .moba-hover:hover
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
