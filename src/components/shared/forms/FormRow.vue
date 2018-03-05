<template lang="pug">
  q-input(v-if="type === 'hidden'", :type="type", v-model="local")
  q-field(v-else, :dark="true", :label="fieldLabel", :error="validation ? validation.$error : undefined",
    :error-label="errorLabel", :helper="helperLabel || ''")
    q-select(v-if="type === 'select'", :float-label="label", :dark="true", v-model="local", :options="selectOptions")
    q-input(v-else, :dark="true", :float-label="label", :type="type", v-model="local", :attributes="attributes")
</template>

<script>
  import {
    QSelect,
    QInput,
    QField
  } from 'quasar-framework'
  export default {
    components: {
      QSelect,
      QInput,
      QField
    },
    props: [
      'value',
      'attributes',
      'validation',
      'type',
      'label',
      'fieldLabel',
      'errorLabel',
      'helperLabel',
      'selectOptions'
    ],
    data () {
      return {
        local: undefined
      }
    },
    computed: {
      error () {
        if (this.type === 'hidden') return
        return this.validation && this.validation.$error
      }
    },
    watch: {
      local (val) {
        if (this.type === 'hidden') return
        if (this.validation) {
          this.validation.$touch()
        }
        this.$emit('input', val)
      }
    },
    created () {
      this.local = this.value
      if (this.type === 'hidden') return
      if (this.validation) {
        this.validation.$reset()
      }
    }
  }
</script>

<style></style>
