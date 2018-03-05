<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.piecemaker.videos.create.title') }}
    p.caption(slot="form-caption") {{ $t('routes.piecemaker.videos.create.caption') }}
    edit-video
</template>

<script>
  import EditVideo from '../../forms/EditVideo'
  import CenterCardThreeQuarter from '../../../shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      EditVideo,
      CenterCardThreeQuarter
    }
  }
</script>
