<template lang="pug">
  .row.col-12

    // CALENDER
    //
    q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="event_note",
    :label="formatDate(modelCalender, 'MMM Do, YYYY')")
      calender(@timeReset="reset", @calenderChange="calenderChange")

    // TIME
    //
    q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="access_time",
    :label="formatDate(modelCalender, 'HH:mm:ss:SSS')")
      slider-time(:resettime="modelCalender", @sliderChange="sliderChange", @timeReset="reset")

</template>

<script>
  import Calender from '../../../components/shared/forms/Calender'
  import SliderTime from '../../../components/shared/forms/SliderTime'

  import { date } from 'quasar'
  // import { DateTime } from 'luxon'

  export default {
    components: {
      Calender,
      SliderTime
    },
    watch: {
      modelCalender: function (val) {
        if (val == null) this.modelCalender = Date.now()
      }
    },
    methods: {
      emitString (val) {
        console.log(val)
        // let valNew = DateTime.local().toISO()
        // let valNew = DateTime.fromString(val).toISO()
        // this.$emit('getTimeAndDate', val)
        // this.$emit('getTimeAndDate', valNew)
      },
      calenderChange (val) {
        this.modelCalender = date.adjustDate(this.modelCalender, {
          year: date.formatDate(val, 'YYYY'),
          month: date.formatDate(val, 'M') })
        // FIXME: days can't be adjusted. Bug in Quasar?
        /* this.modelCalender = date.adjustDate(this.modelCalender, {
          day: date.formatDate(val, 's') }) */
        this.emitString(this.modelCalender)
      },
      sliderChange (val) {
        switch (val.target) {
        case 'hours':
          this.modelCalender = date.adjustDate(this.modelCalender, { hours: val.val })
          break
        case 'minutes':
          this.modelCalender = date.adjustDate(this.modelCalender, { minutes: val.val })
          break
        case 'seconds':
          this.modelCalender = date.adjustDate(this.modelCalender, { seconds: val.val })
          break
        case 'milliseconds':
          this.modelCalender = date.adjustDate(this.modelCalender, { milliseconds: val.val })
          break
        }
        this.emitString(this.modelCalender)
      },
      formatDate (val, format) {
        if (val) return date.formatDate(val, format)
      },
      reset (val) {
        let dateNow = Date.now()
        switch (val) {
        case 'date':
          this.modelCalender = date.adjustDate(this.modelCalender, {
            year: date.formatDate(dateNow, 'YYYY'),
            month: date.formatDate(dateNow, 'M') })
          // FIXME: days can't be adjusted. Bug in Quasar?
          /* this.modelCalender = date.adjustDate(this.modelCalender, {
            day: date.formatDate(dateNow, 'D') }) */
          break
        case 'time':
          this.modelCalender = date.adjustDate(this.modelCalender, {
            hours: date.formatDate(dateNow, 'H'),
            minutes: date.formatDate(dateNow, 'm'),
            seconds: date.formatDate(dateNow, 's'),
            milliseconds: date.formatDate(dateNow, 'SSS') })
          break
        }
        // console.log(date.formatDate(dateNow, 'D'))
      }
    },
    data () {
      return {
        modelCalender: Date.now()
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
