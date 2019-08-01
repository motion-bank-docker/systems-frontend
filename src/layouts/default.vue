<template lang="pug">
  q-layout(view='hHh LpR fFf')
    q-layout-header
      user-nav
    q-page-container
      router-view
</template>

<script>
  import UserNav from '../components/shared/navigation/UserNav'

  export default {
    name: 'LayoutDefault',
    components: {
      UserNav
    },
    watch: {
      '$route' (route) {
        this.$store.commit('globalSettings/setCurrentRoute', route.name)
      }
    }
  }
</script>
