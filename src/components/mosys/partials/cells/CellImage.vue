<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      img(:src="imgSrc")

    template(v-else)
      strong 'Image Cell'

</template>

<script>
export default {
  props: ['cell', 'display', 'preview'],
  data () {
    return {}
  },
  computed: {
    imgSrc () {
      return this.cell['content']
    }
  }
}
</script>

<style scoped lang="stylus">

  div
    width 100%
    height 100%
    background-color white
    background-size contain
    background-repeat no-repeat
    background-position center
    padding 1em

  img
    width 100%

</style>
