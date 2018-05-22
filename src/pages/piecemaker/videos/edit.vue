<template lang="pug">

  card-full
    q-btn(slot="backButton", @click="$router.push('/piecemaker/groups/' + groupId + '/videos')", icon="keyboard_backspace", small, round)
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.videos.edit.title') }}

    .row
      .col-6.padding-1em
        tags(v-if="$route.params.id", :targetUuid="$route.params.id")
      .col-6.padding-1em
        edit-video.col-6

</template>

<script>
  import EditVideo from '../../../components/piecemaker/forms/EditVideo'
  import CardFull from '../../../components/shared/layouts/CardFull'
  import Tags from '../../../components/shared/partials/Tags'

  export default {
    components: {
      Tags,
      EditVideo,
      CardFull
    },
    data () {
      return {
        groupId: ''
      }
    },
    mounted () {
      this.fetchGroupId()
    },
    methods: {
      fetchGroupId () {
        const _this = this
        this.$store.dispatch('annotations/find', {query: {'uuid': this.$route.params.id}})
          .then(v => {
            _this.groupId = v.shift().target.id
          })
      }
    }
  }
</script>
