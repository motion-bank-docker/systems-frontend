<template lang="pug">
  .grid-display-container
    grid-display.grid-display(:gridUuid="$route.params.id")
</template>

<script>
  import GridDisplay from '../../partials/GridDisplay'
  export default {
    components: {
      GridDisplay
    }
  }
</script>

<style scoped lang="stylus">

  .grid-display-container
    display flex
    width 100%
    height 100%
    position absolute
    flex-direction row

  .grid-display
    flex-grow 1
    width 100%
    height 100%
    overflow auto

</style>
