<template lang="pug">

  div
    template(v-if="display")
      strong 'Vimeo Cell'

    template(v-else)
      strong 'Vimeo Cell'

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
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
