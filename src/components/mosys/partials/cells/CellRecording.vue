<template lang="pug">

  div
    template(v-if="display")
      strong 'Recording Cell'

    template(v-else)
      strong 'Recording Cell'

</template>

<script>
export default {
  props: ['cell', 'display', 'preview'],
  data () {
    return {}
  },
  mounted () {}
}
</script>

<style scoped>
  div {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
