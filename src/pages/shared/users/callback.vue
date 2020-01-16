<template lang="pug">
  .row.fullscreen.vertical-middle.justify-center.items-center
    q-spinner-tail(color="primary", :size="72")
</template>

<script>
  export default {
    props: ['auth'],
    mounted () {
      const _this = this
      this.$auth.handleAuthentication(this.$store).then(({user, first}) => {
        console.debug('Auth0 authenticated user', user)
        _this.$store.commit('notifications/addMessage', {
          body: _this.$t('messages.login_success'),
          type: 'success'
        })
        const redirect = _this.$store.state.auth.redirectUri
        if (redirect && !first) {
          _this.$store.commit('auth/clearRedirect')
          _this.$router.replace(redirect)
        }
        else if (first) _this.$router.replace({name: 'users.manage', params: {isFirst: true}})
        else _this.$router.replace({name: 'site.welcome'})
      }).catch(err => {
        console.error('Auth0 callback error:', err.error || err.message, err.error_description)
        _this.$store.commit('notifications/addMessage', {
          body: err.message,
          type: 'error'
        })
        _this.$router.replace({name: 'site.welcome'})
      })
    }
  }
</script>
