<template lang="pug">
  .grid-display-container
    //div.backbutton(v-if="!isMobile")
      q-btn(slot="backButton", @click="$router.push('/mosys/grids')", icon="keyboard_backspace", round, small, color="black")
    grid-display.grid-display(ref="gridDisplay", :gridUuid="$route.params.uuid")
</template>

<script>
  import GridDisplay from '../../../components/mosys/partials/GridDisplay'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      GridDisplay
    },
    computed: {
      ...mapGetters({
        scrollPositionCache: 'mosys/getScrollPositionCache'
      }),
      isMobile () {
        return this.$q.platform.is.mobile
      }
    },
    mounted () {
      this.$root.$on('mosys_saveScrollPosition', this.handleSaveGridScrollPosition)
    },
    beforeDestroy () {
      this.$root.$off('mosys_saveScrollPosition', this.handleSaveGridScrollPosition)
    },
    methods: {
      handleSaveGridScrollPosition () {
        this.$store.commit('mosys/setScrollPositionCache', this.$refs.gridDisplay.$el.scrollLeft)
      }
    }
  }
</script>

<style scoped lang="stylus">

  .grid-display-container
    display flex
    width 100%
    height calc(100% - 50px) // FIXME: quick fix for issue #13, can we do without calc()?
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
