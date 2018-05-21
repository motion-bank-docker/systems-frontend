<template lang="pug">
  q-layout(view='hHh LpR fFf')
    q-layout-header
      user-nav(:login="login", :auth="auth", :authenticated="authenticated")
    q-page-container
      router-view
</template>

<script>
  import UserNav from '../components/shared/partials/UserNav'

  export default {
    name: 'LayoutDefault',
    components: {
      UserNav
    },
    data () {
      return {
        authenticated: false,
        login: undefined,
        auth: undefined
      }
    },
    mounted () {
      console.log('layout mounted')
    }
  }
</script>
