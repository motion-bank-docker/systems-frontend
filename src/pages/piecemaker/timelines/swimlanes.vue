<template lang="pug">
  full-screen
    // headline
    //
    .row.q-mb-xl(v-if="map")
      .col-10.offset-1(slot="form-title")
        h5.no-margin.text-center
          div {{ map.title }}
          .text-grey-8 {{ map.author.name }}

    // btn: back
    q-btn.absolute-top-left(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small, style="top: 66px; left: 16px;")

    swim-lane(v-if="map", :timelineUuid="map._uuid", :markerDetails="true",
    @emitToggleDetails="onToggleDetails", :visibilityDetails="visibilityDetails", :key="visibilityDetails")
</template>

<script>
  import SwimLane from '../../../components/piecemaker/partials/SwimLane/SwimLane'

  export default {
    components: {
      SwimLane
    },
    async mounted () {
      this.map = await this.$store.dispatch('maps/get', this.$route.params.uuid)
    },
    data () {
      return {
        map: undefined,
        visibilityDetails: undefined
      }
    },
    methods: {
      onToggleDetails (val) {
        console.log(val)
        this.visibilityDetails = val
      }
    }
  }
</script>
