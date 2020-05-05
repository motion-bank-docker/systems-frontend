<template lang="pug">
  full-screen

    confirm-modal(ref="confirmModal", @confirm="removeInvitation")
    confirm-modal(ref="confirmDeleteMemberModal", @confirm="removeMember")

    //------------------------------------------------------------------------------------------------------------ title
    content-block(:position="'first'")

      template(v-if="$route.params.uuid")
        headline(:content="$t('routes.groups.edit.title')")
          | {{ group ? group.title : '' }}
      template(v-else)
        headline(:content="$t('routes.groups.create.title')")
          | {{ $t('routes.groups.create.caption') }}

      form-main(v-model="group", :schema="schema")

    //------------------------------------------------------------------------------------------------------ invitations
    content-block(v-if="$route.params.uuid")

      headline(:content="$t('labels.invitations')")
        // | {{ $t('help.create_invitation') }}
        groups-stepper.bg-grey-8.q-mt-md(:defaultStep="'members'")

      q-table(:columns="invitations.columns", :data="invitations.items", dark,
        :pagination.sync="invitations.pagination", hide-bottom)

        q-td(slot="body-cell-actions", slot-scope="props", :props="props", auto-width)
          q-btn(:label="$t('buttons.copy_url')", flat, size="md", @click="copyUrl(props.row)")
          q-btn(:label="$t('buttons.delete')", flat, size="md",
            @click="$refs.confirmModal.show('messages.confirm_remove_invitation', props.row)")

      .text-right.q-mt-lg
        q-btn.no-shadow(@click="addInvitation", color="primary", icon="add", :label="$t('buttons.create_invitation')")

    //------------------------------------------------------------------------------------------------ confirmed members
    content-block.q-pb-lg(v-if="$route.params.uuid")

      headline(:content="$t('labels.members')")
        // | {{ $t('help.confirmed_members') }}

      q-table(:columns="memberColumns", :data="members", dark, :pagination.sync="memberPagination", hide-bottom)

        q-td(slot="body-cell-actions", slot-scope="props", :props="props", auto-width)
          q-btn(:label="$t('buttons.remove')", flat, size="md",
          @click="$refs.confirmDeleteMemberModal.show('messages.confirm_remove_member', props.row)")

</template>

<script>
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'
  import { required } from 'vuelidate/src/validators'
  import { DateTime } from 'luxon'
  import PromiseSpan from '../../../components/shared/elements/PromiseSpan'
  import GroupsStepper from '../../../components/shared/partials/GroupsStepper'

  export default {
    name: 'group_edit',
    components: {
      PromiseSpan,
      FormMain,
      ContentBlock,
      Headline,
      GroupsStepper
    },
    data () {
      const context = this
      let group
      if (this.$route.params.uuid) {
        group = this.$store.dispatch('groups/get', this.$route.params.uuid)
      }
      else group = { title: undefined }
      return {
        group,
        members: [],
        memberPagination: {},
        memberColumns: [
          {
            name: 'name',
            label: this.$t('labels.name'),
            align: 'left',
            field: 'name',
            sortable: true
          },
          {
            name: 'actions'
          }
        ],
        invitations: {
          items: [],
          pagination: {},
          columns: [
            {
              name: 'name',
              label: this.$t('labels.name'),
              align: 'left',
              field: 'name',
              sortable: true
            },
            {
              name: 'url',
              label: this.$t('labels.url'),
              align: 'left',
              field: 'code',
              format: val => `${document.location.origin}/users/invite/${val}`
            },
            {
              name: 'created',
              label: this.$t('labels.created'),
              align: 'right',
              field: 'created',
              sortable: true,
              format: val => DateTime.fromMillis(val).toLocaleString(DateTime.DATETIME_SHORT)
            },
            {
              name: 'actions'
            }
          ]
        },
        schema: {
          fields: {
            title: {
              type: 'text',
              label: 'labels.group_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            async handler () {
              if (context.$route.params.uuid) {
                return context.$store.dispatch('groups/patch',
                  [context.$route.params.uuid, context.group])
              }
              else {
                context.group = await context.$store.dispatch('groups/post', context.group)
                return context.$router.push({
                  name: 'users.groups_edit',
                  params: { uuid: context.group.uuid }
                })
              }
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        }
      }
    },
    watch: {
      group: {
        async handler (val, last) {
          if (!last || (val && last && val.id !== last.id)) {
            const members = []
            if (Array.isArray(val.members)) {
              for (const id of val.members) {
                const member = { id }
                const profile = await this.$store.dispatch('profiles/get', id)
                if (profile) {
                  member.name = profile.name
                }
                members.push(member)
              }
            }
            this.members = members

            let { items } = await this.$store.dispatch('invites/find', {
              group_id: val.id,
              name: val.name
            })
            this.invitations.items = items
          }
        },
        deep: true
      }
    },
    methods: {
      async copyUrl (invite) {
        try {
          await navigator.clipboard.writeText(`${document.location.origin}/users/invite/${invite.code}`)
          this.$store.commit('notifications/addMessage', {
            body: 'messages.copied_url', mode: 'alert', type: 'success'
          })
        }
        catch (err) {
          this.$handleError(this, err, 'errors.failed_to_copy_url')
        }
      },
      async addInvitation (name) {
        const invitation = await this.$store.dispatch('invites/post', {
          group_id: this.group.id,
          name
        })
        this.invitations.items.push(invitation)
      },
      async removeInvitation (invitation) {
        try {
          const index = this.invitations.items.findIndex(item => item.id === invitation.id)
          await this.$store.dispatch('invites/delete', invitation.id)
          this.invitations.items.splice(index, 1)
        }
        catch (err) {
          this.$handleError(this, err, 'errors.remove_invitation_failed')
        }
      },
      async removeMember (member) {
        try {
          const index = this.group.members.findIndex(item => item === member.id)
          this.group.members.splice(index, 1)
          await this.$store.dispatch('groups/patch', [this.group.id, { members: this.group.members }])
          this.members.splice(index, 1)
        }
        catch (err) {
          this.$handleError(this, err, 'errors.remove_member_failed')
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
  .q-item:hover
    background-color $grey-9
</style>
