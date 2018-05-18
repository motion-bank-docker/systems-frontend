<template lang="pug">
  //div
  card-full
    q-btn(slot="backButton", @click="$router.push('/mosys/grids')", icon="keyboard_backspace", round, small)
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.mosys.grids.edit.title') }}
    edit-grid
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import CardFull from '../../../shared/layouts/CardFull'
  import EditGrid from '../../forms/EditGrid'
  export default {
    components: {
      QBtn,
      EditGrid,
      CardFull
    }
  }
</script>
