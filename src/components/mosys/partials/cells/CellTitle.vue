<template lang="pug">
  h1 {{titleContent}}
</template>

<script>
export default {
  props: ['cell'],
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
  h1
    padding 1rem
    font-weight bold
</style>
