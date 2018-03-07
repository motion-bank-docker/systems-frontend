<template lang="pug">
  center-card-full
    span(slot="form-logo")
    h4 Edit group
    edit-group
    tagging
      q-btn(slot="tagging-buttons") Generate Grid from selected
    .text-center
      q-btn(@click="$router.push(`/piecemaker/groups/`)") Back to groups
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import Tagging from '../../../mosys/routes/codarts/tagging'
  import EditGroup from '../../forms/EditGroup'
  import CenterCardFull from '../../../shared/layouts/CenterCardFull'
  export default {
    components: {
      QBtn,
      EditGroup,
      Tagging,
      CenterCardFull
    }
  }
</script>
