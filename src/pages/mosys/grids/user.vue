<template lang="pug">

  card-full

    q-btn(slot="backButton", @click="$router.push(`/mosys/grids/`)", icon="keyboard_backspace", round, small)

    span(slot="form-logo")

    div.text-grey-7(slot="form-title") [Grid-Titel]
    div(slot="form-title") [User-Name]

    user-rights(
      :scope="scope"
      )

</template>

<script>
  import {
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QItemSeparator,
    QToggle
  } from 'quasar-framework'
  import CardFull from '../../../shared/layouts/CardFull'
  import userRights from '../../../shared/partials/UserRights'
  export default {
    components: {
      QBtn,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemSeparator,
      QToggle,
      CardFull,
      userRights
    },
    data () {
      return {
        toggle: true,
        scope: 'grid',
        user: [{
          user_name: 'Bill Gates',
          timelines: [{
            add: { val: true },
            edit: { val: true },
            delete: { val: true },
            annotate: { val: null },
            live_annotate: { val: false }
          }],
          videos: [{
            add: { val: false },
            edit: { val: true },
            delete: { val: false },
            annotate: { val: true },
            live_annotate: { val: null }
          }],
          users: [{
            add: { val: false },
            edit: { val: true },
            delete: { val: false },
            annotate: { val: null },
            live_annotate: { val: null }
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

  .opacity-5 {
    opacity: .5;
    }

  .item-hover:hover {
    background-color: rgba( 255, 255, 255, .1 );
    }

</style>
