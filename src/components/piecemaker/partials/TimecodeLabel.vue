<template lang="pug">
  .timecode-label.cursor-pointer {{ formatted }}
</template>

<script>
  import { DateTime, Interval } from 'luxon'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    name: 'TimecodeLabel',
    // TODO video should be accessed differently?
    // TODO define global video object?
    props: ['timecode', 'videoDate', 'millis'],
    computed: {
      formatted () {
        let annotationDate
        if (this.millis) {
          annotationDate = DateTime.fromMillis(this.millis)
        }
        else if (this.timecode) {
          annotationDate = DateTime.fromISO(this.timecode, { setZone: true })
        }
        if (annotationDate && this.videoDate) {
          return Interval.fromDateTimes(this.videoDate, annotationDate)
            .toDuration()
            .toFormat(constants.config.TIMECODE_FORMAT)
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
    font-size: 13px
    padding: 2px 8px
    border: 1px solid $faded
    border-radius 2px
    &:hover
      background-color $faded
</style>
