<template lang="pug">
  full-screen
    .q-pa-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.groups.create.title') }}
      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
</template>

<script>
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'
  import FullScreen from '../../../components/shared/layouts/FullScreen'

  import { required } from 'vuelidate/lib/validators'
  import constants from '../../../lib/constants'

  export default {
    components: {
      FormMain,
      Tags,
      FullScreen
    },
    data () {
      const _this = this
      return {
        type: constants.MAP_TYPE_TIMELINE,
        payload: undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.group_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              _this.payload.type = [constants.MAP_TYPE_TIMELINE]
              return _this.$store.dispatch('maps/post', _this.payload)
                .then(() => _this.$router.push({ name: 'piecemaker.groups.list' }))
            }
          }
        }
      }
    }
  }
</script>
