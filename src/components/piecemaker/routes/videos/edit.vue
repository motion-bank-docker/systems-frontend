<template lang="pug">
  // center-card-full
  card-full
    span(slot="form-logo")
    h4 {{ $t('routes.piecemaker.videos.edit.title') }}
    .text-right
      q-btn(@click="$router.push(`/mosys/codarts/sync`)" color="primary") {{ $t('buttons.synchronize') }}

    // tagging
    edit-video
    .text-center
      q-btn(@click="$router.push(`/piecemaker/groups/`)" icon="keyboard_backspace") {{ $t('buttons.back') }}
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import Tagging from '../../../mosys/routes/codarts/tagging'
  import EditVideo from '../../forms/EditVideo'
  // import CenterCardFull from '../../../shared/layouts/CenterCardFull'
  import CardFull from '../../../shared/layouts/CardFull'
  export default {
    components: {
      QBtn,
      Tagging,
      EditVideo,
      // CenterCardFull
      CardFull
    }
  }
</script>
