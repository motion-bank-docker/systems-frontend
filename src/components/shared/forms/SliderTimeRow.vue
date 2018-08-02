<template lang="pug">
  q-item.no-padding
    q-item-side
      // q-btn(@click="sliderMilliseconds--", round, size="sm", icon="remove", color="grey-9")
      q-btn(@click="handlerButton('down')", round, size="sm", icon="remove", color="grey-9")
    q-item-main
      // q-slider(v-model="modelSlider", :min="0", :max="length", label-always, :label-value="`${sliderMilliseconds}ms`")
      q-slider(v-model="modelSlider", :min="0", :max="length", :label-value="`${modelSlider}${suffix}`", label-always)
    q-item-side
      // q-btn(@click="sliderMilliseconds++", round, size="sm", icon="add", dark, color="grey-9")
      q-btn(@click="handlerButton('up')", round, size="sm", icon="add", color="grey-9")
</template>

<script>
  export default {
    mounted () {
      /* this.sliderHours = this.formatDate(this.modelCalender, 'H')
      this.sliderMinutes = this.formatDate(this.modelCalender, 'm')
      this.sliderSeconds = this.formatDate(this.modelCalender, 'S')
      this.sliderMilliseconds = this.formatDate(this.modelCalender, 'SSS') */
    },
    methods: {
      handlerButton (val) {
        let _modelSlider = this.modelSlider
        if (val === 'up' && _modelSlider < this.length) this.modelSlider++
        else if (val === 'down' && _modelSlider > 0) this.modelSlider--
      }
    },
    props: ['length', 'suffix'],
    data () {
      return {
        modelSlider: 0
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
