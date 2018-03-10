<template lang="pug">

  card-full
    q-btn(slot="backButton", @click="$router.push('/piecemaker/groups/' + groupId + '/videos')", icon="keyboard_backspace", small, round)
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.videos.edit.title') }}

    edit-video

    tags(v-if="$route.params.id", :targetUuid="$route.params.id")

</template>

<script>
  import { QBtn } from 'quasar-framework'
  import EditVideo from '../../forms/EditVideo'
  import CardFull from '../../../shared/layouts/CardFull'
  import Tags from '../../../shared/partials/Tags'

  export default {
    components: {
      QBtn,
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
