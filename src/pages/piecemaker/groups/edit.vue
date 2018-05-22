<template lang="pug">

  card-full
    q-btn(slot="backButton", @click="$router.push(`/piecemaker/groups/`)", icon="keyboard_backspace", round, small)

    span(slot="form-logo")

    span.text-grey-8(slot="form-title") {{ $t('routes.piecemaker.groups.edit.title') }}
    div(slot="form-title") [Timeline-Titel]

    edit-group

</template>

<script>
  import EditGroup from '../../../components/piecemaker/forms/EditGroup'
  import CardFull from '../../../components/shared/layouts/CardFull'

  export default {
    components: {
      EditGroup,
      CardFull
    },
    data () {
      return {
      }
    }
  }
</script>
