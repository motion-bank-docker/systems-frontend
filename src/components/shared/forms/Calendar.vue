<template lang="pug">
  .shadow-6
    q-datetime-picker.full-width(v-model="modelCalender", dark)
    .text-center.q-px-md
      q-btn.full-width.q-ma-md(@click="resetTime", label="Today", no-caps)
</template>

<script>
  export default {
    watch: {
      modelCalender: function () {
        this.$emit('calenderChange', this.modelCalender)
      }
    },
    methods: {
      resetTime () {
        this.$emit('timeReset', 'date')
        this.modelCalender = Date.now()
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
