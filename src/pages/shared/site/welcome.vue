<template lang="pug">
  .row.layout-padding.full-height.items-center.justify-center
    .column.items-between
      .layout-padding.text-center
        .logo.layout-padding
          a(@click="openURL('http://www.motionbank.org')")
            img.responsive(src="~assets/motionbank-logo.png")
        h3.caption.light-paragraph {{ $t('site.title') }}
        p.caption {{ $t('site.tagline') }}
      .layout-padding
        .group
          q-btn(outline, size="big", color="primary", @click="openURL('http://www.motionbank.org')") {{ $t('buttons.more_info') }}
      .layout-padding(style="padding-top: 120px;")
        site-footer(position-corners)
</template>

<script>
  import { openURL } from 'quasar'
  import SiteFooter from '../../../components/shared/partials/SiteFooter'
  export default {
    name: 'PageWelcome',
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
