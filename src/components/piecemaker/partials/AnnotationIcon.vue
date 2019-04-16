<template lang="pug">
  .annotation-icon(
  :style="{backgroundColor: bgColor}",
  :class="{'bright-shadow': bgColor === 'black'}")
</template>

<script>
  export default {
    name: 'annotation-icon',
    props: ['selectedAnnotation'],
    data () {
      return {
        bgColor: undefined
      }
    },
    mounted () {
      this.setType(this.selectedAnnotation.body.type)
    },
    watch: {
      selectedAnnotation () {
        this.setType(this.selectedAnnotation.body.type)
      }
    },
    methods: {
      setType (type) {
        switch (type) {
        case 'TextualBody':
          this.bgColor = '#57aeff'
          break
        case 'Video':
          this.bgColor = 'tomato'
          break
        case 'VocabularyEntry':
          this.bgColor = 'black'
          break
        default:
          this.bgColor = 'transparent'
          break
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .annotation-icon
    width 16px
    height 16px
    opacity: 0.3
    border-radius 100%
  .bright-shadow
    // box-shadow 0 0 5px 0 rgba(255, 255, 255, .4)
    border 1px solid rgba(255, 255, 255, .4)
</style>
