<template lang="pug">
  card-full
    | {{ $t('routes.site.account.title') }}
    span(slot="form-title") {{ $t('routes.site.account.title') }}
    p.caption(slot="form-caption") {{ $t('routes.site.account.caption') }}
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
