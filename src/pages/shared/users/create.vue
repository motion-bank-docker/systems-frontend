<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.users.create.title') }}
    p.caption(slot="form-caption") {{ $t('routes.users.create.caption') }}
    form-main(v-model="payload", :schema="schema")
</template>

<script>
  import CenterCardThreeQuarter from '../../../components/shared/layouts/CenterCardThreeQuarter'
  import { FormMain } from '../../../components/shared/forms'
  import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'
  export default {
    components: {
      CenterCardThreeQuarter,
      FormMain
    },
    data () {
      const context = this
      return {
        /**
         * Store this form's contents in the VueX store (in memory)
         */
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
            email: {
              type: 'text',
              label: 'labels.email',
              errorLabel: 'errors.invalid_email',
              validators: {
                required,
                email
              }
            },
            location: {
              type: 'text',
              label: 'labels.location'
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
            },
            terms: {
              type: 'checkbox',
              label: 'labels.accept_terms',
              initial: false,
              validators: {
                termsAccepted (val) {
                  return val === true
                }
              }
            }
          },
          submit: {
            handler () {
              context.$store.dispatch('users/create', context.payload)
                .then(() => context.$router.replace({ name: 'users.login' }))
            },
            label: 'buttons.create_account',
            message: 'messages.registration_success'
          }
        }
      }
    }
  }
</script>

<style></style>
