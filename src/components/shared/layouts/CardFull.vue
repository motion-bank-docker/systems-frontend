<template lang="pug">
  .row.justify-center.items-center
    // .column.col-12.sm-gutter
    .column.col-12
      q-card.full-width(color="dark").no-margin
        .layout-padding
          q-card-main.no-margin
            slot(name="nav-button")
            .row.justify-between.content-stretch
              .column.width-3of4
                h4.caption.light-paragraph.no-margin
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
  import {
    QCard,
    QCardMain,
    QLayout,
    openURL
  } from 'quasar-framework'
  import SiteFooter from '../partials/SiteFooter'
  export default {
    components: {
      QCard,
      QCardMain,
      QLayout,
      SiteFooter
    },
    data: function () {
      return {
        openURL
      }
    }
  }
</script>

<style></style>
