<template lang="pug">
  full-screen

    content-block(:position="'first'")
      headline(:content="$t('routes.mosys.grids.create.title')")

      content-paragraph(:position="'last'")
        form-main(v-model="payload", :schema="schema")

    content-block(:position="'last'")
      headline(:content="$t('forms.grids.import.title')")

      content-paragraph
        q-input(dark, :float-label="$t('forms.grids.import.fields.title')", v-model="uploadTitle")

      content-paragraph
        q-checkbox(dark, :label="$t('forms.grids.import.fields.override_author')", v-model="overrideAuthor")

      content-paragraph(:position="'last'")
        uploader(dark, :url="url", @finish="onFinish", allowed=".zip", :headers="headers", :fields="uploadFields")

</template>

<script>
  import { mapGetters } from 'vuex'
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    components: {
      FormMain,
      Tags,
      Headline,
      ContentBlock,
      ContentParagraph
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
        type: constants.mapTypes.MAP_TYPE_2DGRID,
        payload: {},
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
              _this.payload.type = [constants.mapTypes.MAP_TYPE_2DGRID]
              return _this.$store.dispatch('maps/post', _this.payload)
                .then(() => _this.$router.push({ name: 'mosys.grids.list' }))
            }
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    },
    mounted () {
      this.$root.$emit('setBackButton', '/mosys/grids')
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
