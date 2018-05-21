<template lang="pug">

  div
    // div(v-for="u in usr", :key="ut")
      div(v-for="timeline in u.timelines", :key="timeline")
        div(v-for="tl in timeline", :key="tl") {{ tl }}

    .row(v-for="u in usr", :key="u")

      q-list.col-7.no-border.no-padding.margin-bottom(v-if="sc == 'timeline'")

        q-item.item-hover
          q-item-main ...is allowed to add videos to this timeline.
          q-item-side.text-white
            q-toggle(v-for="ut in u.timelines", v-model="ut.add", :key="ut")

        q-item.item-hover
          q-item-main ...is allowed to edit this timeline.
          q-item-side.text-white
            q-toggle(v-for="ut in u.timelines", v-model="ut.edit", :key="ut")

        q-item.item-hover
          q-item-main ...is allowed to delete this timeline.
          q-item-side.text-white
            q-toggle(v-for="ut in u.timelines", v-model="ut.delete", :key="ut")
        q-item.item-hover
          q-item-main ...is allowed to live annotate this timeline.
          q-item-side.text-white
            q-toggle(v-for="ut in u.timelines", v-model="ut.live_annotate", :key="ut")

      q-list.col-7.no-border.no-padding.margin-bottom(v-if="sc == 'grid'")
        q-item.item-hover
          q-item-main ...is allowed to add videos to this grid.
          q-item-side.text-white
            q-toggle(v-model="toggle")
        q-item.item-hover
          q-item-main ...is allowed to edit this grid.
          q-item-side.text-white
            q-toggle(v-model="toggle")
        q-item.item-hover
          q-item-main ...is allowed to delete this grid.
          q-item-side.text-white
            q-toggle(v-model="toggle")
        q-item.item-hover
          q-item-main ...is allowed to live annotate this grid.
          q-item-side.text-white
            q-toggle(v-model="toggle")

      q-list.col-7.no-border.no-padding.margin-bottom(v-if="sc == 'timeline'")
        q-item.item-hover
          q-item-main ...is allowed to add videos.
          q-item-side.text-white
            q-toggle(v-model="toggle")

        q-item.item-hover
          q-item-main ...is allowed to videos.
          q-item-side.text-white
            q-toggle(v-model="toggle")

        q-item.item-hover
          q-item-main ...is allowed to delete videos.
          q-item-side.text-white
            q-toggle(v-model="toggle")

        q-item.item-hover
          q-item-main ...is allowed to annotate videos.
          q-item-side.text-white
            q-toggle(v-model="toggle")

      q-list.col-7.no-border.no-padding.margin-bottom(v-if="sc == 'timeline' || sc == 'grid'")
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
  export default {
    props: ['user', 'scope'],
    data () {
      return {
        usr: this.user,
        sc: this.scope,
        toggle: true
      }
    }
    // name: "user-rights"
  }
</script>

<style scoped>
  .item-hover:hover {
    background-color: rgba( 255, 255, 255, .1 );
    }
  .margin-bottom {
    margin-bottom: 1rem;
    }
</style>
