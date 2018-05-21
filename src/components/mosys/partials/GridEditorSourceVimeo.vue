<template lang="pug">

  q-list.vimeo-source-container

    q-list-header
      q-input(v-model="searchTerm")

    q-item-separator

    // loading, nothing here
    template(v-if="loadingVideos")
      q-item
        q-item-side
          q-spinner(style="margin-right: 1em")
        q-item-main Loading videos for »{{lastSearchTerm}}«
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
  const VIMEO_ACCESS_TOKEN = '8dbc7f72ddb834a4665dbb6989014699'
  const apiBase = 'https://api.vimeo.com'
  const apiSearchVideos = '/videos'

  export default {
    data () {
      return {
        searchTerm: '',
        searchResults: [],
        loadingVideos: false,
        lastSearchTerm: ''
      }
    },
    watch: {
      searchTerm () {
        if (!this.loadingVideos) {
          this.loadVideos()
        }
      }
    },
    methods: {
      loadVideos () {
        const _this = this
        if (this.searchTerm.length >= 3) {
          this.loadingVideos = true
          this.lastSearchTerm = this.searchTerm
          // TODO: check if change from superagent to axios plugin is breaking
          this.$axios
            .get(apiBase + apiSearchVideos, {
              query: this.searchTerm,
              access_token: VIMEO_ACCESS_TOKEN
            })
            .then(results => {
              _this.searchResults = results.body.data
              _this.checkNewSearchTerm()
            })
            .catch(() => {
              console.log('Failed to load Vimeo results for', _this.searchTerm)
              _this.checkNewSearchTerm()
            })
        }
        else if (this.searchTerm.length === 0) {
          this.searchResults = []
          this.lastSearchTerm = ''
        }
      },
      checkNewSearchTerm () {
        if (this.searchTerm !== this.lastSearchTerm) {
          this.loadVideos()
        }
        else {
          this.loadingVideos = false
        }
      },
      handleVideoItemClick () {
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
