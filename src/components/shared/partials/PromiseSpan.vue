<template lang="pug">
    span(v-if="display") {{ display }}
</template>

<script>
  export default {
    name: 'PromiseSpan',
    props: ['value'],
    data () {
      return {
        display: undefined
      }
    },
    mounted () {
      this.resolveValue()
    },
    methods: {
      resolveValue () {
        const _this = this
        if (this.value instanceof Promise) {
          this.value.then(v => { _this.display = v })
        }
        else if (typeof this.value === 'string') _this.display = this.value
      }
    },
    watch: {
      value () {
        this.resolveValue()
      }
    }
  }
</script>
