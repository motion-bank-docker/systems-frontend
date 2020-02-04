<template lang="pug">
  .annotation-icon(:class="classes", :style="styles")
</template>

<script>
  export default {
    name: 'annotation-icon',
    props: ['annotation', 'isSelected'],
    data () {
      return {
        colors: {
          'SpecificResource': 'grey',
          'TextualBody': '#57aeff',
          'Video': 'tomato',
          'VocabularyEntry': 'black'
        }
      }
    },
    computed: {
      classes () {
        let c = []
        if (this.isSelected) c.push('is-selected')
        if (this.annotation.target.selector._valueDuration) c.push('has-duration')
        c.push('annotation-type-' + (this.annotation.body.type || 'SpecificResource'))
        return c
      },
      styles () {
        return {
          'background-color': this.colors[this.annotation.body.type || 'SpecificResource']
        }
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
    opacity: 0.4
    border-radius 100%
    &.is-selected
      opacity: 1
    &.has-duration
      border-radius: 0
  .bright-shadow
    // box-shadow 0 0 5px 0 rgba(255, 255, 255, .4)
    border 1px solid $faded
</style>
