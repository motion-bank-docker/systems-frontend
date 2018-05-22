<template lang="pug">

  card-full
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.groups.list.title') }}
    // p.caption(slot="form-caption") {{ $t('routes.piecemaker.groups.list.caption') }}

    p
      q-btn(
        v-if="userType === 'admin' || userType === 'editor'",
        @click="$router.push({ name: 'piecemaker.groups.create' })",
        color="primary"
        ) {{ $t('buttons.create_group') }}

    group-list

</template>

<script>
  import CardFull from '../../../components/shared/layouts/CardFull'
  import GroupList from '../../../components/piecemaker/partials/GroupsList'

  export default {
    components: {
      CardFull,
      GroupList
    },
    data () {
      return {
        userType: 'admin'
      }
    }
  }
</script>
