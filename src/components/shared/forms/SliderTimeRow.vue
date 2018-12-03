<template lang="pug">
  q-item.no-padding
    q-item-side
      q-btn.no-shadow(@click="handlerButton('down')", round, size="sm", icon="remove", color="transparent")
    q-item-main
      q-slider(v-model="valueInternal", :min="0", :max="max", :label-value="`${type}: ${valueInternal}`", label-always)
    q-item-side
      q-btn.no-shadow(@click="handlerButton('up')", round, size="sm", icon="add", color="transparent")
</template>

<script>
  export default {
    props: ['value', 'max', 'suffix', 'type'],
    data () {
      return {
        valueInternal: undefined
      }
    },
    mounted () {
      this.valueInternal = this.value
    },
    watch: {
      value (val) {
        if (val !== this.valueInternal) this.valueInternal = val
      },
      valueInternal (val) {
        this.$emit('update', { [this.type]: val })
      }
    },
    methods: {
      handlerButton (val) {
        if (val === 'up' && this.valueInternal < this.max) this.valueInternal++
        else if (val === 'down' && this.valueInternal > 0) this.valueInternal--
      }
    }
  }
</script>
