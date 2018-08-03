<template lang="pug">
  .shadow-6
    // CALENDER
    //
    q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="event_note",
    :label="formatDate(modelCalender, 'MMM Do, YYYY')")
      calender(@timeReset="reset", @calenderChange="calenderChange")
      //
        .shadow-6
          q-datetime-picker.full-width(v-model="modelCalender", dark)
          .text-center.q-px-md
            q-btn.full-width.q-ma-md(@click="reset('date')", label="Today", no-caps)

</template>

<script>
  import Calender from '../../../components/shared/forms/Calender'

  export default {
    components: {
      Calender
    },
    watch: {
      modelCalender: function () {
        this.$emit('calenderChange', this.modelCalender)
      }
    },
    methods: {
      resetTime () {
        this.$emit('timeReset', 'date')
        this.resettime = Date.now()
      }
    },
    data () {
      return {
        modelCalender: null
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
