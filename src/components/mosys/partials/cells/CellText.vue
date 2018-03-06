<template lang="pug">
  div {{textContent}}
</template>

<script>
export default {
  props: ['cell'],
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
</style>
