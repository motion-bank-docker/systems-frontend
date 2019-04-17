<template lang="pug">
  .timecode-label.cursor-pointer {{ formatSelectorForList() }}
</template>

<script>
  import { DateTime, Interval } from 'luxon'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    name: 'TimecodeLabel',
    // TODO video should be accessed differently?
    // TODO define global video object?
    props: ['timecode', 'videoDate'],
    data () {
      return {
      }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      formatSelectorForList () {
        const annotationDate = DateTime.fromISO(this.timecode, { setZone: true })
        if (this.videoDate) return Interval.fromDateTimes(this.videoDate, annotationDate).toDuration().toFormat(constants.TIMECODE_FORMAT)
        return annotationDate.toFormat(constants.TIMECODE_FORMAT)
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
