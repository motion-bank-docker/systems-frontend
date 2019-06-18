<template lang="pug">
  .grid-editor-container(:class="{'tabs-open': tabsAreOpen}")
    //div.backbutton(v-if="!isMobile")
      q-btn(slot="backButton", @click="$router.push('/mosys/grids')", icon="keyboard_backspace", round, small, color="black")
    div.grid-editor-shadow-right(v-if="tabsAreOpen")
    grid-editor.grid-editor(:gridUuid="$route.params.uuid")
    grid-editor-sources.grid-editor-sources(v-if="$store.state.mosys.showSources")
    grid-editor-editing-cells.grid-editor-editing-cells(v-if="showEditingCells")
    // grid-editor-add-cells.grid-editor-sources(v-if="$store.state.mosys.showAddCells")
</template>

<script>
  import { mapGetters } from 'vuex'
  import GridEditor from '../../../components/mosys/partials/GridEditor'
  import GridEditorSources from '../../../components/mosys/partials/GridEditorSources'
  import GridEditorAddCells from '../../../components/mosys/partials/GridEditorAddCells'
  import GridEditorEditingCells from '../../../components/mosys/partials/GridEditorEditingCells'

  export default {
    components: {
      GridEditorEditingCells,
      GridEditorAddCells,
      GridEditor,
      GridEditorSources
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile',
        showEditingCells: 'mosys/getShowEditingCells'
      }),
      tabsAreOpen () {
        return this.$store.state.mosys.showSources || this.$store.state.mosys.showEditingCells
      }
    }
  }
</script>

<style scoped lang="stylus">

  .grid-editor-container
    display flex
    width 100%
    height calc(100% - 50px) // FIXME: quick fix for issue #13, can we do without calc()?
    position absolute
    flex-direction row

  .grid-editor-editing-cells
  .grid-editor
  .grid-editor-sources
    flex-grow 1
    width 100%
    height 100%

  .grid-editor
    overflow auto

  .tabs-open
    .grid-editor
      width calc(2*100%/3)

  .grid-editor-editing-cells
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
