<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      div {{textContent}}

    template(v-else)
      strong Text Cell

</template>

<script>
export default {
  props: ['cell', 'display', 'preview'],
  data () {
    return {}
  },
  computed: {
    textContent () {
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

  div.display-full
    background-color white

  div.display-preview
    color #666

</style>
