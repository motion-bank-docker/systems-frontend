<template lang="pug">
  #q-app
    background
    q-layout(ref="layout", view="hHh LpR fFf")
      user-nav(slot='header')
      router-view
    mb-notification-service
</template>

<script>
/*
 * Root component
 */
import Background from './components/partials/Background'
import UserNav from './components/partials/UserNav'
import { QLayout } from 'quasar-framework'
export default {
  components: {
    QLayout,
    Background,
    UserNav
  }
}
</script>

<style></style>
