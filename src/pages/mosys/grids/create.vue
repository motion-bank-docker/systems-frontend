<template lang="pug">
  center-card-three-quarter
    q-btn(
      slot="backButton",
      @click="$router.push(`/mosys/grids/`)",
      icon="keyboard_backspace",
      round, small,
      style="position: absolute; top: calc(50px + 2rem); left: 2rem;"
      )
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.mosys.grids.create.title') }}
    // p.caption(slot="form-caption") {{ $t('routes.mosys.grids.create.caption') }}
    edit-group(redirect-to="/mosys/grids").width-100
</template>

<script>
  import EditGroup from '../../../components/mosys/forms/EditGrid'
  import CenterCardThreeQuarter from '../../../components/shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      CenterCardThreeQuarter,
      EditGroup
    }
  }
</script>
