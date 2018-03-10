<template lang="pug">
  card-full
    span(slot="form-logo")
    h4 Edit group
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
