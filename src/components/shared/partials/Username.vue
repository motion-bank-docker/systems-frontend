<template lang="pug">
  span {{ username }}
</template>

<script>
  export default {
    props: ['uuid'],
    data () {
      return {
        username: '---'
      }
    },
    mounted () {
      if (!this.uuid) return
      const _this = this
      this.$store.dispatch('users/get', this.uuid)
        .then(user => {
          _this.username = user.name
        })
    }
  }
</script>
