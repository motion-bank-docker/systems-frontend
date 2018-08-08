<template lang="pug">
  div(:class="[parent === 'post-annotate' ? 'moba-post-annotate' : '']", style="max-height: 50vh; overflow-y: scroll;")
    .bg-grey-10.q-pa-sm
      div (most used)
    .row.bg-grey-10.q-pa-sm.float-left(v-for="dummy in dummyVocabularies", style="width: 100%;")
      .col-2
        | {{ dummy.groupTitle }} | {{ str }}

      .col-10
        q-btn.q-mr-xs.q-mb-sm.full-width.text-left(
        @click="emitVocabulary(dummy)",
        :class="[parent === 'post-annotate' ? 'q-caption text-black' : 'text-white bg-grey-10']",
        v-for="entry in dummy.vocabularies", no-caps, flat, align="left"
        )
          span.text-grey-9 {{ getInitials(entry.longTitle) }}
          .q-ml-sm {{ entry.longTitle }}
</template>

<script>
  export default {
    props: ['parent', 'str'],
    watch: {
      str: function (val) {
        console.log(val)
      }
    },
    data () {
      return {
        dummyVocabularies: [{
          groupTitle: 'space',
          vocabularies: [{
            shortTitle: 'aaa',
            longTitle: 'movement direction'
          }, {
            shortTitle: 'bbb',
            longTitle: 'facial orientation'
          }, {
            shortTitle: 'bbb',
            longTitle: 'direction body/body parts'
          }]
        }, {
          groupTitle: 'weight',
          vocabularies: [{
            shortTitle: 'xxx',
            longTitle: 'weight engagement individual'
          }, {
            shortTitle: 'yyy',
            longTitle: 'weight engagement with partner'
          }, {
            shortTitle: 'yyy',
            longTitle: 'weight regulation with partner'
          }]
        }, {
          groupTitle: 'time',
          vocabularies: [{
            shortTitle: 'xxx',
            longTitle: 'synchronisation in rythm'
          }, {
            shortTitle: 'yyy',
            longTitle: 'synchonisation in phrase'
          }]
        }
        ]
      }
    },
    methods: {
      emitVocabulary (val) {
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
