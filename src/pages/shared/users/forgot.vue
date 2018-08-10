<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.users.forgot.title') }}
    p.caption(slot="form-caption") {{ $t('routes.users.forgot.caption') }}
    form-main(v-model="payload", :schema="schema")
      q-btn(flat, color="light", slot="form-buttons-add",
      @click="$router.push({ name: 'users.login' })"
      ) {{ $t('buttons.login') }}
</template>

<script>
  import CenterCardThreeQuarter from 'mbjs-quasar/src/components/layouts/CenterCardThreeQuarter'
  import { FormMain } from '../../../components/shared/forms'
  import { required, email } from 'vuelidate/lib/validators'
  export default {
    components: {
      CenterCardThreeQuarter,
      FormMain
    },
    data () {
      return {
        schema: {
          fields: {
            email: {
              fullWidth: true,
              type: 'text',
              label: 'labels.email',
              errorLabel: 'errors.invalid_email',
              validators: {
                required,
                email
              }
            }
          },
          submit: {
            handler () {
              throw new Error('not implemented')
            },
            label: 'buttons.request_reset_pass',
            message: 'messages.request_reset_success'
          }
        },
        payload: undefined
      }
    }
  }
</script>

<style></style>
