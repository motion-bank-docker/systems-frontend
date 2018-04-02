<template lang="pug">
  #q-app
    animated-background
    q-layout(ref="layout", view="hHh LpR fFf")
      user-nav(slot="header", :login="login", :auth="auth", :authenticated="authenticated")
      router-view(:auth="auth", :authenticated="authenticated")
</template>

<script>
/*
 * Root component
 */
import AnimatedBackground from './components/shared/partials/AnimatedBackground'
import UserNav from './components/shared/partials/UserNav'
import {
  QLayout
} from 'quasar-framework'

import * as auth0Conf from '../auth0.json'
import Auth0 from './lib/services/auth0'

const auth = new Auth0(auth0Conf)
const { login, logout, authenticated, authNotifier } = auth

export default {
  data () {
    authNotifier.on('authChange', authState => {
      console.log('authChange', authState)
      this.authenticated = authState.authenticated
    })
    return {
      auth,
      authenticated
    }
  },
  methods: {
    login,
    logout,
    isAuthenticated () {
      return this.authenticated
    }
  },
  components: {
    QLayout,
    AnimatedBackground,
    UserNav
  },
  created: function () {
    /*
    const { $store } = this
    $store.dispatch('auth/authenticate')
      .catch(err => {
        if (err) {
          console.debug(err.message)
          const message = `${err.message}${err.code ? ' (Code: ' + err.code + ')' : ''}`
          if (err.code !== 401) {
            $store.commit('notifications/addMessage', {
              body: message,
              type: 'error'
            })
          }
        }
      })
      */
  }
}
</script>
