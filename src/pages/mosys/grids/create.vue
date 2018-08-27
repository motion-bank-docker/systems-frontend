<template lang="pug">
  full-screen
    .q-pa-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.mosys.grids.create.title') }}
      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
</template>

<script>
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    components: {
      FormMain,
      Tags
    },
    data () {
      const _this = this
      return {
        type: constants.MAP_TYPE_2D_GRID,
        payload: undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.grid_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              _this.payload.type = [constants.MAP_TYPE_2D_GRID]
              return _this.$store.dispatch('maps/post', _this.payload)
                .then(() => _this.$router.push({ name: 'mosys.grids.list' }))
            }
          }
        }
      }
    }
  }
</script>
