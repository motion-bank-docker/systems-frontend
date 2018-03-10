<template lang="pug">
  card-full
    span(slot="form-logo")
    h4 Edit group
    edit-group
    // tagging
      q-btn(slot="tagging-buttons") Generate Grid from selected
    .text-center
      q-btn(@click="$router.push(`/piecemaker/groups/`)" icon="keyboard_backspace") {{ $t('buttons.back') }}
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import Tagging from '../../../mosys/routes/codarts/tagging'
  import EditGroup from '../../forms/EditGroup'
  // import CenterCardFull from '../../../shared/layouts/CenterCardFull'
  import CardFull from '../../../shared/layouts/CardFull'

  export default {
    components: {
      QBtn,
      EditGroup,
      Tagging,
      // CenterCardFull
      CardFull
    }
  }
</script>
