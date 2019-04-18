<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small)

    .q-pa-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.timelines.create.title') }}
      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
      .row
        .col-12
          h5.caption(dark) {{ $t('forms.timelines.import.title') }}
      .column
        .col-12.q-pa-md
          q-input(dark, :placeholder="$t('forms.timelines.import.fields.title')", v-model="uploadTitle")
        .col-12.q-pa-md
          q-checkbox(dark, :label="$t('forms.timelines.import.fields.override_author')", v-model="overrideAuthor")
        <!--.col-12.q-pa-md-->
          <!--q-checkbox(dark, :label="$t('forms.timelines.import.fields.skip_acl')", v-model="skipAcl")-->
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
        type: constants.mapTypes.MAP_TYPE_TIMELINE,
        payload: undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.timeline_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              _this.payload.type = [constants.mapTypes.MAP_TYPE_TIMELINE]
              return _this.$store.dispatch('maps/post', _this.payload)
                .then(() => _this.$router.push({ name: 'piecemaker.timelines.list' }))
            }
          }
        }
      }
    },
    watch: {
      uploadTitle (val) {
        this.setOrAddField('title', val)
      },
      overrideAuthor (val) {
        this.setOrAddField('overrideAuthor', val)
      },
      skipAcl (val) {
        this.setOrAddField('skipAcl', val)
      }
    },
    methods: {
      setOrAddField (name, value) {
        let containsField = false
        for (let index in this.uploadFields) {
          if (!containsField && name === this.uploadFields[index].name) {
            containsField = true
            if (value) this.uploadFields[index].value = value
            else this.uploadFields[index] = undefined
          }
        }
        if (value && !containsField) this.uploadFields.push({ name, value })
        this.uploadFields = this.uploadFields.filter(field => field)
      },
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
              body: 'messages.timeline_imported',
              mode: 'alert',
              type: 'success'
            })
            this.$router.push({ name: 'piecemaker.timelines.list' })
          }
        }
      }
    }
  }
</script>
