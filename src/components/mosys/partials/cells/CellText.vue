<template lang="pug">

  div
    template(v-if="display")
      div {{textContent}}

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
