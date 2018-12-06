<template lang="pug">
  q-toolbar(color="dark")
    // q-btn.hide-on-drawer-visible(flat, icon="menu", @click='$refs.drawer.open()')
    q-toolbar-title(:padding='2')
      //q-btn(:class="{ 'text-primary': currentApp === null }", big, flat,
        @click="currentApp = null; $router.push({ name: 'site.welcome' })") Motionbank
      q-btn(
        :class="{ 'text-primary': currentApp === 'piecemaker' }",
        @click="executeApp('piecemaker', 'piecemaker.timelines.list')",
        big, flat
        ) Piecemaker
      q-btn(
        :color="currentApp === 'mosys' ? 'primary' : ''",
        @click="executeApp('mosys', 'mosys.grids.list')",
        big, flat
        ) Mosys

    q-btn(color="primary", flat, icon="settings",
    v-if="userState", @click="$router.push({ name: 'users.manage' })") {{ userState.profile ? userState.profile.name : '' }}

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
        currentApp: null,
        env: process.env
      }
    },
    computed: {
      ...mapGetters({
        userState: 'auth/getUserState'
      })
    },
    methods: {
      executeApp (appName, routeName) {
        this.currentApp = appName
        this.$router.push({ name: routeName })
      },
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
