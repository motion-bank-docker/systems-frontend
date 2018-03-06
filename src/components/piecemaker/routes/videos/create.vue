<template lang="pug">
  center-card-three-quarter
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.videos.create.title') }}
    p.caption(slot="form-caption") {{ $t('routes.piecemaker.videos.create.caption') }}
    edit-video
    .text-center
      q-btn(@click="$router.push(`/piecemaker/groups/`)") Back to videos
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import EditVideo from '../../forms/EditVideo'
  import CenterCardThreeQuarter from '../../../shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      QBtn,
      EditVideo,
      CenterCardThreeQuarter
    }
  }
</script>
