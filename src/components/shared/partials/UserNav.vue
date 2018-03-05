<template lang="pug">
  q-toolbar.z-absolute.all-pointer-events(color="dark")
    // q-btn.hide-on-drawer-visible(flat, icon="menu", @click='$refs.drawer.open()')
    q-toolbar-title(:padding='2')
      q-btn(:class="{ 'text-primary': currentApp === null }", big, flat,
        @click="currentApp = null; $router.push({ name: 'site.welcome' })") Motionbank
      q-btn(:class="{ 'text-primary': currentApp === 'piecemaker' }", big, flat,
        @click="currentApp = 'piecemaker'; $router.push({ name: 'piecemaker.dashboard' })") Piecemaker
      q-btn(:color="currentApp === 'mosys' ? 'primary' : ''",
        big, flat, @click="currentApp = 'mosys'; $router.push({ name: 'mosys.grids.list' })") Mosys

    q-btn(color="primary", flat, icon="settings",
    v-if="user", @click="$router.push(`/users/${$store.state.auth.payload.userId}/edit`)") {{ $t('navigation.manage_account') }}

    q-btn(color="primary", flat, icon="eject",
    v-if="user", @click="logout") {{ $t('navigation.logout') }}

    q-btn(color="primary", flat, icon="arrow_forward",
    v-if="!user", @click="$router.push({ name: 'users.login' })") {{ $t('navigation.login') }}
</template>

<script>
  import {
    QToolbar,
    QToolbarTitle,
    QIcon,
    QBtn
  } from 'quasar-framework'
  export default {
    components: {
      QToolbar,
      QToolbarTitle,
      QIcon,
      QBtn
    },
    data () {
      return {
        currentApp: null
      }
    },
    computed: {
      user () {
        return this.$store.state.auth.payload
      }
    },
    methods: {
      logout () {
        return this.$store.dispatch('auth/logout')
          .then(() => this.$router.replace({ name: 'site.welcome' }))
      }
    }
  }
</script>

<style></style>
