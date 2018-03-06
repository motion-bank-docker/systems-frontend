<template lang="pug">
  center-card-full
    span(slot="form-logo")
    h4 Edit group
    edit-group
    .text-center
      q-btn(@click="$router.push(`/piecemaker/groups/`)") Back to groups
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import EditGroup from '../../forms/EditGroup'
  import CenterCardFull from '../../../shared/layouts/CenterCardFull'
  export default {
    components: {
      QBtn,
      EditGroup,
      CenterCardFull
    }
  }
</script>
