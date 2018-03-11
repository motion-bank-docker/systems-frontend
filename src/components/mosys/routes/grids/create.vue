<template lang="pug">
  center-card-three-quarter
    q-btn(slot="backButton", @click="$router.push(`/mosys/grids/`)", icon="keyboard_backspace", round, small)
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.mosys.grids.create.title') }}
    // p.caption(slot="form-caption") {{ $t('routes.mosys.grids.create.caption') }}
    edit-group(redirect-to="/mosys/grids").width-100
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import EditGroup from '../../forms/EditGrid'
  import CenterCardThreeQuarter from '../../../shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      QBtn,
      CenterCardThreeQuarter,
      EditGroup
    }
  }
</script>
