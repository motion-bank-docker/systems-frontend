<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.users.login.title') }}
    p.caption(slot="form-caption")
      | {{ $t('routes.users.login.caption') }}
      br
      router-link(:to="{ name: 'users.create' }") {{ $t('links.click_to_register') }}
    form-main(v-model="payload", :schema="schema")
      q-btn(flat, color="light", slot="form-buttons-add",
        @click="$router.push({ name: 'users.forgot' })") {{ $t('buttons.forgot_password') }}
</template>

<script>
  import CenterCardThreeQuarter from '../../../shared/layouts/CenterCardThreeQuarter'
  import { FormMain } from '../../../shared/forms'
  import { QBtn } from 'quasar-framework'
  import { required, minLength, email } from 'vuelidate/lib/validators'
  export default {
    components: {
      QBtn,
      CenterCardThreeQuarter,
      FormMain
    },
    data () {
      const _this = this
      function handler () {
        /**
         * Strategy 'local' for retrieving the JWT via email/password
         */
        _this.payload.strategy = 'local'
        return _this.$store.dispatch('auth/authenticate', _this.payload)
          .then(() => {
            /**
             * If there is a saved original destination, redirect there
             */
            if (_this.redirect) {
              return _this.$router.replace(_this.redirect)
            }
            /**
             * Otherwise redirect to users edit page
             */
            _this.$router.replace(`/users/${_this.$store.state.auth.payload.userId}/edit`)
          })
      }

      const schema = {
        fields: {
          email: {
            type: 'text',
            label: 'labels.email',
            errorLabel: 'errors.invalid_email',
            attributes: { autocomplete: 'section-login current-email' },
            validators: { required, email }
          },
          password: {
            type: 'password',
            label: 'labels.password',
            errorLabel: 'errors.invalid_password',
            attributes: { autocomplete: 'section-login current-password' },
            validators: { required, minLength: minLength(6) }
          }
        },
        submit: {
          handler
        }
      }

      return {
        /**
         * Save the original destination when redirected from a private route
         */
        redirect: this.$route.query.redirect,
        label: 'buttons.login',
        message: 'messages.login_success',
        payload: undefined,
        schema
      }
    }
  }
</script>

<style></style>
