<template lang="pug">
  .row.q-px-md

    // sort by author/type
    q-btn-dropdown.q-mt-xs.bg-grey-9(:label="groupAnnotationsBy", size="sm", flat)
      q-list.q-py-none
        q-item.cursor-pointer.q-caption(v-for="o in options", :key="o.value",
        @click.native="groupAnnotationsBy = o.value", v-close-overlay,
        :class="[groupAnnotationsBy === o.value ? 'bg-primary text-white' : '']") {{ o.label }}

    // expand/collapse
    //
      q-btn-dropdown.q-mt-xs.bg-grey-9.q-ml-sm(:label="laneMode", size="sm", flat)
        q-list.q-py-none
          q-item.cursor-pointer.q-caption(v-for="o in optionsLaneMode", :key="o.value",
          @click.native="laneMode = o.value", v-close-overlay,
          // :class="[laneMode === o.value ? 'bg-primary text-white' : '']") {{ o.label }}

    // expand button
    q-btn.flip-vertical.q-mt-xs.q-ml-sm(@click="expand()", size="sm", flat, round, icon="clear_all",
    :class="[expandedMode ? 'bg-primary text-white' : '']")

    // undo
    div.q-pl-sm
      q-btn.q-mt-xs(icon="undo", size="sm", flat, round)

    // redo
    div.q-pl-sm
      q-btn.q-mt-xs(icon="redo", size="sm", flat, round)
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { EventHub } from './EventHub'

  export default {
    data () {
      return {
        groupAnnotationsBy: this.$store.state.swimLaneSettings.groupAnnotationsBy,
        laneMode: this.$store.state.swimLaneSettings.laneMode
      }
    },
    mounted () {
    },
    methods: {
      expand () {
        this.$store.commit('swimLaneSettings/setExpandedMode')
      }
    },
    watch: {
      groupAnnotationsBy (val) {
        this.$store.commit('swimLaneSettings/setType', val)
      },
      laneMode (val) {
        this.$store.commit('swimLaneSettings/setLaneMode', val)
        this.$root.$emit('laneModeChanged', val)
      }
    },
    computed: {
      ...mapGetters({
        options: 'swimLaneSettings/getOptions',
        optionsLaneMode: 'swimLaneSettings/getOptionsLaneMode',
        expandedMode: 'swimLaneSettings/getExpandedMode'
      })
    }
  }
</script>

<style scoped lang="stylus">
  .q-item
    min-height auto!important
</style>
