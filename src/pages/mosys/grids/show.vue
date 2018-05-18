<template lang="pug">
  .grid-display-container
    div.backbutton
      q-btn(slot="backButton", @click="$router.push('/mosys/grids')", icon="keyboard_backspace", round, small, color="black")
    grid-display.grid-display(:gridUuid="$route.params.id")
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import GridDisplay from '../../partials/GridDisplay'
  export default {
    components: {
      QBtn,
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

  .backbutton
    position absolute
    top 1em
    left 1em
    z-index 99999
    opacity .4

</style>
