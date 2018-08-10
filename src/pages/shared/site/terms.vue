<template lang="pug">
  center-card-three-quarter
    span(slot="title") {{ $t('routes.site.terms.title') }}
    p.caption(slot="caption") {{ $t('routes.site.terms.caption') }}
</template>

<script>
  import CenterCardThreeQuarter from 'mbjs-quasar/src/components/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      CenterCardThreeQuarter: CenterCardThreeQuarter
    }
  }
</script>

<style></style>
