<template lang="pug">
  center-card-three-quarter
    q-btn(
      slot="backButton",
      @click="$router.push(`/piecemaker/groups/`)",
      icon="keyboard_backspace",
      round, small,
      style="position: absolute; top: calc(50px + 2rem); left: 2rem;"
      )
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.groups.create.title') }}
    // p.caption(slot="form-caption") {{ $t('routes.piecemaker.groups.create.caption') }}
    edit-group(redirect-to="/piecemaker/groups").width-100

</template>

<script>
  import EditGroup from '../../../components/piecemaker/forms/EditGroup'
  import CenterCardThreeQuarter from '../../../components/shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      CenterCardThreeQuarter,
      EditGroup
    }
  }
</script>

<style>
</style>
