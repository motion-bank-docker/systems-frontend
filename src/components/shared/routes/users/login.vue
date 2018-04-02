<template lang="pug">
  center-card-three-quarter(v-if="showLogin")
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
    props: ['auth'],
    beforeMount () {
      const _this = this
      this.$authService()
        .checkSession(this.$store)
        .then(res => {
          if (res) {
            _this.$router.replace(_this.redirect || { name: 'users.edit', params: { id: 'me' } })
          }
          else {
            _this.showLogin = true
          }
        })
        .catch(() => {
          _this.showLogin = true
        })
    },
    data () {
      const _this = this
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
          handler () {
            return _this.$authService()
              .handleAuthentication(
                _this.payload,
                {
                  store: _this.$store,
                  redirect: _this.redirect
                })
          }
        }
      }

      return {
        /**
         * Save the original destination when redirected from a private route
         */
        showLogin: false,
        redirect: _this.$route.query.redirect,
        label: 'buttons.login',
        message: 'messages.login_success',
        payload: undefined,
        schema
      }
    }
  }
</script>

<style></style>
