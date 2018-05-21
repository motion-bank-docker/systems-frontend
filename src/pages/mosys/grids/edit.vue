<template lang="pug">
  //div
  card-full
    q-btn(slot="backButton", @click="$router.push('/mosys/grids')", icon="keyboard_backspace", round, small)
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.mosys.grids.edit.title') }}
    edit-grid
</template>

<script>
  import CardFull from '../../../components/shared/layouts/CardFull'
  import EditGrid from '../../../components/mosys/forms/EditGrid'
  export default {
    components: {
      EditGrid,
      CardFull
    }
  }
</script>
