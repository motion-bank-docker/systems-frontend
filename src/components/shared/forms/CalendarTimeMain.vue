<template lang="pug">
  .row.col-12

    // CALENDAR
    //
    q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="event_note",
    :label="formatDate(modelCalendar, 'MMM Do, YYYY')")
      calendar(@timeReset="reset", @calendarChange="calendarChange")

    // TIME
    //
    q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="access_time",
    :label="formatDate(modelCalendar, 'HH:mm:ss:SSS')")
      slider-time(:resettime="modelCalendar", @sliderChange="sliderChange", @timeReset="reset")

</template>

<script>
  import Calendar from './Calendar'
  import SliderTime from '../../../components/shared/forms/SliderTime'

  import { date } from 'quasar'
  // import { DateTime } from 'luxon'

  export default {
    components: {
      Calendar,
      SliderTime
    },
    watch: {
      modelCalendar: function (val) {
        if (val == null) this.modelCalendar = Date.now()
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
      calendarChange (val) {
        this.modelCalendar = date.adjustDate(this.modelCalendar, {
          year: date.formatDate(val, 'YYYY'),
          month: date.formatDate(val, 'M')
        })
        // FIXME: days can't be adjusted. Bug in Quasar? Find workaround.
        /* this.modelCalendar = date.adjustDate(this.modelCalendar, {
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
          hour: parseInt(this.formatDate(this.modelCalendar, 'H')),
          minute: parseInt(this.formatDate(this.modelCalendar, 'm')),
          second: parseInt(this.formatDate(this.modelCalendar, 's'))
        }) */
        // console.log(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second)
        this.emitString(this.modelCalendar)
        // this.emitString(dt)
      },
      sliderChange (val) {
        switch (val.target) {
        case 'hours':
          this.modelCalendar = date.adjustDate(this.modelCalendar, { hours: val.val })
          break
        case 'minutes':
          this.modelCalendar = date.adjustDate(this.modelCalendar, { minutes: val.val })
          break
        case 'seconds':
          this.modelCalendar = date.adjustDate(this.modelCalendar, { seconds: val.val })
          break
        case 'milliseconds':
          this.modelCalendar = date.adjustDate(this.modelCalendar, { milliseconds: val.val })
          break
        }
        this.emitString(this.modelCalendar)
      },
      formatDate (val, format) {
        if (val) return date.formatDate(val, format)
      },
      reset (val) {
        let dateNow = Date.now()
        switch (val) {
        case 'date':
          this.modelCalendar = date.adjustDate(this.modelCalendar, {
            year: date.formatDate(dateNow, 'YYYY'),
            month: date.formatDate(dateNow, 'M') })
          // FIXME: days can't be adjusted. Bug in Quasar?
          /* this.modelCalendar = date.adjustDate(this.modelCalendar, {
            day: date.formatDate(dateNow, 'D') }) */
          break
        case 'time':
          this.modelCalendar = date.adjustDate(this.modelCalendar, {
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
        modelCalendar: Date.now()
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
