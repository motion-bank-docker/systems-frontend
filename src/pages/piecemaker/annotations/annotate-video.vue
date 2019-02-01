<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.annotate.video.title') }}
    p.caption(slot="form-caption") {{ $t('routes.annotate.video.caption') }}
    form-main(v-model="payload", :schema="schema")
</template>

<script>
  import CenterCardThreeQuarter from '../../../components/shared/layouts/CenterCardThreeQuarter'
  import { FormMain } from '../../../components/shared/forms/index'
  import { required, url } from 'vuelidate/lib/validators'
  export default {
    components: {
      CenterCardThreeQuarter,
      FormMain
    },
    data () {
      const _this = this
      return {
        video: {
          src: undefined
        },
        maps: [],
        schema: {
          fields: {
            video_url: {
              fullWidth: true,
              type: 'text',
              label: 'labels.video_url',
              errorLabel: 'errors.invalid_url',
              validators: { required, url }
            }
          },
          submit: {
            handler () {
              _this.$router.push({
                path: `/annotations/${_this.$route.params.mapId}/edit`,
                query: { url: _this.payload.video_url }
              })
            }
          }
        }
      }
    }
  }
</script>
