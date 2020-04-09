<template lang="pug">
  full-screen
    content-block(:position="'first'")

      headline(:content="$t('routes.users.manage.title')")
        | {{ $t('routes.users.manage.caption') }}

      content-paragraph
        form-main(v-model="payload", :schema="schema")
          div(slot="form-buttons-add")
            q-btn.q-mr-md(@click="$router.push({ name: 'users.list' })") {{ $t('buttons.cancel') }}
</template>

<script>
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import { FormMain } from '../../../components/shared/forms'
  import { required, minLength } from 'vuelidate/lib/validators'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'
  import { uuid } from 'mbjs-utils'

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
      let payload
      if (context.$route.params.id) {
        payload = context.$store.dispatch('auth0/getUser', context.$route.params.id).then(user => {
          user.roles = user.app_metadata.roles.sort().join(', ')
          user.features = user.app_metadata.features.sort().join(', ')
          return user
        })
      }
      else {
        payload = {
          email: undefined,
          email_verified: false,
          roles: undefined,
          features: undefined
        }
      }
      return {
        schema: {
          fields: {
            email: {
              type: 'text',
              label: 'labels.email',
              errorLabel: 'errors.field_required',
              validators: {
                required,
                minLength: minLength(2)
              }
            },
            email_verified: {
              type: 'checkbox',
              label: 'labels.email_verified'
            },
            roles: {
              type: 'textarea',
              label: 'labels.roles'
            },
            features: {
              type: 'textarea',
              label: 'labels.features'
            }
          },
          submit: {
            async handler () {
              const payload = {
                email: context.payload.email,
                email_verified: context.payload.email_verified,
                app_metadata: {
                  roles: (context.payload.roles || '').split(',').map(v => v.trim()).filter(v => v.length),
                  features: (context.payload.features || '').split(',').map(v => v.trim()).filter(v => v.length)
                }
              }
              if (!Array.isArray(payload.app_metadata.roles)) payload.app_metadata.roles = []
              if (!Array.isArray(payload.app_metadata.features)) payload.app_metadata.features = []
              if (context.$route.params.id) {
                await context.$store.dispatch('auth0/patchUser', [context.payload.user_id, payload])
              }
              else {
                payload.password = uuid.v4()
                await context.$store.dispatch('auth0/createUser', payload)
              }
              context.$router.push({ name: 'users.list' })
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        },
        payload
      }
    }
  }
</script>

<style></style>
