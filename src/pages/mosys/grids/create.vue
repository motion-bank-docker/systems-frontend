<template lang="pug">
  full-screen
    .q-pa-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.mosys.grids.create.title') }}
      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
      .row
        .col-12
          h5.caption(dark) {{ $t('forms.grids.import.title') }}
      .column
        .col-12.q-pa-md
          q-input(dark, :placeholder="$t('forms.grids.import.fields.title')", v-model="uploadTitle")
        .col-12.q-pa-md
          q-checkbox(dark, :label="$t('forms.grids.import.fields.override_author')", v-model="overrideAuthor")
        <!--.col-12.q-pa-md-->
          <!--q-checkbox(dark, :label="$t('forms.grids.import.fields.skip_acl')", v-model="skipAcl")-->
        .col-12.q-pa-md
          uploader(dark, :url="url", @finish="onFinish", allowed=".zip", :headers="headers", :fields="uploadFields")
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
        url: `${process.env.API_HOST}/archives/maps/upload`,
        responses: {},
        uploadFields: [],
        uploadTitle: undefined,
        overrideAuthor: false,
        skipAcl: false,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
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
    },
    watch: {
      uploadTitle () {
        if (this.uploadTitle) {
          this.uploadFields = [
            { name: 'title', value: this.uploadTitle },
            { name: 'overrideAuthor', value: this.overrideAuthor },
            { name: 'skipAcl', value: this.skipAcl }
          ]
        }
        else this.uploadFields = []
      }
    },
    methods: {
      onFinish (responses) {
        for (let key of Object.keys(responses)) {
          if (responses[key] && responses[key].message) {
            this.$store.commit('notifications/addMessage', {
              body: responses[key].message,
              mode: 'alert',
              type: 'error'
            })
          }
          else {
            this.$store.commit('notifications/addMessage', {
              body: 'messages.grid_imported',
              mode: 'alert',
              type: 'success'
            })
            this.$router.push({ name: 'mosys.grids.list' })
          }
        }
      }
    }
  }
</script>
