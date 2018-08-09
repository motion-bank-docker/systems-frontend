<template lang="pug">
  div(:class="[parent === 'post-annotate' ? 'moba-post-annotate' : '']", style="max-height: 50vh; overflow-y: scroll;")
    .bg-grey-10.q-pa-sm
      div (most used)
    .row.bg-grey-10.q-pa-sm.float-left(v-for="dummy in dummyVocabularies", style="width: 100%;")
      .col-2
        | {{ dummy.groupTitle }}

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
        // this.filterSearch(val)
        // console.log(this.vocabs)
        console.log('--------')
        const filterItems = (val) => {
          return this.vocabs.filter((el) =>
            // el.toLowerCase().indexOf(val.toLowerCase()) > -1
            console.log(el.toLowerCase().indexOf(val.toLowerCase()) > -1)
          )
        }
        // console.log(filterItems(val))
        filterItems(val)
      }
    },
    data () {
      return {
        /* vocabs: [{
          title: 'test'
        }, {
          title: 'hallo'
        }, {
          title: 'eins'
        }, {
          title: 'hundertzehn'
        }, {
          title: 'zwanzigtausenzweihundert'
        }, {
          title: 'zwei'
        }], */
        vocabs: ['test', 'hallo', 'EINS', 'hundertzehn', 'zwanzigtausenzweihundert', 'zwei'],
        // vocabs: ['test', 'hallo', 'eins', 'zwei'],
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
        ],
        results: []
      }
    },
    methods: {
      filterSearch (searchterm) {
        let arr = this.vocabs
        // console.log('hallo', searchterm)
        const result = arr.filter(arrNew => arrNew.title.length > 6)
        console.log(result)
        return arr.filter(function (obj) {
          // console.log(obj)
          return Object.keys(obj).some(function (key) {
            // console.log(obj[key])
            // console.log(obj[key].includes(searchterm))
            if (obj[key].includes(searchterm)) console.log('drin')
            else console.log('nicht drin')
            // return obj[key].includes(searchterm)
          })
          /* return Object.keys(obj).some(function(key) {
            return obj[key].includes(searchterm)
          }) */
        })
      },
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
