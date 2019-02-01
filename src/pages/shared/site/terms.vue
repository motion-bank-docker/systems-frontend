<template lang="pug">

  full-screen
    .row
      .col-xs-12.col-xs-10.col-sm-8
        h5 {{ $t('routes.site.terms.title') }}
        p {{ $t('routes.site.terms.caption') }}

        p
          a(href="https://www.hs-mainz.de/datenschutz/") Datenschutz

</template>

<script>
  import { FullScreen } from '../../../components/shared'

  export default {
    components: {
      FullScreen
    }
  }
</script>

<style></style>
