<template lang="pug">

  q-list.vimeo-source-container

    q-list-header
      // template(v-if="currentGroup") Videos in Group #[strong {{currentGroup.title}}]
        q-btn(flat, round, small, fixed, class="fixed",
          style="right: 24px", @click="handleClickUnsetCurrentGroup", icon="close")
        template(v-else)
          router-link(:to="{name: 'piecemaker.groups.list'}") Piecemaker Groups
      input(v-model="searchTerm", @change="handleInputChange")

    q-item-separator

    // loading, nothing here
    template(v-if="loadingVideos")
      q-item
        q-item-side
          q-spinner(style="margin-right: 1em")
        q-item-main Loading Videos
      q-item-separator
    template(v-else-if="searchResults.length === 0")
      q-item No Videos Found!

    // videos, annotations
    template(v-if="searchResults.length > 0")
      template(v-for="(video, i) in searchResults")
        template(v-if="i > 0")
          q-item-separator
        q-item(draggable="true", @dragstart="event => {handleVideoItemDragStart(event, video)}")
          q-item-side
            template(v-if="video.pictures[4]")
              img(:src="video.pictures[4].link", style="width: 100%; max-width: 50px")
            template(v-else)
              q-icon(name="local movies", style="font-size: 1.8rem")
          q-item-main
            a(@click.prevent="event => {handleVideoItemClick(event, video)}") {{video.name.substring(0, 100)}}
</template>

<script>
  import { QIcon, QBtn, QList, QListHeader, QItem, QItemSide, QItemMain, QItemSeparator, QScrollArea, QSpinner } from 'quasar-framework'
  import superagent from 'superagent'

  const VIMEO_ACCESS_TOKEN = '8dbc7f72ddb834a4665dbb6989014699'
  const apiBase = 'https://api.vimeo.com'
  const apiSearchVideos = '/videos'

  export default {
    components: {
      QIcon, QBtn, QList, QListHeader, QItem, QItemSide, QItemMain, QItemSeparator, QScrollArea, QSpinner
    },
    data () {
      return {
        searchTerm: '',
        searchResults: [],
        loadingVideos: false
      }
    },
    methods: {
      handleInputChange () {
        const _this = this
        this.loadingVideos = true
        if (this.searchTerm.length >= 3) {
          superagent
            .get(apiBase + apiSearchVideos, {
              query: this.searchTerm,
              access_token: VIMEO_ACCESS_TOKEN
            })
            .then(results => {
              _this.searchResults = results.body.data
              _this.loadingVideos = false
            })
            .catch(() => {
              console.log('Failed to load Vimeo results for', _this.searchTerm)
              _this.loadingVideos = false
            })
        }
      },
      handleVideoItemClick (event, video) {
      },
      handleVideoItemDragStart (event, video) {
        let videoCell = {
          uuid: null,
          type: 'Video',
          x: 1,
          y: 1,
          width: 1,
          height: 1,
          content: video.link
        }
        event.dataTransfer.setData('text/plain', JSON.stringify(videoCell))
      }
    }
  }
</script>

<style scoped>

</style>
