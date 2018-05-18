<template lang="pug">

  .row.justify-center.items-center

    div#back-button
      slot(name="backButton")

    .column.col-12
      q-card.full-width(color="dark").no-margin
        .layout-padding
          q-card-main.no-margin
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
