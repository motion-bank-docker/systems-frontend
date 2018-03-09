<template lang="pug">

  div
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

<style scoped>
  div {
    padding: 1em;
  }
</style>
