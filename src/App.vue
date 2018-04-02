<template lang="pug">
  #q-app
    q-layout(ref="layout", view="hHh LpR fFf")
      user-nav(slot="header", :login="login", :auth="auth", :authenticated="authenticated")
      router-view(:auth="auth", :authenticated="authenticated")
</template>

<script>
/*
 * Root component
 */
import UserNav from './components/shared/partials/UserNav'
import { EVENT_AUTH_CHANGE } from './lib/services/auth'
import {
  QLayout
} from 'quasar-framework'

export default {
  data () {
    const
      _this = this,
      { auth, authenticated } = _this.$authService()

    this.$authService().on(EVENT_AUTH_CHANGE, authState => {
      _this.authenticated = authState.authenticated
    })

    this.$authService().checkSession(this.$store).then(res => {
      console.debug('Existing session:', res)
    }).catch(err => {
      console.debug('No session:',
        err.error || err.message, err.error_description)
    })

    return {
      auth,
      authenticated
    }
  },
  methods: {
    login () {
      this.$authService().login()
    },
    logout () {
      this.$authService().logout(this.$store)
    }
  },
  components: {
    QLayout,
    UserNav
  }
}
</script>
