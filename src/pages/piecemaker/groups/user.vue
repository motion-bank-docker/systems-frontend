<template lang="pug">

  card-full

    q-btn(slot="backButton", @click="$router.push(`/piecemaker/groups/`)", icon="keyboard_backspace", round, small)

    span(slot="form-logo")

    div.text-grey-7(slot="form-title") [Timeline-Titel]
    div(v-for="u in user" slot="form-title") {{ u.user_name }}

    user-rights(
      :user="user",
      :scope="scope"
      )

</template>

<script>
  import CardFull from '../../../components/shared/layouts/CardFull'
  import UserRights from '../../../components/shared/partials/UserRights'
  export default {
    components: {
      CardFull,
      UserRights
    },
    data () {
      return {
        toggle: true,
        scope: 'timeline',
        user: [{
          user_name: 'Bill Gates',
          timelines: [{
            add: false,
            edit: true,
            delete: true,
            annotate: null,
            live_annotate: false
          }],
          videos: [{
            add: false,
            edit: true,
            delete: false,
            annotate: true,
            live_annotate: null
          }],
          users: [{
            add: false,
            edit: true,
            delete: false,
            annotate: null,
            live_annotate: null
          }],
          meta: [{
            created: '2018-02-02',
            mail: 'test@abc.com'
          }],
          changed: false
        }]
      }
    }
    // name: 'edit'
  }
</script>

<style scoped>
</style>
