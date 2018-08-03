<template lang="pug">
  q-list.no-border.shadow-6
    slider-time-row.q-mx-lg(v-for="(row, i) in rows",
    @slide="handlerSlide",
    :resettime="resettime", :key="i", :max="row.max", :suffix="row.suffix", :type="row.type")
    q-item
      q-item-main.text-center
        q-btn.full-width(@click="resetTime", label="Now", no-caps)
</template>

<script>
  import SliderTimeRow from './SliderTimeRow'

  export default {
    components: {
      SliderTimeRow
    },
    methods: {
      handlerSlide (val) {
        this.$emit('slide', val)
      },
      resetTime () {
        this.$emit('timeReset', 'time')
        this.resettime = Date.now()
      }
    },
    // props: ['resettime'],
    data () {
      return {
        resettime: 123,
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
