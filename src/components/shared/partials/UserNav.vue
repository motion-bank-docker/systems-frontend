<template lang="pug">
  q-toolbar.z-absolute.all-pointer-events(color="dark")
    // q-btn.hide-on-drawer-visible(flat, icon="menu", @click='$refs.drawer.open()')
    q-toolbar-title(:padding='2')
      q-btn(:class="{ 'text-primary': currentApp === null }", big, flat,
        @click="currentApp = null; $router.push({ name: 'site.welcome' })") Motionbank
      q-btn(:class="{ 'text-primary': currentApp === 'piecemaker' }", big, flat,
        @click="currentApp = 'piecemaker'; $router.push({ name: 'piecemaker.groups.list' })") Piecemaker
      q-btn(:color="currentApp === 'mosys' ? 'primary' : ''",
        big, flat, @click="currentApp = 'mosys'; $router.push({ name: 'mosys.grids.list' })") Mosys

    q-btn(color="primary", flat, icon="settings",
    v-if="authenticated", @click="$router.push({ name: 'users.edit', params: { id: 'me' } })") {{ $t('navigation.manage_account') }}

    q-btn(color="primary", flat, icon="eject",
    v-if="authenticated", @click="logout") {{ $t('navigation.logout') }}

    q-btn(color="primary", flat, icon="arrow_forward",
    v-if="!authenticated", @click="login") {{ $t('navigation.login') }}
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
    props: ['authenticated', 'auth'],
    data () {
      return {
        currentApp: null
      }
    },
    methods: {
      login () {
        if (this.$mbConf.app.useAuth0) {
          this.$mbAuth().login()
        }
        else {
          this.$router.push({ name: 'users.login' })
        }
      },
      logout () {
        this.$mbAuth().logout(this.$store)
      }
    }
  }
</script>

<style></style>
