<template lang="pug">
  full-screen

    confirm-modal(ref="confirmModal", @confirm="removeMember")

    //-------------------- title
    content-block(:position="'first'")

      template(v-if="$route.params.uuid")
        headline(:content="$t('routes.groups.edit.title')")
          | {{ group ? group.title : '' }}
      template(v-else)
        headline(:content="$t('routes.groups.create.title')")
          | {{ $t('routes.groups.create.caption') }}

      form-main(v-model="group", :schema="schema")

    //-------------------- members
    content-block(v-if="$route.params.uuid")
      //------------------- invitations
      q-table(:columns="invitations.columns", :data="invitations.items", dark,
        :title="$t('labels.invitations')", :pagination.sync="invitations.pagination", hide-bottom)

        template(slot="top-left", slot-scope="props")
          div.q-mb-md
            h5.q-mb-md {{ $t('labels.invitations') }}
            | {{ $t('help.create_invitation') }}

        template(slot="top-right", slot-scope="props")
          q-btn.no-shadow(@click="addInvitation", color="primary",
            icon="add", :label="$t('buttons.create_invitation')")

        q-td(slot="body-cell-actions", slot-scope="props", :props="props", auto-width)
          q-btn(icon="file_copy", flat, size="md", @click="copyUrl(props.row)")
          q-btn(icon="delete", flat, size="md",
            @click="$refs.confirmModal.show('messages.confirm_remove_invitation', props.row)")
</template>

<script>
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'
  import { required } from 'vuelidate/src/validators'
  import { DateTime } from 'luxon'

  export default {
    name: 'group_edit',
    components: {
      FormMain,
      ContentBlock,
      Headline
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
        invitations: {
          items: [],
          pagination: {},
          columns: [
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
        async handler (val) {
          if (val && val.id) {
            let { items } = await this.$store.dispatch('invites/find', {
              group_id: val.id
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
          console.debug('Failed to copy URL', err.message)
          this.$store.commit('notifications/addMessage', {
            body: 'errors.failed_to_copy_url', mode: 'alert', type: 'error'
          })
        }
      },
      async addInvitation () {
        const invitation = await this.$store.dispatch('invites/post', {
          group_id: this.group.id
        })
        this.invitations.items.push(invitation)
      },
      removeMember (index) {
        this.tableData.splice(index, 1)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
  .q-item:hover
    background-color $grey-9
</style>
