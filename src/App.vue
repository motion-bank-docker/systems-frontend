<template lang="pug">
  #q-app
    animated-background
    q-layout(ref="layout", view="hHh LpR fFf")
      user-nav(slot='header')
      router-view
    mb-notification-service
</template>

<script>
/*
 * Root component
 */
import AnimatedBackground from './components/partials/AnimatedBackground'
import UserNav from './components/partials/UserNav'
import {
  QLayout
} from 'quasar-framework'
export default {
  components: {
    QLayout,
    AnimatedBackground,
    UserNav
  },
  created: function () {
    const store = this.$store
    store.dispatch('auth/authenticate').catch(err => {
      if (err) {
        const message = `${err.message}${err.code ? ' (' + err.code + ')' : ''}`
        if (err.code !== 401) {
          store.commit('notifications/addMessage', {
            body: message, type: 'error'
          })
        }
        else {
          console.debug(err.message)
        }
      }
    })
  }
}
</script>

<style></style>
