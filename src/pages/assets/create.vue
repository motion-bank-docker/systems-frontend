<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'assets.list' })", icon="keyboard_backspace", round, small)

    h5.caption(dark) {{ $t('routes.assets.create.title') }}
      .row
        .col-md-12
          uploader(v-if="user", dark, :url="url", @finish="onFinish", :headers="headers", :fields="uploadFields")
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        uploadFields: [],
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      url () {
        return this.user ? `${process.env.ASSETS_HOST}/assets/user-${this.user.uuid}` : undefined
      }
    },
    methods: {
      onFinish (responses) {
        for (let key of Object.keys(responses)) {
          if (responses[key] && responses[key].message) {
            this.$store.commit('notifications/addMessage', {
              body: responses[key].message,
              mode: 'alert',
              type: 'error'
            })
          }
          else {
            this.$store.commit('notifications/addMessage', {
              body: 'messages.asset_created',
              mode: 'alert',
              type: 'success'
            })
            this.$router.push({ name: 'assets.list' })
          }
        }
      }
    }
  }
</script>
