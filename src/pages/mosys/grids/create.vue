<template lang="pug">
  // center-card-three-quarter
  card-full
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
  import CardFull from '../../../components/shared/layouts/CardFull'
  export default {
    components: {
      CardFull,
      CenterCardThreeQuarter,
      EditGroup
    }
  }
</script>
