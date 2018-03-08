<template lang="pug">

  q-tabs.grid-editor-sources-tabs
    q-tab(slot="title", name="tab-1", default) Sources
    q-tab(slot="title", name="tab-2") Piecemaker
    q-tab(slot="title", name="tab-3") Vimeo
    q-tab(slot="title", name="tab-4") YouTube
    q-btn(slot="title", icon="close",
      small, flat, round, class="fixed", style="right: 2px; margin-top: 3px",
      @click="event => {$store.commit('mosysGridEditorStore/hideSources')}")

    q-tab-pane(name="tab-1")
      grid-editor-default-source

    q-tab-pane(name="tab-2")
      piecemaker-groups-list

    q-tab-pane(name="tab-3") Tab Three
    q-tab-pane(name="tab-4") Tab Four
    q-tab-pane(name="tab-5") Tab Five

</template>

<script>
  import { QBtn, QTabs, QTab, QTabPane } from 'quasar-framework'
  import GridEditorDefaultSource from './GridEditorDefaultSource'
  import PiecemakerGroupsList from './GridEditorSourcePieceMakerGroupsList'

  export default {
    components: {
      QBtn,
      QTabs,
      QTab,
      QTabPane,
      GridEditorDefaultSource,
      PiecemakerGroupsList
    },
    beforeDestroy () {
      this.$store.commit('mosysGridEditorStore/hideSources')
    }
  }
</script>

<style lang="stylus">

  .grid-editor-sources-tabs
    background-color white

    .q-tabs-panes
      display flex
      flex-direction column
      overflow auto

</style>
