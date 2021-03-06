<template lang="pug">

  .grid-editor-container(:class="{'edit-mode': $store.state.mosys.showSources && !isMobile || showEditingCells && !isMobile}")

    // ------------------------------------------------------------------------------------------------------------ grid
    grid-editor.grid-editor(ref="gridEditor", :gridUuid="$route.params.uuid", :tabsAreOpen="tabsAreOpen")

    // -------------------------------------------------------------------------------------------------------- new cell
    .desktop-only(v-if="$store.state.mosys.showSources")

      .full-height.fixed-top-right.z-top(style="border-left: 1px solid rgba(255,255,255,0.2);")
        source-editor.source-editor.overflow-hidden.bg-dark

    q-modal.mobile-only.z-max(v-model="$store.state.mosys.showSources", minimized, content-css="border-radius: .5rem;",
    content-classes="full-modal")
      source-editor.bg-dark(style="border: 1px solid rgba(255,255,255,0.2);")

    // ----------------------------------------------------------------------------------------------------- cell editor
    .desktop-only(v-if="showEditingCells")

      .full-height.fixed-top-right.z-top(style="border-left: 1px solid rgba(255,255,255,0.2);")
        cell-editor.grid-editor-editing-cells.bg-dark(@closePanel="closePanelHandler", @removeCell="removeCellHandler")

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
        triggerScrollPositionReset: 0,
        isMobile: this.$q.platform.is.mobile
      }
    },
    computed: {
      ...mapGetters({
        showEditingCells: 'mosys/getShowEditingCells',
        showSources: 'mosys/getShowSources'
      }),
      tabsAreOpen () {
        return this.showSources || this.showEditingCells
      }
    },
    methods: {
      removeCellHandler (annotation) {
        this.$refs.gridEditor.deleteCell('', annotation)
      },
      closePanelHandler () {
        // this.$store.commit('mosys/setEditingCells', '')
      },
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
    transition width ease 300ms

    &.edit-mode
      width 75%

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
  .custom-shadow
    box-shadow 0 0 20px 0 rgba(0, 0, 0, .1)
</style>
