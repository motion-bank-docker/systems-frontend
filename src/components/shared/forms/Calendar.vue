<template lang="pug">
  .shadow-6
    q-datetime-picker.full-width(v-model="modelCalendar", dark)
    .text-center.q-px-md
      q-btn.full-width.q-ma-md(@click="resetTime", label="Today", no-caps)
</template>

<script>
  export default {
    watch: {
      modelCalendar: function () {
        this.$emit('calendarChange', this.modelCalendar)
      }
    },
    methods: {
      resetTime () {
        this.$emit('timeReset', 'date')
        this.modelCalendar = Date.now()
      }
    },
    data () {
      return {
        modelCalendar: null
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
