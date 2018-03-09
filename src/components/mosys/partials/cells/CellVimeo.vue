<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
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

<style scoped lang="stylus">

</style>
