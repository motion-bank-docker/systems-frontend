<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.users.manage.title') }}
    p.caption(slot="form-caption") {{ $t('routes.users.manage.caption') }}
    form-main(v-if="payload !== undefined", v-model="payload", :schema="schema")
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
            label: 'buttons.save_changes',
            message: 'messages.update_success'
          }
        },
        payload: context.$store.dispatch('users/get', context.$route.params.id)
      }
    }
  }
</script>

<style></style>
