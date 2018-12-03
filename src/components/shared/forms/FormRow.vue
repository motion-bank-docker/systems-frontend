<template lang="pug">
  q-input(v-if="type === 'hidden'", :type="type", v-model="local")
  q-field(v-else, :dark="true", :label="fieldLabel", :error="validation ? validation.$error : undefined",
    :error-label="errorLabel", :helper="helperLabel || ''")
    q-select(v-if="type === 'select'", :float-label="label", :dark="true", v-model="local", :options="selectOptions")
    q-chips-input.q-my-md(v-else-if="type === 'chips'", :float-label="label", :dark="true", v-model="tags",
    chips-color="white", chips-bg-color="primary", @duplicate="duplicate()")
      q-autocomplete.bg-grey-9(@search="searchTags", @selected="selectedTag")
    q-input(v-else, :dark="true", :float-label="label", :type="type", v-model="local", :attributes="attributes")
</template>

<script>
  import { filter } from 'quasar'
  import countries from './autocomplete.json'

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
        countries: this.parseCountries(),
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
    methods: {
      duplicate () {
        this.$q.notify(this.$t('errors.tag_exists'))
      },
      parseCountries () {
        return countries.map(country => {
          return {
            label: country,
            value: country
          }
        })
      },
      searchTags (terms, done) {
        done(filter(terms, {field: 'value', list: this.parseCountries()}))
        /* setTimeout(() => {
          done(filter(terms, {field: 'value', list: this.parseCountries()}))
        }, 200) */
      },
      selectedTag () {
        console.log('selected')
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
