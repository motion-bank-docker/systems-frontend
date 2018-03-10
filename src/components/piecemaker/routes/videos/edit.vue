<template lang="pug">

  card-full
    span(slot="form-logo")
    h4 {{ $t('routes.piecemaker.videos.edit.title') }}

    edit-video

    tags(v-if="$route.params.id", :targetUuid="$route.params.id")

    .text-center
      q-btn(@click="$router.push(`/piecemaker/groups`)" icon="keyboard_backspace") {{ $t('buttons.back') }}
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import EditVideo from '../../forms/EditVideo'
  import CardFull from '../../../shared/layouts/CardFull'
  import Tags from '../../../shared/partials/Tags'

  export default {
    components: {
      QBtn,
      Tags,
      EditVideo,
      CardFull
    }
  }
</script>
