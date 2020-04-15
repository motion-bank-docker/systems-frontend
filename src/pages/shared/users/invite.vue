<template lang="pug">
  full-screen
    template(v-if="invitation")
      content-block.text-center(:position="'first'")
        headline(:content="$t('labels.invitation')")

      content-block.text-center
        | {{ $t('messages.group_invite_request', { name: invitation.creator.name, group: group.title }) }}

      content-block.text-center
        q-btn.bg-positive.q-mr-md(@click="accept()", :label="$t('labels.accept')", flat)
        q-btn.bg-negative(@click="reject()", :label="$t('labels.reject')", flat)
</template>

<script>
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import Headline from '../../../components/shared/elements/Headline'

  export default {
    name: 'invite',
    components: { ContentBlock, Headline },
    data () {
      return {
        invitation: undefined,
        group: undefined
      }
    },
    async mounted () {
      const result = await this.$store.dispatch('invites/find', {
        code: this.$route.params.code
      })
      this.invitation = result.items.pop()
      if (this.invitation) {
        this.group = await this.$store.dispatch('groups/get', this.invitation.group_id)
      }
    },
    methods: {
      accept () {
        console.log('accept')
      },
      reject () {
        console.log('reject')
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
