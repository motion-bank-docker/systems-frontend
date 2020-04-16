<template lang="pug">
  full-screen
    content-block.text-center(:position="'first'")
      headline(:content="$t('labels.invitation')")

    template(v-if="invitation")
      content-block.text-center
        | {{ $t('messages.group_invite_request', { name: invitation.creator.name, group: group.title }) }}

      content-block.text-center
        q-btn.q-mr-md(color="positive", @click="response('accept')", :label="$t('buttons.accept')")
        q-btn(color="negative", @click="response('reject')", :label="$t('buttons.reject')")

    template(v-if="invalid")
      content-block.text-center
        | {{ $t('errors.invite_invalid') }}
      content-block.text-center
        q-btn(color="grey", @click="$router.push({ name: 'users.manage' })", :label="$t('buttons.confirm')")
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
        group: undefined,
        invalid: false
      }
    },
    async mounted () {
      try {
        const result = await this.$store.dispatch('invites/find', {
          code: this.$route.params.code
        })
        this.invitation = result.items.pop()
        if (this.invitation) {
          this.group = await this.$store.dispatch('groups/get', this.invitation.group_id)
        }
        else this.invalid = true
      }
      catch (err) {
        this.invalid = true
      }
    },
    methods: {
      async response (action) {
        this.$q.loading.show()
        try {
          await this.$axios.get(
            `${process.env.API_HOST}/invites/${this.invitation.code}/${action}`,
            { headers: { Authorization: `${this.$auth.tokenType} ${this.$auth.token}` } })
          if (action === 'accept') {
            this.$store.commit('notifications/addMessage', {
              body: 'messages.invite_accepted', mode: 'alert', type: 'success'
            })
          }
          else if (action === 'reject') {
            this.$store.commit('notifications/addMessage', {
              body: 'messages.invite_rejected', mode: 'alert', type: 'success'
            })
          }
        }
        catch (err) {
          this.$store.commit('notifications/addMessage', {
            body: 'errors.invite_failed', mode: 'alert', type: 'error'
          })
        }
        this.$q.loading.hide()
        this.$router.push({ name: 'users.manage' })
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
