<template lang="pug">

  q-tabs.grid-editor-sources-tabs
    q-tab(slot="title", name="tab-1", default) Sources
    q-tab(slot="title", name="tab-2") Piecemaker
    q-tab(slot="title", name="tab-3") Vimeo
    q-tab(slot="title", name="tab-4") YouTube

    q-tab-pane(name="tab-1") Tab One

    q-tab-pane(name="tab-2")
      piecemaker-groups-list

    q-tab-pane(name="tab-3") Tab Three
    q-tab-pane(name="tab-4") Tab Four
    q-tab-pane(name="tab-5") Tab Five

</template>

<script>
  import { QTabs, QTab, QTabPane } from 'quasar-framework'
  import PiecemakerGroupsList from '../partials/PieceMakerGroupsList'

  export default {
    components: {
      QTabs,
      QTab,
      QTabPane,
      PiecemakerGroupsList
    },
    beforeDestroy () {
      this.$store.commit('mosysGridEditorStore/hideSources')
    }
  }
</script>

<style lang="stylus">

  .grid-editor-sources-tabs
    background-color lightcyan

    .q-tabs-panes
      display flex
      flex-direction column
      border 2px solid pink
      overflow auto

</style>
