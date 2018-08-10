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
  import Calender from './Calendar'
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
        console.log(val, '--------')
        // console.log(val, parseInt(this.formatDate(val, 'M')))
        // let valNew = DateTime.local().toISO()
        // let valNew = DateTime.fromString(val).toISO()
        // this.$emit('getTimeAndDate', val)
        // this.$emit('getTimeAndDate', valNew)
      },
      calenderChange (val) {
        this.modelCalender = date.adjustDate(this.modelCalender, {
          year: date.formatDate(val, 'YYYY'),
          month: date.formatDate(val, 'M')
        })
        // FIXME: days can't be adjusted. Bug in Quasar? Find workaround.
        /* this.modelCalender = date.adjustDate(this.modelCalender, {
          day: date.formatDate(val, 's') }) */
        // console.log(this.formatDate(val, 'D'))
        // let newDate = date.buildDate({year: 2010, day: 5, hours: 15, milliseconds: 123})
        // const { addToDate } = date
        // let newDate = addToDate(new Date(), { days: 7, months: 1 })
        // console.log(newDate)
        /*
        let dt = DateTime.fromObject({
          year: parseInt(this.formatDate(val, 'YYYY')),
          month: parseInt(this.formatDate(val, 'M')),
          day: parseInt(this.formatDate(val, 'D')),
          hour: parseInt(this.formatDate(this.modelCalender, 'H')),
          minute: parseInt(this.formatDate(this.modelCalender, 'm')),
          second: parseInt(this.formatDate(this.modelCalender, 's'))
        }) */
        // console.log(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second)
        this.emitString(this.modelCalender)
        // this.emitString(dt)
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
