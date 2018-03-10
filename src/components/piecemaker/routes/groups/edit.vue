<template lang="pug">
  card-full
    q-btn(slot="backButton", @click="$router.push(`/piecemaker/groups/`)", icon="keyboard_backspace", round, small)
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.groups.edit.title') }}
    edit-group
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import EditGroup from '../../forms/EditGroup'
  import CardFull from '../../../shared/layouts/CardFull'

  export default {
    components: {
      QBtn,
      EditGroup,
      CardFull
    }
  }
</script>
