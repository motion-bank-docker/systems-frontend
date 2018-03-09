<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      video-player(
        :src="video",
        @ready="handlePlayerReady",
        @play="handlePlayerPlaying",
        @time="handlePlayerTimeChange")

    template(v-else)
      strong 'Video Cell'

</template>

<script>
  import VideoPlayer from '../../../shared/media/VideoPlayer'

  export default {
    components: {
      VideoPlayer
    },
    props: ['cell', 'display', 'preview', 'messenger'],
    data () {
      return {}
    },
    computed: {
      video () {
        let fauxVideoAnnotation = {
          type: 'Video',
          purpose: 'linking',
          source: this.cell['content']
        }
        return fauxVideoAnnotation
      },
      videoSrcType () {
        if (this.videoSrc.indexOf('youtube.com') >= 0) return 'video/youtube'
        else return 'html5'
      }
    },
    methods: {
      handlePlayerReady (event) {
        this.messenger.$emit('video-loaded', this.cell.uuid)
      },
      handlePlayerPlaying (event) {
        this.messenger.$emit('video-started-playing', this.cell.uuid)
      },
      handlePlayerTimeChange (videoTime) {
        this.messenger.$emit('video-time-changed', this.cell.uuid, videoTime)
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
