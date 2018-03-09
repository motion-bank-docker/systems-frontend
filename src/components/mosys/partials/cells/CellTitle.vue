<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      h1 {{titleContent}}

    template(v-else)
      strong 'Title Cell'

</template>

<script>
export default {
  props: ['cell', 'display', 'preview'],
  data () {
    return {}
  },
  computed: {
    titleContent () {
      return this.cell['content']
    }
  }
}
</script>

<style scoped lang="stylus">

  div
    padding 1em
    width 100%
    height 100%
    background-color white
    background-size contain
    background-repeat no-repeat
    background-position center

  h1
    font-weight bold

</style>
