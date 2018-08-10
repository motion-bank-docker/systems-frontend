<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small)

    .q-pa-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.timelines.edit.title') }}
      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
            q-btn.q-mr-md.bg-grey-9(q-if="$route.params.id", slot="form-buttons-add", :label="exportLabel", @click="exportTimeline")
      // .row
      //   .col-md-12
      //     tags(v-if="payload", :targetUuid="payload.uuid", fullWidth)
</template>

<script>
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'
  import FullScreen from 'mbjs-quasar/src/components/layouts/FullScreen'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'

  import { openURL } from 'quasar'

  export default {
    components: {
      FormMain,
      Tags,
      FullScreen
    },
    data () {
      const _this = this
      return {
        downloadURL: undefined,
        exportLabel: this.$t('buttons.export_timeline'),
        type: constants.MAP_TYPE_TIMELINE,
        payload: this.$route.params.id ? _this.$store.dispatch('maps/get', _this.$route.params.id) : undefined,
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
              return _this.$store.dispatch('maps/patch', [_this.payload.uuid, _this.payload])
                .then(() => _this.$router.push({ name: 'piecemaker.timelines.list' }))
            }
          }
        }
      }
    },
    methods: {
      exportTimeline () {
        const _this = this
        if (this.downloadURL) return openURL(this.downloadURL)
        this.$axios.post(
          `${process.env.API_HOST}/archives/maps`,
          { id: this.$route.params.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.access_token}`
            }
          }
        ).then(result => {
          _this.downloadURL = `${process.env.API_HOST}/archives/maps/${result.data}`
          _this.exportLabel = _this.$t('buttons.download_archive')
        })
      }
    }
  }
</script>
