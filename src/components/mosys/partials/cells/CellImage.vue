<template lang="pug">

  div
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
    padding 1em

    img
      width 100%

</style>
