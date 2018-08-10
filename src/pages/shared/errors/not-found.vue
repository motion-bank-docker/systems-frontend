<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.errors.not_found.title') }}
    p(slot="form-caption") {{ $t('routes.errors.not_found.caption') }}
    .text-center
      .col-8.layout-padding
        img(src="~assets/sad-wh.svg", style="width:30vw;max-width:300px;")
      br
      q-btn(big, outline, color="primary", v-if="canGoBack", @click="goBack()") {{ $t('buttons.back') }}
      q-btn(big, outline, color="primary", v-if="!canGoBack", @click="$router.push('/')") {{ $t('buttons.back') }}
</template>

<script>
import CenterCardThreeQuarter from 'mbjs-quasar/src/components/layouts/CenterCardThreeQuarter'
export default {
  components: {
    CenterCardThreeQuarter
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
