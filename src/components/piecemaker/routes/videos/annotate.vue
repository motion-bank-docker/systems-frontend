<template lang="pug">
  video-player(v-if="video", :src="video.source", :type="video.body")
</template>

<script>
  import VideoPlayer from '../../../shared/media/VideoPlayer'
  export default {
    components: {
      VideoPlayer
    },
    mounted () {
      const context = this
      if (this.$route.params.id) {
        this.$store.dispatch('annotations/get', this.$route.params.id)
          .then(result => {
            if (result.body) {
              context.video = result.body
            }
          })
      }
    },
    data () {
      return {
        video: undefined
      }
    }
  }
</script>
