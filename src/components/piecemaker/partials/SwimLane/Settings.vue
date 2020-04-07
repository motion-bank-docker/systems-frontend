<template lang="pug">
  .settings.row.q-pr-xs

    // sort by author/type
    q-btn-dropdown(:label="groupAnnotationsBy", size="xs", flat)
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
    q-btn.flip-vertical.q-ml-xs(
      @click.prevent="event => {expand(event)}",
      ref="expandBtn",
      size="xs",
      flat,
      round,
      icon="clear_all",
      :class="[expandedMode ? 'bg-primary text-white' : '']"
      )

    // FIXME: add buttons later
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
        groupAnnotationsBy: this.$store.state.swimLane.groupAnnotationsBy,
        laneMode: this.$store.state.swimLane.laneMode
      }
    },
    mounted () {
    },
    methods: {
      expand () {
        // prevents the button from beeing focused.
        // otherwise interferes with using space to select
        // the viewport of the swim lane after it has been clicked
        this.$refs.expandBtn.$el.blur()
        // FIXME: prevent button from getting focused. Pressing space after click toggles it again. preventDefault does not work.
        this.$store.commit('swimLane/setExpandedMode')
      }
    },
    watch: {
      groupAnnotationsBy (val) {
        this.$store.commit('swimLane/setType', val)
      },
      laneMode (val) {
        this.$store.commit('swimLane/setLaneMode', val)
        this.$root.$emit('laneModeChanged', val)
      }
    },
    computed: {
      ...mapGetters({
        options: 'swimLane/getOptions',
        optionsLaneMode: 'swimLane/getOptionsLaneMode',
        expandedMode: 'swimLane/getExpandedMode'
      })
    }
  }
</script>

<style scoped lang="stylus">
  .q-item
    min-height auto !important
</style>
