<template lang="pug">
  full-screen
    q-btn(v-if="!isMobile", slot="backButton", @click="$router.push({ name: 'documents.list' })",
    icon="keyboard_backspace", round, small)

    content-block(:position="'first'")
      headline(:content="$t('routes.documents.create.title')")

      content-paragraph(:position="'first'")
        uploader(v-if="user", dark, :url="url", @finish="onFinish", :headers="headers", :fields="uploadFields")

</template>

<script>
  import { mapGetters } from 'vuex'
  import Headline from '../../components/shared/elements/Headline'
  import ContentBlock from '../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../components/shared/elements/ContentParagraph'

  export default {
    components: {
      Headline,
      ContentBlock,
      ContentParagraph
    },
    data () {
      return {
        uploadFields: [],
        headers: {
          Authorization: `Bearer ${this.$auth.token}`
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        isMobile: 'globalSettings/getIsMobile'
      }),
      url () {
        return this.user ? `${process.env.STORAGE_HOST}/files/user-${this.user.uuid}` : undefined
      }
    },
    mounted () {
      this.$root.$emit('setBackButton', 'list')
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
              body: 'messages.document_created',
              mode: 'alert',
              type: 'success'
            })
            this.$router.push({ name: 'documents.list' })
          }
        }
      }
    }
  }
</script>
