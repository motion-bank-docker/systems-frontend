<template lang="pug">
  //.settings
  .row
    div.q-pl-sm
      | Group annotations by:&nbsp;
      q-btn-toggle.bg-grey-8.q-ma-xs(
        v-model="groupAnnotationsBy",
        toggle-color="primary",
        :options="options",
        size="sm", rounded
        )
    div.q-pl-sm.q-ml-md
      | Lane mode:&nbsp;
      q-btn-toggle.bg-grey-8.q-ma-xs(
        v-model="laneMode",
        toggle-color="primary",
        :options="optionsLaneMode",
        size="sm", rounded
        )
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

</style>
