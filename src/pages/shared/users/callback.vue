<template lang="pug">
  .row.fullscreen.vertical-middle.justify-center.items-center
    q-spinner-tail(color="primary", :size="72")
</template>

<script>
  export default {
    props: ['auth'],
    mounted () {
      const _this = this
      this.$mbAuth().handleAuthentication().then(() => {
        _this.$store.commit('notifications/addMessage', {
          body: _this.$t('messages.login_success'),
          type: 'success'
        })
        _this.$router.replace({ name: 'users.edit', params: { id: 'me' } })
      }).catch(err => {
        console.debug('Auth0 callback error:', err.error || err.message, err.error_description)
        _this.$store.commit('notifications/addMessage', {
          body: err.message,
          type: 'error'
        })
        _this.$router.replace({ name: 'site.welcome' })
      })
    }
  }
</script>
