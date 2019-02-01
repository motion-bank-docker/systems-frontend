<template lang="pug">
  card-full
    | {{ $t('routes.site.help.title') }}
    span(slot="form-title") {{ $t('routes.site.help.title') }}
    p.caption(slot="form-caption") {{ $t('routes.site.help.caption') }}
    div(slot="form-logo")
</template>

<script>
  import CardFull from '../../../components/shared/layouts/CardFull'
  export default {
    components: {
      CardFull
    }
  }
</script>

<style></style>
