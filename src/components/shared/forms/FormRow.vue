<template lang="pug">
  q-input(v-if="type === 'hidden'", :type="type", v-model="local")
  q-field(v-else, :dark="true", :label="fieldLabel", :error="validation ? validation.$error : undefined",
    :error-label="errorLabel", :helper="helperLabel || ''")
    q-select(v-if="type === 'select'", :float-label="label", :dark="true", v-model="local", :options="selectOptions")
    q-chips-input.q-my-md(v-else-if="type === 'chips'", :float-label="label", :dark="true", v-model="local",
    chips-color="white", chips-bg-color="grey", @duplicate="duplicate()")
      q-autocomplete.bg-grey-9(@search="autocompleteSearch", @selected="autocompleteSelected")
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
      'selectOptions',
      'autocompleteOptions'
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
    methods: {
      duplicate () {
        this.$q.notify(this.$t('errors.item_exists'))
      },
      autocompleteSearch (input, done) {
        if (!Array.isArray(this.autocompleteOptions)) return done([])
        const regex = new RegExp(input, 'i')
        const filtered = this.autocompleteOptions.filter(term => regex.test(term))
        done(filtered.map(term => {
          return { value: term, label: term }
        }))
      },
      autocompleteSelected (item) {
        console.debug('autocomplete selected', item)
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

<style scoped lang="stylus">
</style>
