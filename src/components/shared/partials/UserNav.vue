<template lang="pug">
  q-toolbar(color="dark")
    // q-btn.hide-on-drawer-visible(flat, icon="menu", @click='$refs.drawer.open()')
    q-toolbar-title(:padding='2')
      q-btn(:class="{ 'text-primary': currentApp === null }", big, flat,
        @click="currentApp = null; $router.push({ name: 'site.welcome' })") Motionbank
      q-btn(:class="{ 'text-primary': currentApp === 'piecemaker' }", big, flat,
        @click="currentApp = 'piecemaker'; $router.push({ name: 'piecemaker.groups.list' })") Piecemaker
      q-btn(:color="currentApp === 'mosys' ? 'primary' : ''",
        big, flat, @click="currentApp = 'mosys'; $router.push({ name: 'mosys.grids.list' })") Mosys

    q-btn(color="primary", flat, icon="settings",
      v-if="user", @click="$router.push({ name: 'users.edit', params: { id: 'me' } })") {{ $t('navigation.manage_account') }}

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
        console.log('auth state', user)
        _this.user = user
      })
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
