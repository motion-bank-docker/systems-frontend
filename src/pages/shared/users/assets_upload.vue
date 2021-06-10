<template lang="pug">
  full-screen

    content-block(:position="'first'")
      headline(:content="$t('routes.users.assets_upload.title')")

      content-paragraph(:position="'last'")
        q-input.q-mb-md(:float-label="$t('labels.target_path_optional')" v-model="targetPath" dark)
        uploader(dark :url="url" :headers="headers" :multiple="false" :fields="uploadFields"
          @finish="onFileFinish" @select="onFileSelect")
</template>

<script>
  import { mapGetters } from 'vuex'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  export default {
    components: {
      FormMain,
      Headline,
      ContentBlock,
      ContentParagraph
    },
    data () {
      return {
        targetPath: undefined,
        uploadFields: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      url () {
        return this.user ? `${process.env.API_HOST}/assets/user-${this.user.uuid}` : undefined
      },
      headers () {
        return {
          Authorization: `Bearer ${this.$auth.token}`
        }
      }
    },
    watch: {
      targetPath (value) {
        if (value) {
          this.uploadFields = [{
            name: 'basePath',
            value: value
          }]
        }
        else this.uploadFields = []
      }
    },
    methods: {
      onFileSelect (selection) {
        console.debug('selection', selection)
      },
      onFileFinish (responses) {
        let hasErrors = false
        for (const key of Object.keys(responses)) {
          hasErrors = hasErrors || !responses[key]
        }
        if (hasErrors) {
          return this.$store.commit('notifications/addMessage', {
            body: 'errors.upload_assets_errors', mode: 'alert', type: 'error'
          })
        }
        this.$store.commit('notifications/addMessage', {
          body: 'messages.upload_assets_success', mode: 'alert', type: 'success'
        })
        this.$router.push({ name: 'users.assets' })
      }
    }
  }
</script>

<style lang="stylus">
</style>
