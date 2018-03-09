<template lang="pug">

  div
    template(v-if="display")
      video-player(:src="video")

    template(v-else)
      strong 'Video Cell'

</template>

<script>
  import VideoPlayer from '../../../shared/media/VideoPlayer'

  export default {
    components: {
      VideoPlayer
    },
    props: ['cell', 'display', 'preview'],
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
    }
  }
</script>

<style scoped lang="stylus">

/*  div
    width: 100%;
    height: 100%;
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;*/

</style>
