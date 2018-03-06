<template lang="pug">
  video-player(:src="videoSrc", :type="videoSrcType")
</template>

<script>
  import VideoPlayer from '../../../shared/media/VideoPlayer'

  export default {
    components: {
      VideoPlayer
    },
    props: ['cell'],
    data () {
      return {}
    },
    computed: {
      videoSrc () {
        return this.cell.content
      },
      videoSrcType () {
        if (this.videoSrc.indexOf('youtube.com') >= 0) return 'video/youtube'
        else return 'html5'
      }
    }
  }
</script>

<style scoped lang="stylus">
  div {
    width: 100%;
    height: 100%;
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
