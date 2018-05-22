<template lang="pug">
  q-layout(view='hHh LpR fFf')
    q-layout-header
      user-nav
    q-page-container
      router-view
</template>

<script>
  import UserNav from '../components/shared/partials/UserNav'

  export default {
    name: 'LayoutDefault',
    components: {
      UserNav
    }
  }
</script>
