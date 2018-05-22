<template lang="pug">
  // form.column.md-gutter.justify-between.items-around.full-width(v-on:submit.prevent="handleSubmit")
  form(v-on:submit.prevent="handleSubmit")
    // .row.md-gutter.justify-between.items-between
    div
      template(v-if="loaded", v-for="(field, key) in fields")
        form-row-checkbox.col-sm-12.no-margin(
        v-if="isType(field.type, 'checkbox')",
        v-model="local[key]",
        :type="field.type",
        :validation="$v.local[key]",
        :attributes="field.attributes",
        :label="$t(field.label)",
        :helper-label="$t(field.helperLabel)",
        :error-label="$t(field.errorLabel)",
        :class="{ 'col-xl-6': !field.fullWidth, 'col-12': field.fullWidth }"
        )
        form-row.col-sm-12.no-margin(
        v-else,
        v-model="local[key]",
        :type="field.type",
        :select-options="field.options",
        :validation="field.validators ? $v.local[key] : undefined",
        :attributes="field.attributes",
        :label="$t(field.label)",
        :helper-label="$t(field.helperLabel)",
        :error-label="$t(field.errorLabel)",
        :class="{ 'col-xl-6': !field.fullWidth, 'col-12': field.fullWidth }"
        )
    .row.xs-gutter.full-width.justify-end.items-end
      slot(name="form-buttons-add")
      slot(name="form-buttons")
        submit-button.q-mt-md(
        :active="maySubmit",
        ) {{ $t(schema.submit.label) || $t('buttons.submit') }}
    mb-notification-service
</template>

<script>
  import Vue from 'vue'
  import Vuelidate from 'vuelidate'
  import Promise from 'bluebird'

  import FormRow from './FormRow'
  import FormRowCheckbox from './FormRowCheckbox'
  import SubmitButton from './SubmitButton'

  import {
    Loading,
    QSpinnerPuff
  } from 'quasar'

  Vue.use(Vuelidate)

  export default {
    components: {
      FormRow,
      FormRowCheckbox,
      SubmitButton
    },
    props: ['value', 'schema'],
    data () {
      return {
        typemap: {
          'password': 'text'
        },
        local: undefined,
        loaded: false
      }
    },
    mounted () {
      this.initForm()
    },
    computed: {
      initial () {
        const initial = {}
        for (let key in this.fields) {
          if (this.fields[key].initial) {
            initial[key] = this.fields[key].initial
          }
        }
        return this.$store.state.forms[this.schema.state] || initial
      },
      fields: function () {
        return this.schema && this.schema.fields
          ? this.schema.fields : {}
      },
      validators () {
        const validators = {}
        for (let key in this.fields) {
          if (this.fields[key].validators) {
            validators[key] = this.fields[key].validators
          }
        }
        return validators
      },
      isDirty () {
        let dirty = false
        if (this.$v && this.$v.local) {
          for (let key in this.local) {
            if (this.$v.local[key] && this.$v.local[key].$dirty) {
              dirty = true
            }
          }
          return dirty
        }
      },
      maySubmit () {
        return (!this.$v && !this.$v.local) ||
          (!this.$v.local.$invalid && this.isDirty)
      }
    },
    methods: {
      initForm () {
        const ctx = this
        if (this.value && this.value.then) {
          this.value.then(data => {
            ctx.local = data
            ctx.loaded = true
          })
        }
        else {
          this.local = this.initial
          this.loaded = true
        }
      },
      handleSubmit () {
        if (this.maySubmit &&
          typeof this.schema.submit.handler === 'function') {
          const { $store, schema } = this
          Loading.show({
            spinner: QSpinnerPuff,
            spinnerSize: 200,
            spinnerColor: 'grey'
          })
          Promise.resolve()
            .then(schema.submit.handler)
            .then(function (res) {
              let message = schema.submit ? schema.submit.message : undefined
              message = message || (res ? res.message() : 'messages.submit_success')
              Loading.hide()
              $store.commit('notifications/addMessage', {
                body: message,
                type: 'success'
              })
              if (schema.state) {
                $store.commit(`forms/${schema.state}`, null)
              }
            })
            .catch(function (err) {
              Loading.hide()
              console.debug('Form submit:', err)
              $store.commit('notifications/addMessage', {
                body: err.message
                  ? `${err.message}${err.code
                    ? ' (' + err.code + ')' : ''}`
                  : 'messages.submit_error',
                mode: 'alert',
                type: 'error'
              })
            })
        }
      },
      isType (type, test) {
        return this.typemap[type]
          ? this.typemap[type] === test : type === test
      }
    },
    watch: {
      local: {
        handler (data) {
          if (!data) {
            this.initForm()
          }
          this.$emit('input', data)
          if (this.schema.state) {
            this.$store.commit(`forms/${this.schema.state}`, data)
          }
        },
        deep: true
      }
    },
    validations () {
      return { local: this.validators }
    }
  }
</script>

<style></style>
