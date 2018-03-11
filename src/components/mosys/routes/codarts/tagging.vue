<template lang="pug">

  div

    h4 Generate Set from Tags

    q-field
      q-input(float-label="Student Name", type="text", dark, v-model="studentName")

    q-field.tags
      template(v-for="(tag, index) in tags")
        template(v-if="!disabled[index]")
          q-chip(color="primary", @click="event => {handleTagClick(event, tag, index)}") {{tag}}

    q-field.selected-tags
      template(v-for="(tag, index) in tags")
        template(v-if="disabled[index]")
          q-chip(color="secondary", @click="event => {handleTagClick(event, tag, index)}") {{tag}}

    template(v-if="hasTagsSelected")
      q-btn(@click.prevent="handleSubmit") Generate Set

</template>

<script>
  import Vue from 'vue'
  import { QChipsInput, QChip, QField, QInput, QBtn } from 'quasar-framework'
  import constants from '../../../../lib/constants'

  const tagsVideosMap = {
    'achilles': {
      videos: [0]
    },
    'ankle': {
      videos: [0, 1]
    },
    'calf': {
      videos: [0]
    },
    'core': {
      videos: [4, 5]
    },
    'hamstring': {
      videos: [6]
    },
    'hip': {
      videos: [1, 2, 3, 6]
    },
    'hip stability': {
      videos: [2]
    },
    'knee': {
      videos: [1]
    },
    'lower back': {
      videos: [3, 4, 5, 6]
    },
    'posture': {
      videos: [7]
    },
    'shin splint': {
      videos: [0]
    },
    'shoulder': {
      videos: [7]
    },
    'stability leg': {
      videos: [1, 6]
    },
    'trunk': {
      videos: [4, 5]
    },
    'upper back': {
      videos: [7]
    }
  }

  const videoURLs = [
    'https://vimeo.com/259501539', // Tutorial 1_calf endurance
    'https://vimeo.com/259501849', // Tutorial 2_balance 1 leg
    'https://vimeo.com/259502001', // Tutorial 3_hip external rotation
    'https://vimeo.com/259502266', // Tutorial 4_bridge
    'https://vimeo.com/259502546', // Tutorial 5_plank
    'https://vimeo.com/259502695', // Tutorial 6_side plank
    'https://vimeo.com/259502837', // Tutorial 7_one legged deadlift
    'https://vimeo.com/259503063' // Tutorial 8_scapula retraction
  ]

  export default {
    components: {
      QChipsInput, QField, QChip, QInput, QBtn
    },
    data () {
      return {
        tags: [],
        disabled: [],
        studentName: ''
      }
    },
    computed: {
      hasTagsSelected () {
        return this.disabled.reduce((acc, val) => {
          return acc || val
        }, false)
      },
      selectedTags () {
        const _this = this
        return _this.tags.filter((tag, i) => _this.disabled[i] === true)
      }
    },
    mounted () {
      this.tags = Object.keys(tagsVideosMap)
      this.disabled = this.tags.map(t => false)
      this.videos = videoURLs
    },
    methods: {
      handleTagClick (event, tag, index) {
        Vue.set(this.disabled, index, !this.disabled[index])
      },
      handleSubmit (event) {
        const _this = this
        const authorUuid = _this.$store.state.auth.payload.userId
        let grid = {
          title: `Generated Grid for ${_this.studentName}`,
          owner: authorUuid,
          type: [constants.MAP_TYPE_2D_GRID]
        }
        _this.$store.dispatch('maps/create', grid)
          .then(grid => {
            let gridMetadata = {
              autor: authorUuid,
              type: 'Annotation',
              body: {
                purpose: 'linking',
                type: '2DGridMetadata',
                value: JSON.stringify({
                  columns: 50,
                  rows: 6,
                  ratio: 16 / 9.0
                })
              },
              target: {
                id: grid.uuid,
                type: constants.MAP_TYPE_2D_GRID
              }
            }
            return _this.$store.dispatch('annotations/create', gridMetadata)
          })
          .then(() => {
            let tagPromises = _this.selectedTags
              .map((tag, i) => {
                let tagAnnotation = {
                  author: authorUuid,
                  body: {
                    purpose: 'tagging',
                    type: 'TextualBody',
                    value: tag
                  },
                  target: {
                    id: grid.uuid,
                    type: constants.MAP_TYPE_2D_GRID
                  }
                }
                return _this.$store.dispatch('annotations/create', tagAnnotation)
              })
            return Promise.all(tagPromises)
          })
          .then(() => {
            let x = 2
            let videoCellPromises = _this.selectedTags
              .map((t) => {
                let tag = tagsVideosMap[t]
                let promises = tag.videos.map(v => {
                  let url = videoURLs[v]
                  let cell = {
                    uuid: null,
                    x: x,
                    y: 2,
                    width: 2,
                    height: 2,
                    content: url
                  }
                  x += 3
                  let cellAnnotation = {
                    author: authorUuid,
                    type: 'Annotation',
                    body: {
                      purpose: 'linking',
                      type: '2DCell',
                      value: JSON.stringify(cell)
                    },
                    target: {
                      id: grid.uuid,
                      type: constants.MAP_TYPE_2D_GRID,
                      selector: {
                        type: '2DLocation',
                        value: `x=${cell.x}&y=${cell.y}&width=${cell.width}&height=${cell.height}`
                      }
                    }
                  }
                  return _this.$store.dispatch('annotations/create', cellAnnotation)
                })
                return Promise.all(promises)
              })
            return Promise.all(videoCellPromises)
          })
          .then(() => {
            console.log('All done!')
          })
      }
    }
  }
</script>

<style scoped lang="stylus">

  .q-chip
    margin-right 1em
    margin-bottom 1em

</style>
