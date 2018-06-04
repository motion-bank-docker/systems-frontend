<template lang="pug">
  q-toolbar(color="dark")
    // q-btn.hide-on-drawer-visible(flat, icon="menu", @click='$refs.drawer.open()')
    q-toolbar-title(:padding='2')
      //q-btn(:class="{ 'text-primary': currentApp === null }", big, flat,
        @click="currentApp = null; $router.push({ name: 'site.welcome' })") Motionbank
      q-btn(
        :class="{ 'text-primary': currentApp === 'piecemaker' }",
        @click="currentApp = 'piecemaker'; $router.push({ name: 'piecemaker.groups.list' })",
        big, flat
        ) Piecemaker
      q-btn(
        :color="currentApp === 'mosys' ? 'primary' : ''",
        @click="currentApp = 'mosys'; $router.push({ name: 'mosys.grids.list' })",
        big, flat
        ) Mosys
      q-btn(
        :color="currentApp === 'site.account' ? 'primary' : ''",
        @click="currentApp = 'site.account'; $router.push({ name: 'site.account' })",
        big, flat
        ) Account
      q-btn(
        :color="currentApp === 'site.help' ? 'primary' : ''",
        @click="currentApp = 'site.help'; $router.push({ name: 'site.help' })",
        big, flat
        ) Help

    q-btn(color="primary", flat, icon="help",
    v-if="user")

    q-btn(color="primary", flat, icon="settings",
    v-if="user", @click="$router.push({ name: 'users.manage', params: { id: 'me' } })") {{ user.name }}

    q-btn(color="primary", flat, icon="eject",
      v-if="user", @click="logout") {{ $t('navigation.logout') }}

    q-btn(color="primary", flat, icon="arrow_forward",
      v-if="!user", @click="login") {{ $t('navigation.login') }}
</template>

<script>
  export default {
    data () {
      return {
        currentApp: null,
        user: undefined
      }
    },
    mounted () {
      const _this = this
      this.$auth.on('auth-state', user => {
        _this.user = user
        console.debug('Auth0 state change', _this.$auth.hasScope('openid'))
      })
      this.$auth.checkSession()
    },
    methods: {
      login () {
        this.$auth.authenticate()
      },
      logout () {
        this.$auth.logout()
      }
    }
  }
</script>

<style></style>
