<template lang="pug">
  p Logging in...
</template>

<script>
  export default {
    props: ['auth'],
    mounted () {
      const _this = this
      this.auth.handleAuthentication().then(res => {
        console.log(res)
        _this.$router.replace({ name: 'users.edit', params: { id: 'me' } })
        _this.$store.commit('notifications/addMessage', {
          body: _this.$t('messages.login_success'),
          type: 'success'
        })
      }).catch(err => {
        _this.$router.replace({ name: 'site.welcome' })
        _this.$store.commit('notifications/addMessage', {
          body: err.message,
          type: 'error'
        })
      })
    }
  }
</script>
