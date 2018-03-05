<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.piecemaker.groups.create.title') }}
    p.caption(slot="form-caption") {{ $t('routes.piecemaker.groups.create.caption') }}
    edit-group(redirect-to="/stash/groups")
</template>

<script>
  import EditGroup from '../../forms/EditGroup'
  import CenterCardThreeQuarter from '../../../shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      CenterCardThreeQuarter,
      EditGroup
    }
  }
</script>
