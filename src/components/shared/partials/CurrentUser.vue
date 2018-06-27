<template lang="pug">
  span {{ userState ? userState.name : '' }}
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'CurrentUser',
    computed: {
      ...mapGetters({
        userState: 'auth/getUserState'
      })
    }
  }
</script>
