<template lang="pug">

  card-full
    // hide logo
    //
    span(slot="form-logo")

    span(slot="form-title") {{ $t('routes.users.first_login.title') }}

    p.caption(slot="form-caption") {{ $t('routes.users.first_login.caption') }}
    form-main(v-model="payload", :schema="schema")
    q-btn.bg-primary(v-for="button in buttons", :label="button.label")

</template>

<script>
  import CardFull from '../../../components/shared/layouts/CardFull'
  import { FormMain } from '../../../components/shared/forms'
  // import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'
  import { required, sameAs, minLength } from 'vuelidate/lib/validators'

  export default {
    components: {
      CardFull,
      FormMain
    },
    data () {
      const context = this
      return {
        /**
         * Store this form's contents in the VueX store (in memory)
         */
        buttons: [
          { type: 'close', label: 'close account', color: 'primary' },
          { type: 'export', label: 'export data', color: 'primary' },
          { type: 'import', label: 'import data', icon: 'highlight off' }
        ],
        state: 'registration',
        payload: undefined,
        schema: {
          fields: {
            name: {
              type: 'text',
              label: 'labels.name',
              errorLabel: 'errors.field_required',
              validators: {
                required,
                minLength: minLength(2)
              }
            },
            organisation: {
              type: 'text',
              label: 'labels.organisation'
            },
            password: {
              type: 'password',
              label: 'labels.password',
              errorLabel: 'errors.invalid_password',
              attributes: { autocomplete: 'section-login new-password' },
              validators: {
                required,
                minLength: minLength(6)
              }
            },
            password_confirmation: {
              type: 'password',
              label: 'labels.password_confirmation',
              errorLabel: 'errors.invalid_password_confirmation',
              attributes: { autocomplete: 'section-login current-password-confirmation' },
              validators: {
                required,
                sameAsPassword: sameAs('password')
              }
            }
          },
          submit: {
            handler () {
              context.$store.dispatch('users/create', context.payload)
                .then(() => context.$router.replace({ name: 'users.login' }))
            },
            // label: 'buttons.create_account',
            label: 'buttons.save',
            message: 'messages.registration_success'
          }
        }
      }
    }
  }
</script>

<style></style>
