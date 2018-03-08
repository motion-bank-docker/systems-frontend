<template lang="pug">

  q-tabs.grid-editor-sources-tabs.shadow-11
    q-tab(slot="title", name="tab-1", default) Default
    q-tab(slot="title", name="tab-2") Piecemaker
    q-tab(slot="title", name="tab-3") Vimeo
    q-tab(slot="title", name="tab-4") YouTube
    q-btn(slot="title", icon="close",
      small, flat, round, class="fixed", style="right: 2px; margin-top: 3px",
      @click="event => {$store.commit('mosysGridEditorStore/hideSources')}")

    q-tab-pane(name="tab-1")
      source-grid-editor-default

    q-tab-pane(name="tab-2")
      source-piecemaker-groups

    q-tab-pane(name="tab-3")
      source-vimeo

    q-tab-pane(name="tab-4")
      source-you-tube

</template>

<script>
  import { QBtn, QTabs, QTab, QTabPane } from 'quasar-framework'
  import SourceGridEditorDefault from './GridEditorDefaultSource'
  import SourcePiecemakerGroups from './GridEditorSourcePieceMakerGroupsList'
  import SourceVimeo from './GridEditorSourceVimeo'
  import SourceYouTube from './GridEditorSourceYouTube'

  export default {
    components: {
      QBtn,
      QTabs,
      QTab,
      QTabPane,
      SourceGridEditorDefault,
      SourcePiecemakerGroups,
      SourceVimeo,
      SourceYouTube
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
