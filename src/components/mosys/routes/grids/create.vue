<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.mosys.grids.create.title') }}
    p.caption(slot="form-caption") {{ $t('routes.mosys.grids.create.caption') }}
    edit-group(redirect-to="/mosys/grids")
</template>

<script>
  import EditGroup from '../../forms/EditGrid'
  import CenterCardThreeQuarter from '../../../shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      CenterCardThreeQuarter,
      EditGroup
    }
  }
</script>
