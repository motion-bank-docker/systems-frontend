<template lang="pug">
  full-screen

    content-block.text-center(:position="'first'")
      headline(:content="$t('labels.invitation')")

    content-block.text-center
      | You have been invited by {{ invitation.from }} to join Group {{ invitation.into }}.

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
        invitation: {
          from: 'Person X',
          into: 'Testgruppe'
        }
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
