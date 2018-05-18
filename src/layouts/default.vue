<template lang="pug">
  q-layout(view='hHh LpR fFf')
    q-layout-header
      user-nav(:login="login", :auth="auth", :authenticated="authenticated")
    q-page-container
      router-view
</template>

<script>
  import UserNav from '../components/shared/partials/UserNav'
  import { EVENT_AUTH_CHANGE } from '../plugins/mb-auth'

  export default {
    name: 'LayoutDefault',
    components: {
      UserNav
    },
    data () {
      const
        _this = this,
        { auth, authenticated } = this.$mbAuth()

      this.$mbAuth().on(EVENT_AUTH_CHANGE, authState => {
        _this.authenticated = authState.authenticated
      })

      this.$mbAuth().checkSession(this.$store).then(res => {
        if (res) console.debug('Existing auth session:', res)
        return res
      }).catch(err => {
        console.debug('No existing auth session:',
          err.error || err.message, err.error_description)
      })

      return {
        auth,
        authenticated
      }
    },
    methods: {
      login () {
        this.$mbAuth().login()
      },
      logout () {
        this.$mbAuth().logout(this.$store)
      }
    }
  }
</script>

<style>
</style>
