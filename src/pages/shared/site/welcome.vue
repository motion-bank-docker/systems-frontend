<template lang="pug">
  // .row.layout-padding.full-height.items-center.justify-center
  full-screen
    .text-center.fit.relative-position
      a(@click="openURL('http://www.motionbank.org')")
        img.responsive(src="~assets/motionbank-logo.png")
      h3.caption.light-paragraph {{ $t('site.title') }}
      p.caption {{ $t('site.tagline') }}
      q-btn(outline, size="big", color="primary", @click="openURL('http://www.motionbank.org')") {{ $t('buttons.more_info') }}
    // .row.full-width
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
  import { FullScreen, SiteFooter } from 'mbjs-quasar/src/components'
  export default {
    name: 'PageWelcome',
    components: {
      FullScreen,
      SiteFooter
    },
    data: function () {
      return {
        openURL
      }
    }
  }
</script>
