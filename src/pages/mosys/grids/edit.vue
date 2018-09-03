<template lang="pug">
  full-screen
    .q-px-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.mosys.grids.edit.title') }}
      access-right
      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
      // .row
      //   .col-md-12
      //     tags(v-if="payload", :targetUuid="payload.uuid", fullWidth)
</template>

<script>
  import AccessRight from '../../../components/shared/partials/AccessRight'
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    components: {
      AccessRight,
      FormMain,
      Tags
    },
    data () {
      const _this = this
      return {
        type: constants.MAP_TYPE_2D_GRID,
        payload: this.$route.params.id ? _this.$store.dispatch('maps/get', _this.$route.params.id) : undefined,
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
              return _this.$store.dispatch('maps/patch', [_this.payload.uuid, _this.payload])
                .then(() => _this.$router.push({ name: 'mosys.grids.list' }))
            }
          }
        }
      }
    }
  }
</script>
