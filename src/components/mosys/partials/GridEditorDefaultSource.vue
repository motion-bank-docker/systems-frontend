<template lang="pug">

  q-list.default-source-container

    q-list-header
      q-input(v-model="term", type="textarea", :min-rows="1", :max-height="200", :style="{'line-height': '1.5em'}")

    q-item-separator

    // loading, nothing here
    template(v-if="loading")
      q-item
        q-item-side
          q-spinner(style="margin-right: 1em")
        q-item-main Loading videos for »{{term}}«
      q-item-separator
    template(v-else-if="nothingFound")
      q-item No Videos Found!

    // videos, annotations
    template(v-if="results")
      template(v-for="(result, i) in results")
        template(v-if="i > 0")
          q-item-separator
        q-item(draggable="true", @dragstart="event => {handleItemDragStart(event, result)}")
          q-item-side
            q-icon(:name="typeToIconName(result.body.type)", style="font-size: 1.8rem")
          q-item-main
            a(@click.prevent="event => {handleItemClick(event, result)}") {{result.body.source.substring(0, 100)}}
              template(v-if="result.body.source.length > 100") ...

</template>

<script>
  import { QInput, QIcon, QBtn, QList, QListHeader, QItem, QItemSide, QItemMain, QItemSeparator, QScrollArea, QSpinner } from 'quasar-framework'
  import url from 'url'

  const hostToTypeMap = {
    'vimeo.com': 'Video',
    'www.vimeo.com': 'Video',
    'youtube.com': 'Video',
    'www.youtube.com': 'Video'
  }
  const typeToIconName = {
    'image': 'photo',
    'iframe': 'link',
    'video': 'local movies',
    'text': 'subject',
    'title': 'title'
  }

  export default {
    components: {
      QInput, QIcon, QBtn, QList, QListHeader, QItem, QItemSide, QItemMain, QItemSeparator, QScrollArea, QSpinner
    },
    data () {
      return {
        term: '',
        results: [],
        nothingFound: false,
        loading: false
      }
    },
    watch: {
      term () {
        this.term = this.term.trim()
        this.handleSearchTerm()
      }
    },
    methods: {
      typeToIconName (type) {
        let iconName = typeToIconName[type.toLowerCase()]
        if (!iconName) {
          iconName = 'broken image'
        }
        return iconName
      },
      handleItemClick (event, result) {},
      handleItemDragStart (event, result) {
        let resourceCell = {
          uuid: null,
          type: result.body.type,
          x: 1,
          y: 1,
          width: 1,
          height: 1,
          content: result.body.source
        }
        event.dataTransfer.setData('text/plain', JSON.stringify(resourceCell))
      },
      handleSearchTerm () {
        if (this.term.length > 0) {
          let res = {
            body: {
              source: this.term,
              purpose: 'linking',
              type: 'Undefined'
            }
          }
          let results = []
          if (/^[\s]*http[s]?:\/\/.+/.test(this.term)) {
            let sourceUrl = url.parse(this.term)
            // TODO: how to deal with redirects here? Short URLs? …
            let type = this.getTypeFromSourceURL(sourceUrl)
            if (!type) {
              type = 'IFrame'
            }
            res.body.type = type
            results.push(res)
          }
          else if (/[\n\r]/.test(this.term)) {
            res.body.type = 'text'
            results.push(res)
          }
          else {
            res.body.type = 'title'
            results.push(res)
            let body = Object.assign({}, res.body)
            body.type = 'text'
            results.push({body})
          }
          this.results = results
        }
        else {
          this.results = []
        }
      },
      getTypeFromSourceURL (sourceUrl) {
        let type = hostToTypeMap[sourceUrl.hostname]
        if (!type) {
          console.log('Unknown URL resource', sourceUrl.toString())
          return null
        }
        return type
      }
    }
  }
</script>

<style scoped lang="stylus">

  .q-list-header
    padding-left 0

    .q-input
      padding-left 1em
      padding-right 1em

    .q-input:before
    .q-input:after
      display none

  .q-input
    padding-left 0

</style>
