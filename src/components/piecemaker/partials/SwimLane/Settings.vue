<template lang="pug">
  //.settings
  .row
    div
      <!--| Group annotations by:&nbsp;-->
      <!--q-tooltip.bg-grey-9 Group annotations by-->
      <!--q-popover(@mouseover.native="toggleSettingsPopover()")-->
      //  q-list
      //    q-item(v-for="(g, i) in groupAnnotationsBy") {{ groupAnnotationsBy[i] }}
      //
        q-btn-toggle.bg-grey-8.q-ma-xs(
          v-model="groupAnnotationsBy",
          toggle-color="primary",
          // :options="options",
          size="sm"
          )
      q-btn-dropdown.q-mt-xs.bg-grey-9(:label="groupAnnotationsBy", size="sm", flat)
        q-list.q-py-none
          q-item.cursor-pointer(v-for="o in options", :key="o.value",
          @click.native="groupAnnotationsBy = o.value", v-close-overlay) {{ o.label }}
        <!--q-btn.q-ma-none(v-for="o in options", @click="groupAnnotationsBy = o.value", flat, size="sm") {{ o.label }}-->

    div.q-pl-sm
      <!--| Lane mode:&nbsp;-->
      //
        q-tooltip.bg-grey-9 Lane mode
        q-btn-toggle.bg-grey-8.q-ma-xs(
          v-model="laneMode",
          toggle-color="primary",
          // :options="optionsLaneMode",
          size="sm"
          )
      q-btn-dropdown.q-mt-xs.bg-grey-9(:label="laneMode", size="sm", flat)
        q-list.q-py-none
          q-item.cursor-pointer(v-for="o in optionsLaneMode", :key="o.value",
          @click.native="laneMode = o.value", v-close-overlay) {{ o.label }}
    // undo
    div.q-pl-sm
      q-btn.q-mt-xs.bg-grey-9(icon="undo", size="sm", flat)
    // redo
    div.q-pl-sm
      q-btn.q-mt-xs.bg-grey-9(icon="redo", size="sm", flat)
</template>

<script>
  import { mapGetters } from 'vuex'
  import { EventHub } from './EventHub'

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
        EventHub.$emit('laneModeChanged', val)
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

</style>
