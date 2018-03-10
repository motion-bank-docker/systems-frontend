<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      span A Timeline ... not sure how to display it here

    template(v-else)
      strong Timeline Cell

</template>

<script>
export default {
  props: ['cell', 'display', 'preview'],
  data () {
    return {}
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
