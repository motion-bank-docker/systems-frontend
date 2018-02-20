<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.errors.not_found.title') }}
    p.caption(slot="form-caption") {{ $t('routes.errors.not_found.caption') }}
    .text-center
      .col-8.layout-padding
        random-giphy.giphy(tag="desert", api-key="ak0kFgGPcgUsRi4OP3mrJNvmRDzWu813")
      br
      q-btn(big, outline, color="primary", v-if="canGoBack",
        @click="goBack()") {{ $t('buttons.back') }}
</template>

<script>
import CenterCardThreeQuarter from '../../layouts/CenterCardThreeQuarter'
import { QBtn } from 'quasar-framework'
import RandomGiphy from '../../partials/RandomGiphy'
export default {
  // TODO: remove the giphy api key from github later on!!
  components: {
    QBtn,
    CenterCardThreeQuarter,
    RandomGiphy
  },
  data () {
    return {
      canGoBack: window.history.length > 1
    }
  },
  methods: {
    goBack () {
      window.history.go(-1)
    }
  }
}
</script>

<style lang="stylus">
  .giphy {
    min-width: 800px
    max-height: 480px
  }
</style>
