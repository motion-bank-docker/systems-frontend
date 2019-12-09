<template lang="pug">

  .grid-editor-container

    // ------------------------------------------------------------------------------------------------------------ grid
    grid-editor.grid-editor(ref="gridEditor", :gridUuid="$route.params.uuid", :tabsAreOpen="tabsAreOpen")

    // -------------------------------------------------------------------------------------------------------- new cell
    .desktop-only(v-if="$store.state.mosys.showSources")
      // .grid-editor-border-left.z-top.bg-grey-4

      .full-height
        source-editor.source-editor.bg-white.overflow-hidden

    q-modal.mobile-only.z-max(v-model="$store.state.mosys.showSources", minimized, content-css="border-radius: .5rem;",
    content-classes="full-modal")
      source-editor

    // ----------------------------------------------------------------------------------------------------- cell editor
    .desktop-only(v-if="showEditingCells")
      // .grid-editor-border-left.z-top.bg-grey-4

      .full-height
        cell-editor.grid-editor-editing-cells.bg-white

</template>

<script>
  import { mapGetters } from 'vuex'
  import GridEditor from '../../../components/mosys/partials/GridEditor'
  import SourceEditor from '../../../components/mosys/partials/SourceEditor'
  import CellEditor from '../../../components/mosys/partials/CellEditor'

  export default {
    components: {
      GridEditor,
      SourceEditor,
      CellEditor
    },
    data () {
      return {
        triggerScrollPositionReset: 0
      }
    },
    mounted () {
      this.$root.$on('mosys_saveScrollPosition', this.handleSaveGridScrollPosition)
    },
    beforeDestroy () {
      this.$root.$off('mosys_saveScrollPosition', this.handleSaveGridScrollPosition)
    },
    computed: {
      ...mapGetters({
        showEditingCells: 'mosys/getShowEditingCells',
        showSources: 'mosys/getShowSources'
        // scrollPositionCache: 'mosys/getScrollPositionCache'
      }),
      tabsAreOpen () {
        return this.showSources || this.showEditingCells
      }
    },
    methods: {
      closedModal () {
        this.$store.commit('mosys/hideEditingCells')
      },
      handleSaveGridScrollPosition () {
        this.$store.commit('mosys/setScrollPositionCache', this.$refs.gridEditor.$el.scrollLeft)
      }
    }
  }
</script>

<style scoped lang="stylus">

  .grid-editor-container
    display flex
    width 100%
    height calc(100% - 59px) // FIXME: quick fix for issue #13, can we do without calc()?
    position absolute
    flex-direction row

    .grid-editor
      overflow auto

    .grid-editor
    .source-editor
    .grid-editor-editing-cells
      flex-grow 1
      width 100%
      height 100%

    .source-editor
    .grid-editor-editing-cells
      width calc(100vw / 4)

    .grid-editor-border-left
      position absolute
      right calc(100vw / 4)
      top 0
      width 1px
      height 100%

</style>
