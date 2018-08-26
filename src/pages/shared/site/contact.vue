<template lang="pug">

  full-screen
    .row
      .col-xs-12.col-xs-10.col-sm-8

        h5 {{ $t('routes.site.contact.title') }}
        p {{ $t('routes.site.contact.caption') }}

        p.q-mb-xs Hochschule Mainz – University of Applied Sciences
        p.q-mb-xs Department of Communication Design
        p.q-mb-xs Holzstrasse 36, 55116 Mainz, Germany
        p.q-mb-xs Telephone: +49 6131 628-2259
        p E-Mail: florian.jenett (at) hs-mainz.de

</template>

<script>
  import { FullScreen } from 'mbjs-quasar/src/components'

  export default {
    components: {
      FullScreen
    }
  }
</script>

<style></style>
