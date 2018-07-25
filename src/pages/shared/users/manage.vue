<template lang="pug">

  // center-card-three-quarter
  card-full

    // hides logo
    span(slot="form-logo")

    h5.no-margin(slot="form-title")
      div(v-if="state == 'manage-profile'")
        span.text-grey-6 {{ $t('routes.users.manage.title') }}
        br
        | {{ $t('routes.users.manage.caption') }}
      div(v-else)
        span.text-grey-6 {{ $t('routes.users.first_login.title') }}
        br
        | {{ $t('routes.users.first_login.caption') }}

    // form-main(v-if="payload !== undefined", v-model="payload", :schema="schema")
    form-main(v-model="payload", :schema="schema")
      q-btn.q-mr-md.bg-grey-9(v-if="state == 'manage-profile'", slot="form-buttons-add", label="close account")

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
        state: 'manage-profile',
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
            /* email: {
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
            }, */
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
                minLength: minLength(6)
              }
            },
            password_confirmation: {
              type: 'password',
              label: 'labels.password_confirmation',
              errorLabel: 'errors.invalid_password_confirmation',
              attributes: { autocomplete: 'section-login current-password-confirmation' },
              validators: {
                sameAsPassword: sameAs('password')
              }
            }
          },
          submit: {
            handler () {
              return context.$store.dispatch('users/patch',
                [context.$store.state.auth.payload.userId, context.payload])
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        },
        payload: context.$store.dispatch('users/get', context.$route.params.id)
      }
    }
  }
</script>

<style></style>
