<template lang="pug">
  .timecode-label.cursor-pointer
    template(v-if="text")
      span {{text}}
    template(v-else)
      span {{ formatted() }}
      span.timecode-opacity .{{ formatted('milliseconds') }}
</template>

<script>
  import { DateTime, Interval, Duration } from 'luxon'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    name: 'TimecodeLabel',
    // TODO video should be accessed differently?
    // TODO define global video object?
    props: ['timecode', 'videoDate', 'millis', 'text', 'mode'],
    methods: {
      formatted (val) {
        let annotationDate
        if (typeof this.millis === 'number') {
          if (this.mode === 'global') annotationDate = DateTime.fromMillis(this.millis, { setZone: true })
          else if (this.mode === 'local') annotationDate = this.millis
        }
        else if (this.timecode) {
          annotationDate = DateTime.fromISO(this.timecode, { setZone: true })
        }
        if (annotationDate && this.videoDate) {
          // FIXME: the predefined format in constants.js isn't used with this solution
          // return Interval.fromDateTimes(this.videoDate, annotationDate)
          //   .toDuration().toObject()
          //   .toFormat(constants.config.TIMECODE_FORMAT)
          let dur = Interval.fromDateTimes(this.videoDate, annotationDate)
            .toDuration(['hours', 'minutes', 'seconds', 'milliseconds']).toObject()
          switch (val) {
          case 'milliseconds':
            let ms = DateTime.fromObject({milliseconds: dur.milliseconds}, { setZone: true })
            return ms.toFormat('SSS')
          default:
            let time = DateTime.fromObject({hour: dur.hours, minutes: dur.minutes, seconds: dur.seconds}, { setZone: true })
            return time.toFormat('HH:mm:ss')
          }
        }
        else if (typeof annotationDate !== 'undefined' && !this.videoDate) {
          if (this.mode === 'local') {
            let dur = Duration.fromMillis(this.millis)
            if (val === 'milliseconds') return dur.toFormat('SSS')
            else return dur.toFormat('hh:mm:ss')
          }
          if (val === 'milliseconds') return annotationDate.toFormat('SSS')
          else return annotationDate.toFormat('HH:mm:ss')
        }
        return annotationDate ? annotationDate.toFormat(constants.config.TIMECODE_FORMAT) : ''
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~variables'

  .timecode-label
    display: inline-block
    font-size: 12px
    line-height: 16px
    height: 18px
    padding: 0px 8px
    border: 1px solid $faded
    border-radius 2px
    /*opacity .6*/
    color #fff8
    &:hover
      background-color $faded
      color #fff
    .timecode-opacity
      opacity .5
</style>
