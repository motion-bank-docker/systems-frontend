<template lang="pug">
  .row.fullscreen.vertical-middle.justify-center.items-center
    q-spinner-tail(color="primary", :size="72")
</template>

<script>
  import * as Sentry from '@sentry/browser'
  export default {
    props: ['auth'],
    async mounted () {
      try {
        const { user, first } = await this.$auth.handleAuthentication(this.$store)
        // if (process.env.SENTRY_DSN) {
        //   Sentry.setUser({ email: user.email, id: user.id, username: user.profile.name })
        // }
        console.debug('Authenticated user', user, first)
        this.$store.commit('notifications/addMessage', {
          body: this.$t('messages.login_success'),
          type: 'success'
        })
        const redirect = this.$store.state.auth.redirectUri
        if (redirect && !first) {
          this.$store.commit('auth/clearRedirect')
          this.$router.replace(redirect)
        }
        else if (first) this.$router.replace({name: 'users.manage', params: {isFirst: true}})
        else this.$router.replace({name: 'site.welcome'})
      }
      catch (err) {
        console.error('Auth0 callback error:', err)
        this.$store.commit('notifications/addMessage', {
          body: err.message,
          type: 'error'
        })
        this.$router.replace({name: 'site.welcome'})
      }
    }
  }
</script>
