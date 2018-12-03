<template lang="pug">
  .row.col-12

    // CALENDAR
    //
    q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="event_note", :label="dateString")
      calendar(@update="onUpdateDate", :datetime="datetimeInternal")

    // TIME
    //
    q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="access_time", :label="timeString")
      slider-time(@update="onUpdateTime", :datetime="datetimeInternal")

</template>

<script>
  import Calendar from './Calendar'
  import SliderTime from '../../../components/shared/forms/SliderTime'
  import { DateTime } from 'luxon'

  export default {
    components: {
      Calendar,
      SliderTime
    },
    props: ['datetime'],
    data () {
      return {
        datetimeInternal: undefined,
        modelCalendar: Date.now()
      }
    },
    mounted () {
      if (!this.datetime) this.datetimeInternal = DateTime.local().toISO()
    },
    watch: {
      datetime (val) {
        console.log('datetime', val)
        if (val !== this.datetimeInternal) this.datetimeInternal = val
      },
      datetimeInternal (val) {
        this.$emit('update', val)
      }
    },
    computed: {
      dateString () {
        if (this.datetimeInternal) return DateTime.fromISO(this.datetimeInternal).toLocaleString(DateTime.DATE_FULL)
        return ''
      },
      timeString () {
        if (this.datetimeInternal) {
          const dt = DateTime.fromISO(this.datetimeInternal)
          return `${dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}.${dt.millisecond}`
        }
        return ''
      }
    },
    methods: {
      onUpdateDate (val) {
        const
          valParts = val.split('T'),
          dateParts = this.datetimeInternal.split('T')
        if (valParts[0] !== dateParts[0]) this.datetimeInternal = [valParts[0], dateParts[1]].join('T')
      },
      onUpdateTime (val) {
        const
          valParts = val.split('T'),
          dateParts = this.datetimeInternal.split('T')
        if (valParts[1] !== dateParts[1]) this.datetimeInternal = [dateParts[0], valParts[1]].join('T')
      }
    }
  }
</script>
