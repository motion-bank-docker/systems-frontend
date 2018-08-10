<template lang="pug">

  card-full

    q-btn(slot="backButton", @click="$router.push(`/piecemaker/timelines/`)", icon="keyboard_backspace", round, small)

    span(slot="form-logo")

    div.opacity-5(slot="form-title") [Timeline-Titel]
    div(slot="form-title") [User-Name]

    template(v-for="u in user")
      .row
        q-list.col-7.no-border.no-padding(style="margin-bottom: 1rem;")
          q-item.item-hover
            q-item-main ...is allowed to add videos to this timeline.
            q-item-side.text-white
              q-toggle(v-model="toggle")
          q-item.item-hover
            q-item-main ...is allowed to edit this timeline.
            q-item-side.text-white
              q-toggle(v-model="toggle")
          q-item.item-hover
            q-item-main ...is allowed to delete this timeline.
            q-item-side.text-white
              q-toggle(v-model="toggle")
          q-item.item-hover
            q-item-main ...is allowed to live annotate this timeline.
            q-item-side.text-white
              q-toggle(v-model="toggle")

        q-list.col-7.no-border.no-padding(style="margin-bottom: 1rem;")
          q-item.item-hover
            q-item-main ...is allowed to add videos.
            q-item-side.text-white
              q-toggle(v-model="toggle")

          q-item.item-hover
            q-item-main ...is allowed to edit this video.
            q-item-side.text-white
              q-toggle(v-model="toggle")

          q-item.item-hover
            q-item-main ...is allowed to delete videos.
            q-item-side.text-white
              q-toggle(v-model="toggle")

          q-item.item-hover
            q-item-main ...is allowed to annotate this video.
            q-item-side.text-white
              q-toggle(v-model="toggle")

        q-list.col-7.no-border.no-padding(style="margin-bottom: 1rem;")

          q-item.item-hover
            q-item-main ...is allowed to add new users.
            q-item-side.text-white
              q-toggle(v-model="toggle")
          q-item.item-hover
            q-item-main ...is allowed to add remove users.
            q-item-side.text-white
              q-toggle(v-model="toggle")

        .col-7.text-right(style="border-top: 1px solid white; padding-top: 1rem;")
          q-btn save changes

</template>

<script>
  import CardFull from 'mbjs-quasar/src/components/layouts/CardFull'
  export default {
    components: {
      CardFull
    },
    data () {
      return {
        toggle: true,
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
