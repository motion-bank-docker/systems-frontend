<template lang="pug">
  // center-card-full
  card-full
    div(slot="form-logo")
    div(slot="form-title")
      h4 Piecemaker
    .row.md-gutter.justify-between.items-between
      .col-lg-6
        q-list(highlight, no-border)
          q-list-header
            .row.justify-between.items-between
              h4 Groups
              div
                q-btn(@click="$router.push('/piecemaker/groups')", flat, color="primary") All Groups
                q-btn(@click="$router.push('/piecemaker/groups/create')", flat, color="primary") New Group
          q-item(v-for="item in groups", :key="item.uuid", link, exact, :to="'/piecemaker/groups/' + item.uuid")
            q-item-main
              q-item-tile(label) {{ item.title }}
              q-item-tile(sublabel) {{ item.description }}
      .col-lg-6
        q-list(highlight, no-border)
          q-list-header
            .row.justify-between.items-between
              h4 Videos
          q-item(v-for="item in videos", :key="item.uuid", link, exact, :to="'/piecemaker/videos/' + item.uuid")
            q-item-main
              q-item-tile(label) {{ item.title }}
              q-item-tile(sublabel) {{ item.description }}
</template>

<script>
  import CardFull from '../../components/shared/layouts/CardFull'
  import CenterCardFull from '../../components/shared/layouts/CenterCardFull'
  import constants from '../../lib/constants'
  export default {
    components: {
      CardFull,
      CenterCardFull
    },
    data () {
      return {
        groups: [],
        videos: []
      }
    },
    mounted () {
      const _this = this
      this.$store.dispatch('maps/find', { query: { type: constants.MAP_TYPE_TIMELINE } })
        .then(results => {
          _this.groups = results
        })
      this.$store.dispatch('annotations/find')
        .then(results => {
          _this.videos = results
        })
    }
  }
</script>
