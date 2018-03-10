<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      ul
        template(v-for="annot in annotations")
          li
            a(:class="{'active': contextTime && inContextTime(annot)}",
              @click.prevent="event => {handleAnnotationClick(event, annot)}") {{annot.body.value}}

    template(v-else)
      strong Annotation List

</template>

<script>
  export default {
    props: ['cell', 'display', 'preview', 'messenger'],
    data () {
      return {
        videoUuid: '',
        video: {},
        videoTime: {},
        contextTime: {},
        annotations: [],
        map: {}
      }
    },
    mounted () {
      const _this = this
      this.videoUuid = this.cell.content
      if (this.messenger) {
        this.messenger.$on('video-time-changed', (time, globalTime, origin) => {
          if (origin.type === 'Video' &&
            _this.video.target.id === origin.origin.target.id &&
            _this.videoTime <= globalTime) {
            _this.contextTime = globalTime
          }
        })
      }
    },
    watch: {
      videoUuid () {
        const _this = this
        this.$store.dispatch('annotations/find', {query: {'uuid': this.videoUuid}})
          .then(videoAnnotations => {
            const videoAnnotation = videoAnnotations.shift()
            if (videoAnnotation) {
              _this.video = videoAnnotation
              _this.videoTime = Date.parse(_this.video.target.selector.value)
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
    },
    methods: {
      handleAnnotationClick (event, annot) {
        this.messenger.$emit('annotation-trigger', annot)
      },
      inContextTime (annot) {
        const annotTime = Date.parse(annot.target.selector.value)
        const dist = annotTime - this.contextTime
        return Math.abs(dist) < 2000 // 2 secs?
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

  li a.active
    color orangered

</style>
