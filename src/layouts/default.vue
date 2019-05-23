<template lang="pug">
  q-layout(view='hHh LpR fFf')
    q-layout-header
      user-nav
    q-page-container
      router-view
</template>

<script>
  import { mapGetters } from 'vuex'
  import UserNav from '../components/shared/navigation/UserNav'

  export default {
    name: 'LayoutDefault',
    components: {
      UserNav
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    },
    mounted () {
      this.$store.commit('globalSettings/setIsMobile', this.$q.platform.is.mobile)
    }
  }
</script>
