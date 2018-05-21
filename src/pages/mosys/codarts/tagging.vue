<template lang="pug">

  card-full

    div(slot="form-logo")
    h4(slot="form-title") Generate Set from Tags

    q-field(style="margin-bottom: 2em")
      q-input(float-label="Student Name", type="text", dark, v-model="studentName")

    h6 Available Tags

    q-field.tags
      template(v-for="(tag, index) in tags")
        template(v-if="!disabled[index]")
          q-chip(color="faded", @click="event => {handleTagClick(event, tag, index)}") {{tag}}

    h6(v-if="hasSelectedTags()", style="padding-top: 0.5em") Selected Tags

    q-field.selected-tags
      template(v-for="(tag, index) in tags")
        template(v-if="disabled[index]")
          q-chip(color="primary", @click="event => {handleTagClick(event, tag, index)}") {{tag}}

    template(v-if="hasSelectedTags()")
      q-btn(@click.prevent="handleSubmit", color="primary", style="margin-top: 2em", :dark="true", outline) Generate Set

</template>

<script>
  import Vue from 'vue'
  import Promise from 'bluebird'
  import constants from '../../../lib/constants'
  import CardFull from '../../../components/shared/layouts/CardFull'

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
      CardFull
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
        const videos = []
        _this.selectedTags.map(t => {
          let tag = tagsVideosMap[t]
          tag.videos.map(v => {
            let url = videoURLs[v]
            if (videos.indexOf(url) === -1) videos.push(url)
          })
        })
        let grid, gridTemplate = {
            title: `Generated Grid for ${_this.studentName}`,
            owner: authorUuid,
            type: [constants.MAP_TYPE_2D_GRID]
          }
        _this.$store.dispatch('maps/create', gridTemplate)
          .then(g => {
            grid = g
            let gridMetadata = {
              autor: authorUuid,
              body: {
                purpose: 'linking',
                type: '2DGridMetadata',
                value: JSON.stringify({
                  columns: 1 + (5 * videos.length),
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
            return Promise.map(_this.selectedTags, (tag, i) => {
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
          })
          .then(() => {
            let x = 2
            return Promise.map(videos, url => {
              let cell = {
                uuid: null,
                type: 'Video',
                x: x,
                y: 2,
                width: 4,
                height: 4,
                content: url,
                sourceUuid: null
              }
              x += 5
              let cellAnnotation = {
                author: authorUuid,
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
          })
          .then(() => {
            _this.$router.push(`/mosys/grids/${grid.uuid}`)
          })
      },
      hasSelectedTags () {
        return this.disabled.reduce((acc, val) => {
          return acc || val
        }, false)
      }
    }
  }
</script>

<style scoped lang="stylus">

  .q-chip
    margin-right 1em
    margin-bottom 1em

</style>
