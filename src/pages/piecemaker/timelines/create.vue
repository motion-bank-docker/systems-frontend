<template lang="pug">
  full-screen

    // -----------------------------------------------------------------------------------------------------------------
    // add new timeline
    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.timelines.create.title')")

      content-paragraph
        form-main(v-model="payload", :schema="schema")

    // -----------------------------------------------------------------------------------------------------------------
    //
    // import timeline
    content-block(:position="'last'")
      headline(:content="$t('forms.timelines.import.title')")

      // new title (optional)
      content-paragraph(:position="first")
        q-input(dark, :float-label="$t('forms.timelines.import.fields.title')", v-model="uploadTitle")

      // set ownership
      content-paragraph
        q-checkbox(dark, :label="$t('forms.timelines.import.fields.override_author')", v-model="overrideAuthor")

      content-paragraph(:position="last")
          uploader(dark, :url="url", @finish="onFinish", allowed=".zip", :headers="headers", :fields="uploadFields")
</template>

<script>
  import { mapGetters } from 'vuex'
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'
  import BackButtonNew from '../../../components/shared/buttons/BackButtonNew'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    components: {
      FormMain,
      Tags,
      BackButtonNew,
      Headline,
      ContentBlock,
      ContentParagraph
    },
    data () {
      const _this = this
      return {
        url: `${this.$store.state.settings.apiHost}/archives/maps`,
        responses: {},
        uploadFields: [],
        uploadTitle: undefined,
        overrideAuthor: false,
        skipAcl: false,
        headers: {
          Authorization: `${this.$auth.tokenType} ${this.$auth.token}`
        },
        type: constants.mapClasses.MAP_CLASS_TIMELINE,
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
              _this.payload.type = [constants.mapClasses.MAP_CLASS_TIMELINE]
              return _this.$store.dispatch('maps/post', _this.payload)
                .then(() => _this.$router.push({ name: 'piecemaker.timelines.list' }))
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
    mounted () {
      this.$root.$emit('setBackButton', '/piecemaker/timelines')
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
