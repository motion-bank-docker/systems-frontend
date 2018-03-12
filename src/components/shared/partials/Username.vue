<template lang="pug">
  span {{ username }}
</template>

<script>
  export default {
    props: ['uuid'],
    asyncComputed: {
      async username () {
        if (!this.uuid) return '---'
        const user = await this.$store.dispatch('users/get', this.uuid)
        return user.name
      }
    }
  }
</script>
