<template lang="pug">

  div
    //
      .absolute(style="top: 70px; left: 20px;")
        slot(name="backButton")
    .q-ma-md
      slot(name="backButton")

    .q-px-xl
      // slot(name="nav-button")
      .q-pt-xl
        h5.caption.light-paragraph.q-mt-none
          slot(name="form-title")
        slot(name="form-caption")
        slot

      .q-mt-xl
        site-footer

</template>

<script>
  import { openURL } from 'quasar'
  import SiteFooter from '../partials/SiteFooter'
  export default {
    components: {
      SiteFooter
    },
    data: function () {
      return {
        openURL
      }
    }
  }
</script>

<style>
</style>
