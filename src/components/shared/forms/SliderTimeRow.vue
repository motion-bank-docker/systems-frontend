<template lang="pug">
  q-item.no-padding
    q-item-side
      q-btn.no-shadow(@click="handlerButton('down')", round, size="sm", icon="remove", color="transparent")
    q-item-main
      q-slider(v-model="modelSlider", :min="0", :max="max", :label-value="`${modelSlider}${suffix}`", label-always)
    q-item-side
      q-btn.no-shadow(@click="handlerButton('up')", round, size="sm", icon="add", color="transparent")
</template>

<script>
  import { date } from 'quasar'

  export default {
    mounted () {
      switch (this.type) {
      case 'hours':
        this.timeUnit = 'H'
        break
      case 'minutes':
        this.timeUnit = 'm'
        break
      case 'seconds':
        this.timeUnit = 's'
        break
      case 'milliseconds':
        this.timeUnit = 'SSS'
        break
      }
      // this.modelSlider = this.formatDate(Date.now(), this.timeUnit)
    },
    watch: {
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
        this.$emit('slideTarget', target)
        this.$emit('slideVal', val)
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
      },
      someHandler () {
        alert('bla')
      }
    },
    props: ['max', 'suffix', 'type'],
    data () {
      return {
        modelSlider: 0,
        timeUnit: undefined
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
