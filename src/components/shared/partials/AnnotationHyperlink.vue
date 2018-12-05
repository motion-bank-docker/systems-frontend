<template lang="pug">
  a(v-if="checkIfLink(string)", :href="transformToLink(string)", target="_blank")
    q-icon(name="link")
</template>

<script>
  export default {
    props: ['string'],
    methods: {
      checkIfLink (val) {
        if (val.startsWith('www.')) return this.transformToLink(val)
        else {
          // let regexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
          let regexp = /(\b(https?|http|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig
          return regexp.test(val)
        }
      },
      transformToLink (val) {
        if (val.startsWith('www.')) {
          let prestr = 'http://'
          return prestr.concat(val)
        }
        else {
          return val
        }
      }
    }
  }
</script>
