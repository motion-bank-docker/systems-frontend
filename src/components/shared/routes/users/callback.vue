<template lang="pug">
  p Logging in...
</template>

<script>
  export default {
    name: 'callback',
    props: ['auth'],
    data () {
      this.auth.handleAuthentication()
      return {}
    }
  }
</script>
