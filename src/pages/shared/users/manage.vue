<template lang="pug">
  full-screen

    content-block(position="first")

      headline(:content="$t('routes.users.manage.title')")
        | {{ $t('routes.users.manage.caption') }}
        template(v-if="$route.params.isFirst")
          | {{ $t('routes.users.manage.first_login') }}

      content-paragraph
        h6 {{ $t('labels.profile') }}
        form-main(v-model="profile", :schema="profileSchema")

      content-paragraph(v-if="!$route.params.isFirst")
        h6 {{ $t('labels.account_credentials') }}
        form-main(v-model="credentials", :schema="credentialsSchema")
          // q-btn.q-mr-md.bg-grey-9(v-if="!$route.params.isFirst", slot="form-buttons-add", :label="$t('buttons.close_account')")
</template>

<script>
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import { FormMain } from '../../../components/shared/forms'
  import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  export default {
    components: {
      FullScreen,
      FormMain,
      Headline,
      ContentBlock,
      ContentParagraph
    },
    data () {
      const context = this
      return {
        state: 'manage-profile',
        profileSchema: {
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
            }
          },
          submit: {
            async handler () {
              const profile = await context.$store.dispatch(
                'profiles/patch',
                [context.$store.state.auth.user.uuid, context.payload]
              )
              if (profile) {
                const user = Object.assign({}, context.$store.state.auth.user)
                user.profile = Object.assign({}, user.profile, profile)
                context.$auth._setUser(user, context.$store)
              }
              if (context.$route.params.isFirst && context.$route.params.redirect) {
                context.$router.push(context.$route.params.redirect.fullPath)
              }
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        },
        profile: context.$store.dispatch('profiles/get', context.$store.state.auth.user.uuid),

        credentialsSchema: {
          fields: {
            email: {
              type: 'text',
              label: 'labels.email',
              errorLabel: 'errors.field_required',
              validators: {
                required,
                email
              }
            },
            password: {
              type: 'password',
              label: 'labels.password',
              errorLabel: 'errors.minimum_length_6',
              validators: {
                minLength: minLength(6)
              }
            },
            password_repeat: {
              type: 'password',
              label: 'labels.password_confirmation',
              errorLabel: 'errors.passwords_do_not_match',
              validators: {
                sameAsPassword: sameAs('password')
              }
            }
          },
          submit: {
            async handler () {
              const payload = {}
              if (context.credentials.password) payload.password = context.credentials.password
              else payload.email = context.credentials.email
              try {
                await context.$store.dispatch('auth0/patchUser', [context.$store.state.auth.user.sub, payload])
                context.credentials.password_repeat = undefined
                context.credentials.password = undefined
              }
              catch (err) {
                throw new Error(err.response.data.message)
              }
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        },
        credentials: context.$store.dispatch('auth0/getUser', context.$store.state.auth.user.sub)
      }
    },
    computed: {
      password () {
        return this.credentials.password
      }
    }
  }
</script>

<style></style>
