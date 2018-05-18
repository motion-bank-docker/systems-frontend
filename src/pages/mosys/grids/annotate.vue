<template lang="pug">
  .grid-editor-container(:class="{'sources-open': $store.state.mosysGridEditorStore.showSources}")
    div.backbutton
      q-btn(slot="backButton", @click="$router.push('/mosys/grids')", icon="keyboard_backspace", round, small, color="black")
    div.grid-editor-shadow-right(v-if="$store.state.mosysGridEditorStore.showSources")
    grid-editor.grid-editor(:gridUuid="$route.params.id")
    grid-editor-sources.grid-editor-sources(v-if="$store.state.mosysGridEditorStore.showSources")
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import GridEditor from '../../partials/GridEditor'
  import GridEditorSources from '../../partials/GridEditorSources'

  export default {
    components: {
      QBtn,
      GridEditor,
      GridEditorSources
    }
  }
</script>

<style scoped lang="stylus">

  .grid-editor-container
    display flex
    width 100%
    height 100%
    position absolute
    flex-direction row

  .grid-editor
  .grid-editor-sources
    flex-grow 1
    width 100%
    height 100%

  .grid-editor
    overflow auto

  .sources-open
    .grid-editor
      width calc(2*100%/3)

  .grid-editor-sources
    width calc(100%/3)

  .grid-editor-shadow-right
    background: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.2));
    position absolute
    right calc(100%/3)
    top 0
    bottom 0
    width 8px

  .backbutton
    position absolute
    top 1em
    left 1em
    z-index 99999
    opacity .4
</style>
