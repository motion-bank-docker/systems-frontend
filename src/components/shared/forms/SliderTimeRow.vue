<template lang="pug">
  q-item.no-padding
    // .bg-green {{ resettime }}
    q-item-side
      q-btn.no-shadow(@click="handlerButton('down')", round, size="sm", icon="remove", color="transparent")
    q-item-main
      q-slider(v-model="modelSlider", :resettime="resettime", :min="0", :max="max", :label-value="`${modelSlider}${suffix}`", label-always)
    q-item-side
      q-btn.no-shadow(@click="handlerButton('up')", round, size="sm", icon="add", color="transparent")
</template>

<script>
  import { date } from 'quasar'

  export default {
    mounted () {
      let timeUnit
      switch (this.type) {
      case 'hours':
        timeUnit = 'H'
        break
      case 'minutes':
        timeUnit = 'm'
        break
      case 'seconds':
        timeUnit = 's'
        break
      case 'milliseconds':
        timeUnit = 'SSS'
        break
      }
      this.modelSlider = parseInt(date.formatDate(Date.now(), timeUnit))
    },
    watch: {
      resettime: function () {
        switch (this.type) {
        case 'hours':
          this.modelSlider = date.formatDate(Date.now(), 'H')
          break
        case 'minutes':
          this.modelSlider = date.formatDate(Date.now(), 'm')
          break
        case 'seconds':
          this.modelSlider = date.formatDate(Date.now(), 's')
          break
        case 'milliseconds':
          this.modelSlider = date.formatDate(Date.now(), 'SSS')
          break
        }
      },
      modelSlider: function (val) {
        let target
        switch (this.type) {
        case 'hours':
          target = 'hours'
          break
        case 'minutes':
          target = 'minutes'
          break
        case 'seconds':
          target = 'seconds'
          break
        case 'milliseconds':
          target = 'milliseconds'
          break
        }
        this.$emit('slide', {target, val})
      }
    },
    methods: {
      formatDate (val, format) {
        if (val) return date.formatDate(val, format)
      },
      handlerButton (val) {
        let _modelSlider = this.modelSlider
        if (val === 'up' && _modelSlider < this.max) this.modelSlider++
        else if (val === 'down' && _modelSlider > 0) this.modelSlider--
      }
    },
    props: ['resettime', 'max', 'suffix', 'type'],
    data () {
      return {
        modelSlider: 0,
        rtime: this.resettime
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
