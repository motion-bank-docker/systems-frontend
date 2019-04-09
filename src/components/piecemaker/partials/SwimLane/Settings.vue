<template lang="pug">
  .row
    div
      //
        q-tooltip.bg-grey-9 Group annotations by
      q-btn-dropdown.q-mt-xs.bg-grey-9(:label="groupAnnotationsBy", size="sm", flat)
        q-list.q-py-none
          q-item.cursor-pointer.q-caption(v-for="o in options", :key="o.value",
          @click.native="groupAnnotationsBy = o.value", v-close-overlay,
          :class="[groupAnnotationsBy === o.value ? 'bg-primary text-white' : '']") {{ o.label }}

    div.q-pl-sm
      //
        q-tooltip.bg-grey-9 Lane mode
      q-btn-dropdown.q-mt-xs.bg-grey-9(:label="laneMode", size="sm", flat)
        q-list.q-py-none
          q-item.cursor-pointer.q-caption(v-for="o in optionsLaneMode", :key="o.value",
          @click.native="laneMode = o.value", v-close-overlay,
          :class="[laneMode === o.value ? 'bg-primary text-white' : '']") {{ o.label }}
    // undo
    div.q-pl-sm
      q-btn.q-mt-xs.bg-grey-9(icon="undo", size="sm", flat)
    // redo
    div.q-pl-sm
      q-btn.q-mt-xs.bg-grey-9(icon="redo", size="sm", flat)
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        groupAnnotationsBy: this.$store.state.swimLaneSettings.groupAnnotationsBy,
        laneMode: this.$store.state.swimLaneSettings.laneMode
      }
    },
    mounted () {
    },
    watch: {
      groupAnnotationsBy (val) {
        this.$store.commit('swimLaneSettings/setType', val)
      },
      laneMode (val) {
        this.$store.commit('swimLaneSettings/setLaneMode', val)
      }
    },
    computed: {
      ...mapGetters({
        options: 'swimLaneSettings/getOptions',
        optionsLaneMode: 'swimLaneSettings/getOptionsLaneMode'
      })
    }
  }
</script>

<style scoped lang="stylus">
  .q-item
    min-height auto!important
</style>
