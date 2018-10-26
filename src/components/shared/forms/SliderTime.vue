<template lang="pug">
  q-list.no-border.shadow-6
    slider-time-row.q-mx-lg(v-if="datetimeParsed", v-for="row in rows",
    @update="onSliderUpdate", :value="datetimeParsed[row.type]",
    :key="row.type", :max="row.max", :suffix="row.suffix", :type="row.type")
    q-item
      q-item-main.text-center
        q-btn.full-width(@click="setNow", label="Now", no-caps)
</template>

<script>
  import SliderTimeRow from './SliderTimeRow'
  import { DateTime } from 'luxon'

  export default {
    components: {
      SliderTimeRow
    },
    props: ['datetime'],
    data () {
      return {
        datetimeInternal: undefined,
        datetimeParsed: undefined,
        rows: [{
          max: 23,
          suffix: 'h',
          type: 'hour'
        }, {
          max: 59,
          suffix: 'min',
          type: 'minute'
        }, {
          max: 59,
          suffix: 's',
          type: 'second'
        }, {
          max: 999,
          suffix: 'ms',
          type: 'millisecond'
        }]
      }
    },
    mounted () {
      if (this.datetime) this.datetimeInternal = this.datetime
    },
    watch: {
      datetime (val) {
        if (this.datetimeInternal !== val) this.datetimeInternal = val
      },
      datetimeInternal (val) {
        this.datetimeParsed = DateTime.fromISO(val)
      }
    },
    methods: {
      setNow () {
        this.datetimeInternal = DateTime.local().toISO()
      },
      onSliderUpdate (val) {
        this.datetimeParsed = this.datetimeParsed.set(val)
        this.$emit('update', this.datetimeParsed.toISO())
      }
    }
  }
</script>
