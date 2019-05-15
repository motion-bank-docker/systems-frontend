<template lang="pug">
  .annotation-icon(
    :style="{backgroundColor: bgColor}",
    :class="{'bright-shadow': bgColor === 'black', 'is-selected': isSelected, 'has-duration': annotation.target.selector._valueDuration}"
    )
</template>

<script>
  export default {
    name: 'annotation-icon',
    props: ['annotation', 'isSelected'],
    data () {
      return {
        colors: {
          'TextualBody': '#57aeff',
          'Video': 'tomato',
          'VocabularyEntry': 'black'
        }
      }
    },
    mounted () {
    },
    watch: {
    },
    computed: {
      bgColor () {
        return this.colors[this.annotation.body.type] || 'black'
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .annotation-icon
    width 16px
    height 16px
    opacity: 0.3
    border-radius 100%
    &.is-selected
      opacity: 1
    &.has-duration
      border-radius: 0
  .bright-shadow
    // box-shadow 0 0 5px 0 rgba(255, 255, 255, .4)
    border 1px solid $faded
</style>
