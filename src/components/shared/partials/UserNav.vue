<template lang="pug">
  q-toolbar(color="dark")
    // q-btn.hide-on-drawer-visible(flat, icon="menu", @click='$refs.drawer.open()')
    q-toolbar-title(:padding='2')
      //q-btn(:class="{ 'text-primary': currentApp === null }", big, flat,
        @click="currentApp = null; $router.push({ name: 'site.welcome' })") Motionbank
      q-btn(
        :class="{ 'text-primary': currentApp === 'piecemaker' }",
        @click="currentApp = 'piecemaker'; $router.push({ name: 'piecemaker.timelines.list' })",
        big, flat
        ) Piecemaker
      q-btn(
        v-if="staging",
        :color="currentApp === 'mosys' ? 'primary' : ''",
        @click="currentApp = 'mosys'; $router.push({ name: 'mosys.grids.list' })",
        big, flat
        ) Mosys
      //q-btn(
        // :color="currentApp === 'site.account' ? 'primary' : ''",
        @click="currentApp = 'site.account'; $router.push({ name: 'site.account' })",
        big, flat
        ) Account
      // q-btn(
        // :color="currentApp === 'site.help' ? 'primary' : ''",
        @click="currentApp = 'site.help'; $router.push({ name: 'site.help' })",
        big, flat
        ) Help

    //
      q-btn(color="primary", flat, icon="help",
      @click="currentApp = 'site.help'; $router.push({ name: 'site.help' })",
      v-if="userState")

    //
      q-btn(color="primary", flat,
      @click="currentApp = 'site.imprint'; $router.push({ name: 'site.imprint' })",
      v-if="userState") {{ $t('navigation.imprint') }}

    q-btn(color="primary", flat, icon="settings",
    v-if="userState", @click="$router.push({ name: 'users.manage', params: { id: 'me' } })") {{ userState.name }}

    q-btn(color="primary", flat, icon="eject",
      v-if="userState", @click="logout") {{ $t('navigation.logout') }}

    q-btn(color="primary", flat, icon="arrow_forward",
      v-if="!userState", @click="login") {{ $t('navigation.login') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        staging: process.env.IS_STAGING,
        currentApp: null
      }
    },
    computed: {
      ...mapGetters({
        userState: 'auth/getUserState'
      })
    },
    methods: {
      login () {
        this.$auth.authenticate()
      },
      logout () {
        this.$store.commit('auth/setUser', undefined)
        this.$auth.logout()
      }
    }
  }
</script>

<style></style>
