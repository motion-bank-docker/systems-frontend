<template lang="pug">
  q-list.no-border
    slider-time-row(v-for="(row, i) in rows",
    @slideVal="handlerSlideVal", @slideTarget="handlerSlideTarget",
    :max="row.max", :key="i", :suffix="row.suffix", :type="row.type")
</template>

<script>
  import SliderTimeRow from './SliderTimeRow'

  export default {
    components: {
      SliderTimeRow
    },
    methods: {
      handlerSlideVal (val) {
        this.$emit('slideVal', val)
      },
      handlerSlideTarget (val) {
        this.$emit('slideTarget', val)
      }
    },
    data () {
      return {
        rows: [{
          max: 23,
          suffix: 'h',
          type: 'hours'
        }, {
          max: 59,
          suffix: 'min',
          type: 'minutes'
        }, {
          max: 59,
          suffix: 's',
          type: 'seconds'
        }, {
          max: 999,
          suffix: 'ms',
          type: 'milliseconds'
        }]
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
