<template lang="pug">
  card-full
    span(slot="form-logo")
    span(slot="form-title") Upload video(s)
    .row(v-if="url")
      .col-12
        uploader(:url="url", @finish="onFinish")
</template>

<script>
  import { DateTime } from 'luxon'
  import CardFull from '../../../shared/layouts/CardFull'
  import Uploader from '../../../shared/media/Uploader'
  import buildVars from '../../../../lib/build-vars'
  import constants from '../../../../lib/constants'
  export default {
    components: {
      CardFull,
      Uploader
    },
    data () {
      return {
        url: buildVars().streamerHost,
        responses: {}
      }
    },
    methods: {
      getVideoURL (response) {
        return `${this.url}/${response.doc.uuid}${response.doc.extname}`
      },
      createAnnotation (response) {
        const
          _this = this,
          apiPayload = {
            body: {
              source: this.getVideoURL(response),
              type: 'Video',
              purpose: 'linking'
            },
            author: this.$store.state.auth.payload.userId,
            target: {
              id: this.$route.params.groupId || this.groupId,
              type: constants.MAP_TYPE_TIMELINE,
              selector: {
                type: 'Fragment',
                value: DateTime.fromISO(response.doc.created).toISO()
              }
            }
          }
        return Promise.resolve()
          .then(() => {
            return _this.$store.dispatch('annotations/create', apiPayload)
          })
      },
      async onFinish (responses) {
        this.responses = responses
        console.debug('uploader finished', this.responses)

        for (let key of Object.keys(responses)) {
          await this.createAnnotation(responses[key])
          console.log('added video', key)
        }
        console.debug('videos added to timeline')

        this.$router.push(`/piecemaker/groups/${this.$route.params.groupId}/videos`)
      }
    }
  }
</script>
