<template lang="pug">
  q-input(v-if="type === 'hidden'", :type="type", v-model="local")
  q-field(v-else, :dark="true", :label="fieldLabel", :error="validation ? validation.$error : undefined",
    :error-label="errorLabel", :helper="helperLabel || ''")
    q-select(v-if="type === 'select'", :float-label="label", :dark="true", v-model="local", :options="selectOptions")
    q-chips-input(v-else-if="type === 'chips'", :float-label="label", :dark="true", v-model="tags")
    q-input(v-else, :dark="true", :float-label="label", :type="type", v-model="local", :attributes="attributes")
</template>

<script>
  export default {
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
        local: undefined,
        tags: []
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
      },
      tags (val) {
        if (this.validation) {
          this.validation.$touch()
        }
        this.$emit('input', val)
      },
      value (val) {
        this.local = val
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
