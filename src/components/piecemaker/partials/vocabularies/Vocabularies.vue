<template lang="pug">
  div(:class="[parent === 'post-annotate' ? 'moba-post-annotate' : '']", style="max-height: 50vh; overflow-y: scroll;")
    .q-pa-sm
      // TODO: most used
      q-list.no-border.no-margin.no-padding
        q-item(v-for="(tag, i) in filteredTags", :key="i", :class="[i == tagHighlight ? 'bg-primary' : '']")
          q-item-side
            span.text-grey-6 {{ getInitials(tag) }}
          q-item-main
            q-btn.full-width.text-white(no-caps, flat, align="left") {{ tag }}
          q-item-side
            span.text-grey-6 alt + {{ getInitials(tag) }}
    //
      .row.bg-grey-10.q-pa-sm.float-left(v-for="dummy in dummyVocabularies", style="width: 100%;")
        .col-2
          | {{ dummy.groupTitle }}

        .col-10
          q-btn.q-mr-xs.q-mb-sm.full-width.text-left(
          @click="emitVocabulary(dummy)",
          // :class="[parent === 'post-annotate' ? 'q-caption text-black' : 'text-white bg-grey-10']",
          v-for="entry in dummy.vocabularies", no-caps, flat, align="left"
          )
            span.text-grey-9 {{ getInitials(entry.longTitle) }}
            .q-ml-sm {{ entry.longTitle }}
</template>

<script>
  export default {
    props: ['parent', 'pressedKey', 'str'],
    watch: {
      str: function (val) {
        // var newArray = []
        console.log('--------')
        const filterItems = (val) => {
          return this.vocabs.filter((el) =>
            // el.toLowerCase().indexOf(val.toLowerCase()) > -1
            // console.log(el.toLowerCase().indexOf(val.toLowerCase()) > -1)
            el.toLowerCase().indexOf(val.toLowerCase()) > -1
            // console.log(el.toLowerCase().indexOf(val.toLowerCase()) > -1, val, el, '-----', this.vocabs[this.vocabs.indexOf(el)])
            // newArray.push()
          )
        }
        // console.log(filterItems(val))
        console.log(filterItems(val))
        // this.keyMonitor()
        this.filteredTags = filterItems(val)
      }
    },
    mounted () {
      window.addEventListener('keydown', this.tagHightlighting)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.tagHightlighting)
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
        vocabs: ['test', 'hallo was geht', 'EINS', 'hundertzehn', 'zwanzigtausenzweihundert', 'zwei', 'was?'],
        filteredTags: [],
        tagHighlight: 0,
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
      tagHightlighting (e) {
        console.log(e.keyCode)
        if (e.keyCode === 40 && this.tagHighlight < this.vocabs.length - 1) this.tagHighlight++
        else if (e.keyCode === 38 && this.tagHighlight > 0) this.tagHighlight--
      },
      filterSearch (searchterm) { // UNUSED
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
