<template lang="pug">
  span {{ username }}
</template>

<script>
  export default {
    props: ['uuid'],
    asyncComputed: {
      async username () {
        if (!this.uuid) return '---'
        return await this.$store.dispatch('users/get', this.uuid)
          .then(user => {
            return user.name
          })
      }
    }
  }
</script>
