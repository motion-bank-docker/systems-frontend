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
      q-btn(v-if="userHasAssets",
        :color="currentApp === 'assets' ? 'primary' : ''",
        @click="executeApp('assets', 'assets.list')",
        big, flat
        ) Assets

    q-btn(color="primary", flat, icon="settings",
    v-if="user", @click="$router.push({ name: 'users.manage' })") {{ user.profile ? user.profile.name : '' }}

    q-btn(color="primary", flat, icon="eject",
      v-if="user", @click="logout") {{ $t('navigation.logout') }}

    q-btn(color="primary", flat, icon="arrow_forward",
      v-if="!user", @click="login") {{ $t('navigation.login') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import userHasFeature from '../../../lib/user-has-feature'

  export default {
    data () {
      return {
        currentApp: null,
        env: process.env
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      userHasAssets () {
        return userHasFeature(this.user, 'assets')
      }
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
