<template lang="pug">

  div
    template(v-if="display")
      strong 'Visualization Cell'

    template(v-else)
      strong 'Visualization Cell'

</template>

<script>
  export default {
    props: ['cell', 'display', 'preview'],
    data () {
      return {}
    },
    mounted () {
    }
  }
</script>

<style scoped>
  div {
    width: 100%;
    height: 100%;
    background-color: white;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
