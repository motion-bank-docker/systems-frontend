<template lang="pug">
  div
    .fixed-bottom.bg-warning.q-pa-sm.text-center(v-if="show")
      q-btn.float-right(@click="hideWarning", icon="close", flat, dark, color="white")
      span.text-white.link-white(v-html="$t('messages.browser_unsupported_warning')")
</template>

<script>
  export default {
    name: 'BrowserWarning',
    data () {
      return {
        overrideShow: false
      }
    },
    computed: {
      show () {
        return !this.overrideShow && !localStorage.getItem('hideBrowserWarning') && !this.isChrome()
      }
    },
    methods: {
      hideWarning () {
        localStorage.setItem('hideBrowserWarning', '1')
        this.overrideShow = true
      },
      isChrome () {
        // Taken from https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome/13348618#13348618
        //
        // please note,
        // that IE11 now returns undefined again for window.chrome
        // and new Opera 30 outputs true for window.chrome
        // but needs to check if window.opr is not undefined
        // and new IE Edge outputs to true now for window.chrome
        // and if not iOS Chrome check
        // so use the below updated condition
        const isChromium = window.chrome
        const winNav = window.navigator
        const vendorName = winNav.vendor
        const isOpera = typeof window.opr !== 'undefined'
        const isIEedge = winNav.userAgent.indexOf('Edge') > -1
        const isIOSChrome = winNav.userAgent.match('CriOS')

        if (isIOSChrome) {
          return true
        }
        else if (
          isChromium !== null &&
          typeof isChromium !== 'undefined' &&
          vendorName === 'Google Inc.' &&
          isOpera === false &&
          isIEedge === false
        ) {
          return true
        }
        return false
      }
    }
  }
</script>

<style lang="stylus">
  .link-white a
    color: white
    text-decoration: underline
</style>
