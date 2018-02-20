<template lang="pug">
  q-field(:dark="true", :error="validation ? validation.$error : undefined")
    q-checkbox(:dark="true", :label="label", color="primary", v-model="local")
</template>

<script>
  import {
    QCheckbox,
    QField
  } from 'quasar-framework'
  export default {
    components: {
      QCheckbox,
      QField
    },
    props: ['value', 'validation', 'type', 'label'],
    data () {
      return {
        local: false
      }
    },
    computed: {
      error () {
        return this.validation && this.validation.$error
      }
    },
    watch: {
      local (val) {
        if (this.validation) {
          this.validation.$touch()
        }
        this.$emit('input', val)
      }
    },
    created () {
      this.local = typeof this.value === 'boolean' ? this.value : false
    }
  }
</script>

<style></style>
