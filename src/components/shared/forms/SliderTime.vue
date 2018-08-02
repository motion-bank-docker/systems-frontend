<template lang="pug">
  q-list.no-border
    slider-time-row(v-for="(row, i) in rows", :length="row.length", :key="i", :suffix="row.suffix")
</template>

<script>
  import SliderTimeRow from './SliderTimeRow'

  export default {
    components: {
      SliderTimeRow
    },
    data () {
      return {
        rows: [{
          length: 23,
          suffix: 'h',
          type: 'hours'
        }, {
          length: 59,
          suffix: 'min',
          type: 'minutes'
        }, {
          length: 59,
          suffix: 's',
          type: 'seconds'
        }, {
          length: 999,
          suffix: 'ms',
          type: 'milliseconds'
        }]
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
