<template lang="pug">

  q-tabs.grid-editor-sources-tabs.shadow-11(v-model="selectedTab")
    q-tab(slot="title", name="tab-default-cells", default, icon="add")
    <!--q-tab(slot="title", name="tab-magic-box", icon="wb iridescent")-->
    q-tab(slot="title", name="tab-piecemaker") Piecemaker
    q-tab(slot="title", name="tab-vimeo") Vimeo
    q-tab(slot="title", name="tab-youtube") YouTube
    q-btn(slot="title", icon="close",
      small, flat, round, class="fixed", style="right: 2px; margin-top: 3px",
      @click="event => {$store.commit('mosysGridEditorStore/hideSources')}")

    q-tab-pane(name="tab-default-cells")
      template(v-if="this.selectedCells.length > 0")
        cell-editor(:cells="selectedCells")
      template(v-else)
        grid-editor-default-source

    <!--q-tab-pane(name="tab-magic-box")-->
      <!--grid-editor-magic-source-->

    q-tab-pane(name="tab-piecemaker")
      grid-editor-source-piece-maker

    q-tab-pane(name="tab-vimeo")
      grid-editor-source-vimeo

    q-tab-pane(name="tab-youtube")
      grid-editor-source-you-tube

</template>

<script>
  import CellEditor from './CellEditor'
  import GridEditorDefaultSource from './GridEditorDefaultSource'
  import GridEditorMagicSource from './GridEditorMagicSource'
  import GridEditorSourcePieceMaker from './GridEditorSourcePieceMaker'
  import GridEditorSourceVimeo from './GridEditorSourceVimeo'
  import GridEditorSourceYouTube from './GridEditorSourceYouTube'

  export default {
    components: {
      CellEditor,
      GridEditorDefaultSource,
      GridEditorMagicSource,
      GridEditorSourcePieceMaker,
      GridEditorSourceVimeo,
      GridEditorSourceYouTube
    },
    data () {
      return {
        selectedTab: ''
      }
    },
    computed: {
      currentStoreTab () {
        return this.$store.state.mosysGridEditorStore.sourcesTabName
      },
      selectedCells () {
        return this.$store.state.mosysGridEditorStore.selectedCells
      }
    },
    watch: {
      currentStoreTab () {
        if (this.selectedTab !== this.currentStoreTab) {
          this.selectedTab = this.currentStoreTab
        }
      },
      selectedTab () {
        if (this.selectedTab !== this.currentStoreTab) {
          this.$store.commit('mosysGridEditorStore/setSourcesTab', this.selectedTab)
        }
      }
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
