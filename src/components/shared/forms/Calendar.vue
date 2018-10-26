<template lang="pug">
  .shadow-6
    q-datetime-picker.full-width(v-model="datetimeInternal", type="date", dark)
    .text-center.q-px-md
      q-btn.full-width.q-ma-md(@click="setNow", label="Today", no-caps)
</template>

<script>
  import { DateTime } from 'luxon'
  export default {
    props: ['datetime'],
    data () {
      return {
        datetimeInternal: undefined
      }
    },
    mounted () {
      if (this.datetime) this.datetimeInternal = this.datetime
    },
    watch: {
      datetime (val) {
        if (val !== this.datetimeInternal) this.datetimeInternal = val
      },
      datetimeInternal (val) {
        if (val) this.$emit('update', val)
      }
    },
    methods: {
      setNow () {
        this.datetimeInternal = DateTime.local().toISO()
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
