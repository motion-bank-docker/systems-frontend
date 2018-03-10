<template lang="pug">
  center-card-three-quarter
    q-btn(slot="backButton", @click="$router.push(`/piecemaker/groups/`)", icon="keyboard_backspace", round, small)
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.groups.create.title') }}
    p.caption(slot="form-caption") {{ $t('routes.piecemaker.groups.create.caption') }}
    edit-group(redirect-to="/piecemaker/groups")

</template>

<script>
  import { QBtn } from 'quasar-framework'
  import EditGroup from '../../forms/EditGroup'
  import CenterCardThreeQuarter from '../../../shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      QBtn,
      CenterCardThreeQuarter,
      EditGroup
    }
  }
</script>
