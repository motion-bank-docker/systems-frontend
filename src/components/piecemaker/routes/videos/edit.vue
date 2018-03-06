<template lang="pug">
  center-card-full
    span(slot="form-logo")
    h4 Edit video
    edit-video
    .text-center
      q-btn(@click="$router.push(`/piecemaker/groups/`)") Back to groups
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import EditVideo from '../../forms/EditVideo'
  import CenterCardFull from '../../../shared/layouts/CenterCardFull'
  export default {
    components: {
      QBtn,
      EditVideo,
      CenterCardFull
    }
  }
</script>
