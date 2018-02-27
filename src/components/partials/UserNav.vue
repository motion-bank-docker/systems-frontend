<template lang="pug">
  q-toolbar.z-absolute.all-pointer-events(color="dark")
    // q-btn.hide-on-drawer-visible(flat, icon="menu", @click='$refs.drawer.open()')
    q-toolbar-title(:padding='2')
      q-btn(big, flat, @click="$router.push({ name: 'site.apps' })") Motionbank
      q-btn(big, flat, @click="$router.push({ name: 'piecemaker.list' })") Piecemaker
        // | {{ $t('site.title') }}
      q-btn(big, flat, @click="$router.push({ name: 'mosys.dashboard' })") Mosys

    q-btn(color="primary", flat, icon="list",
    v-if="user", @click="$router.push(`/maps`)") {{ $t('navigation.maps') }}

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
      return {}
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
