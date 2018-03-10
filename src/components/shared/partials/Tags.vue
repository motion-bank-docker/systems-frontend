<template lang="pug">

  q-chips-input(
    v-if="targetUuid",
    v-model="tags", float-label="Add tags",
    class="text-white", color="primary",
    :dark="true", @change="inputChanged")

</template>

<script>
  import { QChipsInput } from 'quasar-framework'
  // import Promise from 'bluebird'
  import constants from '../../../lib/constants'

  export default {
    components: {
      QChipsInput
    },
    props: ['targetUuid', 'targetType'],
    data () {
      return {
        tags: [],
        annotations: [{
          body: {
            value: 'Joe'
          }
        }]
      }
    },
    mounted () {
      this.loadTags()
    },
    watch: {
      targetUuid () {
        this.loadTags()
      }
    },
    methods: {
      inputChanged (newTags) {
        this.updateTags()
      },
      enforceUniqueTags (tags) {
        let uniqueTags = tags
        if (tags.length > 1) {
          let tagMap = {}
          tags.forEach(t => {
            tagMap[t] = 1
          })
          uniqueTags = Object.keys(tagMap)
        }
        // console.log('removed', tags.length - uniqueTags.length, 'tags')
        return uniqueTags
      },
      updateTags () {
        const _this = this

        let annotationTags = this.annotations.map(a => {
          return a.body.value
        })
        annotationTags = this.enforceUniqueTags(annotationTags)
        // console.log(this.annotations, annotationTags)

        this.tags = this.enforceUniqueTags(this.tags)
        let tagsDelete = annotationTags.filter(at => {
          return _this.tags.indexOf(at) === -1
        })
        // console.log('delete', tagsDelete)
        tagsDelete = tagsDelete.map(t => {
          let a = _this.annotations.find(a => {
            return a.body.value === t
          })
          // console.log('remove', a.uuid, t)
          if (a && a.uuid) return this.$store.dispatch('annotations/remove', a.uuid)
          return null
        })

        let tagsAdd = this.tags.filter(t => {
          return annotationTags.indexOf(t) === -1
        })
        // console.log('add', tagsAdd)
        tagsAdd = tagsAdd.map(t => {
          let annotation = {
            author: _this.$store.state.auth.payload.userId,
            body: {
              purpose: 'tagging',
              type: 'TextualBody',
              value: t
            },
            target: {
              id: _this.targetUuid,
              type: _this.targetType || _this.typeFromRoute()
            }
          }
          // console.log('add', t, annotation)
          return this.$store.dispatch('annotations/create', annotation)
        })

        Promise.all([...tagsDelete, ...tagsAdd]).then(() => {
          _this.loadTags()
        })
      },
      typeFromRoute () {
        let path = this.$route.path
        if (/.+\/groups\/[^/]+\/edit$/.test(path)) {
          return constants.MAP_TYPE_TIMELINE
        }
        else if (/.+\/videos\/[^/]+\/edit$/.test(path)) {
          return 'Video'
        }
        else if (/.+\/grids\/[^/]+\/edit$/.test(path)) {
          return constants.MAP_TYPE_2D_GRID
        }
        else {
          return 'Unknown'
        }
      },
      loadTags () {
        const _this = this
        this.$store.dispatch('annotations/find', { query: { 'target.id': _this.targetUuid, 'body.purpose': 'tagging' } })
          .then(annotations => {
            _this.annotations = annotations.filter(a => a.target.id === _this.targetUuid) // TODO: Anton, why is target id ignored in the query?
            let newTags = annotations.map(a => {
              // this.$store.dispatch('annotations/remove', a.uuid) // clean up tags
              return a.body.value
            })
            newTags = this.enforceUniqueTags(newTags)
            _this.tags = newTags
          })
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
