<template lang="pug">
  form-main(v-model="payload", :schema="schema")
    q-btn(slot="form-buttons-add", @click="cancel") {{ $t('buttons.cancel') }}
</template>

<script>
  import FormMain from '../../shared/forms/FormMain'
  import { QBtn } from 'quasar-framework'
  import { required } from 'vuelidate/lib/validators'
  import uuidValidate from 'uuid-validate'
  export default {
    components: {
      FormMain,
      QBtn
    },
    props: ['redirectTo', 'groupId'],
    data () {
      const context = this
      return {
        payload: uuidValidate.version(this.$route.params.id)
          ? context.$store.dispatch('annotations/get', context.$route.params.id) : undefined,
        schema: {
          fields: {
            url: {
              fullWidth: true,
              type: 'text',
              label: 'labels.video_url',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              context.payload.author = context.$store.state.auth.payload.userId
              context.payload.motivation = 'linking'
              context.payload.target = this.$route.params.groupId || context.groupId
              context.$store.dispatch(context.payload.uuid ? 'annotations/patch' : 'annotations/create', context.payload)
                .then(() => {
                  if (context.redirectTo) {
                    context.$router.push(context.redirectTo)
                  }
                })
            }
          }
        }
      }
    }
  }
</script>
