<template lang="pug">
  .row.full-width.light-paragraph.justify-between.items-center.generic-margin
    .group(v-bind:class="{ 'absolute-bottom-left': positionCorners, 'layout-padding': positionCorners }")
      small.generic-margin {{ $t('site.copyright') }}
      small.generic-margin
        a(@click="openURL('http://motionbank.org/de/content/impressum')") {{ $t('navigation.imprint') }}
      small.generic-margin
        a(@click="openURL('http://motionbank.org/de/content/kontakt')") {{ $t('navigation.contact') }}
      small.generic-margin
        a(@click="openURL('http://motionbank.org/de/content/impressum')") {{ $t('navigation.terms') }}
    .group(v-bind:class="{ 'absolute-bottom-right': positionCorners, 'layout-padding': positionCorners }")
      small.generic-margin
        a(@click="openURL('https://github.com/motionbank')") {{ $t('navigation.github') }}
      small {{ $t('site.version') }}: v{{ version }}
      small {{ $t('site.license') }}: {{ license }}
</template>

<script>
  import { openURL } from 'quasar-framework'
  import * as pkg from '../../../package.json'
  export default {
    data: function () {
      return {
        openURL,
        version: pkg.version,
        license: pkg.license
      }
    },
    props: ['positionCorners']
  }
</script>

<style></style>
