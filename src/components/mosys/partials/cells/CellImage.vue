<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      img(:src="imgSrc")

    template(v-else)
      div.cell-background(:style="cellBackgroundStyle")
      strong Image Cell

</template>

<script>
export default {
  props: ['cell', 'display', 'preview'],
  data () {
    return {
      cellBackgroundStyle: {}
    }
  },
  computed: {
    imgSrc () {
      return this.cell['content']
    }
  },
  mounted () {
    if (this.preview) {
      this.cellBackgroundStyle = {
        'background-image': `url(${this.imgSrc})`
      }
    }
  }
}
</script>

<style scoped lang="stylus">

  div
    width 100%
    height 100%

  div.display-full
    background-color white

  div.display-preview
    padding 1em
    color #666

    .cell-background
      top 0
      left 0
      bottom 0
      right 0
      position absolute
      opacity 0.2
      background-size cover

  img
    width 100%

</style>
