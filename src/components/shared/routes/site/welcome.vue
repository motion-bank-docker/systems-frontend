<template lang="pug">
  .row.layout-padding.full-height.items-center.justify-center
    .column.items-between
      .layout-padding.text-center
        .logo.layout-padding
          a(@click="openURL('http://www.motionbank.org')")
            img.responsive(src="~assets/motionbank-logo.png")
        h3.caption.light-paragraph.no-margin {{ $t('site.title') }}
        p.caption {{ $t('site.tagline') }}
      .layout-padding
        .group
          q-btn(outline, size="big", color="primary", @click="$router.push('/users/create')") {{ $t('buttons.create_account') }}
          q-btn(outline, size="big", color="primary", @click="openURL('http://www.motionbank.org')") {{ $t('buttons.more_info') }}
      .layout-padding.footer-space
        site-footer(position-corners)
</template>

<script>
  import {
    QLayout,
    QBtn,
    openURL
  } from 'quasar-framework'
  import SiteFooter from '../../../shared/partials/SiteFooter'
  export default {
    components: {
      QLayout,
      QBtn,
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
  .footer-space {
    padding-top: 120px;
  }
</style>
