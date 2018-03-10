<template lang="pug">
  card-full
    span(slot="form-logo")
    h4 {{ $t('routes.piecemaker.groups.edit.title') }}
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
