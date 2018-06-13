<template lang="pug">

  .bg-dark

    .absolute
      slot(name="backButton")

    div.q-pa-xl
      slot(name="nav-button")

      .row.justify-between.content-stretch
        .column.width-3of4
          h5.caption.light-paragraph
            slot(name="form-title")

          slot(name="form-caption")

        slot(name="form-logo")
          a.gt-md.logo(@click="openURL('http://www.motionbank.org')")
            img.responsive(src="~assets/motionbank-logo.png")

      q-card-main.no-margin
        slot

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
