<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      ul
        template(v-for="annot in annotations")
          li {{annot.body.value}}

    template(v-else)
      strong Annotation List

</template>

<script>
  export default {
    props: ['cell', 'display', 'preview'],
    data () {
      return {
        videoUuid: '',
        video: {},
        annotations: [],
        map: {}
      }
    },
    mounted () {
      this.videoUuid = this.cell.content
    },
    watch: {
      videoUuid () {
        const _this = this
        this.$store.dispatch('annotations/find', {query: {'uuid': this.videoUuid}})
          .then(videoAnnotations => {
            const videoAnnotation = videoAnnotations.shift()
            if (videoAnnotation) {
              _this.video = videoAnnotation
              _this.$store.dispatch('maps/find', {query: {'uuid': videoAnnotation.target.id}})
                .then(maps => {
                  const map = maps.shift()
                  if (map) {
                    _this.map = map
                  }
                })
              _this.$store.dispatch('annotations/find', {query: {'target.id': videoAnnotation.target.id, 'body.purpose': 'commenting'}})
                .then(annotations => {
                  annotations = annotations.sort((a, b) => {
                    return Date.parse(a.target.selector.value) - Date.parse(b.target.selector.value)
                  })
                  _this.annotations = annotations
                })
            } // TODO: else, show not found?
          })
      }
    }
  }
</script>

<style scoped lang="stylus">

  div
    padding 1em
    width 100%
    height 100%

  div.display-full
    background-color white

  div.display-preview
    color #666

</style>
