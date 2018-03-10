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
            a(@click.prevent="event => {handleItemClick(event, result)}")
              template(v-if="result.body.source") {{result.body.source.substring(0, 100)}}
                template(v-if="result.body.source.length > 100") ...
              template(v-else-if="result.body.value") {{result.body.value.substring(0, 100)}}
                template(v-if="result.body.value.length > 100") ...
              template(v-else) Hm, no title?

</template>

<script>
  import { QInput, QIcon, QBtn, QList, QListHeader, QItem, QItemSide, QItemMain, QItemSeparator, QScrollArea, QSpinner } from 'quasar-framework'
  import url from 'url'
  import superagent from 'superagent'
  import buildVars from '../../../lib/build-vars'

  const hostToTypeMap = {
    'vimeo.com': 'Video',
    'www.vimeo.com': 'Video',
    'youtube.com': 'Video',
    'www.youtube.com': 'Video'
  }
  const typeToIconName = {
    'image': 'photo',
    'iframe': 'picture in picture',
    'internal-link': 'link',
    'video': 'local movies',
    'text': 'subject',
    'title': 'title'
  }
  const mimeTypesToAnnotationTypeMap = {
    'image/jpeg': 'Image',
    'image/png': 'Image',
    'image/gif': 'Image',
    'image/svg+xml': 'Image',
    'image/tiff': 'Image',
    'image/webp': 'Image',
    'application/pdf': 'PDF-Document',
    'video/webm': 'Video',
    'video/3gpp': 'Video',
    'video/3gpp2': 'Video',
    'video/x-msvideo': 'Video',
    'video/mpeg': 'Video',
    'video/mp4': 'Video',
    'video/ogg': 'Video',
    'audio/x-wav': 'Audio',
    'audio/webm': 'Audio',
    'audio/3gpp': 'Audio',
    'audio/3gpp2': 'Audio',
    'audio/aac': 'Audio',
    'audio/midi': 'Audio',
    'audio/ogg': 'Audio',
    'text/csv': 'Unknown',
    'text/calendar': 'Unknown',
    'application/json': 'Unknown',
    'application/rtf': 'Unknown',
    'application/xml': 'Unknown',
    'text/plain': 'IFrame',
    'text/html': 'IFrame',
    'application/xhtml+xml': 'IFrame'
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
        const _this = this
        if (this.term.length > 0) {
          let res = {
            body: {
              source: this.term,
              purpose: 'linking',
              type: 'Undefined'
            }
          }
          let results = []
          // A URL
          if (/^[\s]*http[s]?:\/\/.+/.test(this.term)) {
            let sourceUrl = url.parse(this.term)
            let currentUrl = url.parse(window.location.href)
            let type = 'Unknown'
            if (sourceUrl.host === currentUrl.host) {
              type = 'Internal-Link'
              let internalPath = sourceUrl.path
              if (internalPath) {
                // TODO: fix internal links to only point to public displays?
              }
              res.body.source = internalPath
            }
            else {
              // TODO: how to deal with redirects here? Short URLs? …
              type = this.getTypeFromSourceURL(sourceUrl)
            }
            if (!type) {
              type = 'IFrame'

              superagent.get(`${buildVars().apiHost}/proxy?url=${encodeURIComponent(this.term)}`)
                .then(resp => {
                  if (resp.status === 301) { // prem redirect
                    if (resp.headers['location']) _this.term = resp.headers['location']
                  }
                  else {
                    res.body.type = _this.mimeTypeToType(resp.headers['content-type']) // TODO: global mime-type to annotation type lookup
                    results.push(res)
                    this.results = results
                  }
                })
                .catch(errResp => {
                  results.push(res)
                })
            }
            else {
              res.body.type = type
              results.push(res)
            }
          }
          // TAGGING
          else if (/^[\s]*#.+/.test(this.term)) {
            const tag = this.term.replace(/^[\s]*#/, '').toLowerCase()
            _this.$store.dispatch('annotations/find', {query: {'body.purpose': 'tagging'}})
              .then(tagAnnotations => {
                console.log(tagAnnotations)
                let targetsMatched = {}
                tagAnnotations.filter(ta => {
                  return ta.body.value.toLowerCase().indexOf(tag) >= 0
                }).map(ta => {
                  if (!targetsMatched[ta.target.id]) {
                    targetsMatched[ta.target.id] = ta
                    ta.body.type = ta.target.type || ta.body.type
                    results.push(ta)
                  }
                })
                _this.results = results
              })
          }
          // MULTI LINE
          else if (/[\n\r]/.test(this.term)) {
            res.body.type = 'text'
            results.push(res)
          }
          // ASSUME ITs A TITLE
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

        }
        if (!type) {
          console.log('Unknown URL resource', sourceUrl.toString())
          return null
        }
        return type
      },
      mimeTypeToType (mimeType) {
        let type = mimeTypesToAnnotationTypeMap[mimeType]
        if (!type) {
          type = 'IFrame'
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
