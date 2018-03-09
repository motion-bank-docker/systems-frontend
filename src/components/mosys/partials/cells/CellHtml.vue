<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      div(v-html="htmlContent")

    template(v-else)
      strong 'HTML Cell'

</template>

<script>
export default {
  props: ['cell', 'display', 'preview'],
  data () {
    return {}
  },
  computed: {
    htmlContent () {
      return this.cell.additional_fields['html-content']
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
</style>
