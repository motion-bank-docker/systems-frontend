<template lang="pug">
  full-screen

    confirm-modal(ref="confirmModal", @confirm="removeMember")

    //-------------------- title
    content-block(:position="'first'")

      template(v-if="$route.params.uuid")
        headline(:content="$t('routes.groups.edit.title')")
          | {{ payload ? payload.title : '' }}
      template(v-else)
        headline(:content="$t('routes.groups.create.title')")
          | {{ $t('routes.groups.create.caption') }}

      form-main(v-model="payload", :schema="schema")

    //-------------------- members
    content-block(v-if="$route.params.uuid")

      div.q-mb-lg.q-pb-sm(style="display: flex;")
        h5.q-my-none.q-pt-none(style="width: 100%") {{ $t('labels.members') }}
        div.text-white(style="flex-grow: auto; white-space: nowrap;")

          q-btn.q-mr-md(flat)
            | ?
            q-popover.q-pa-md(anchor="top left", self="top right", :offset="[8, 0]")
              | {{ $t('help.create_invitation') }}

          q-btn.no-shadow(@click="addInvitation", color="primary")
            q-icon(name="add")

        .text-grey-8.ui-border-bottom.q-pb-md

      //------------------- table
      q-table(:columns="config.columns", :data="tableData", dark,
        :pagination.sync="config.pagination", hide-bottom)

        q-td(slot="body-cell-name", slot-scope="props", :props="props")
          template(v-if="props.value") {{ props.value }}
          span.text-grey-7(v-else) unset

        q-td(slot="body-cell-status", slot-scope="props", :props="props")
          | {{ checkStatus(props) }}

        q-td(slot="body-cell-actions", slot-scope="props", :props="props", auto-width)
          q-btn(icon="file_copy", flat, size="md", @click="copyUrl(props.row.invite_url)")
          q-btn(icon="delete", flat, size="md",
            @click="$refs.confirmModal.show('messages.confirm_remove_member', props.row)")
</template>

<script>
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'
  import { required } from 'vuelidate/src/validators'

  export default {
    name: 'group_edit',
    components: {
      FormMain,
      ContentBlock,
      Headline
    },
    data () {
      const context = this
      let payload
      if (this.$route.params.uuid) {
        payload = this.$store.dispatch('groups/get', this.$route.params.uuid)
      }
      else payload = { title: undefined }
      return {
        inviteUrl: 'https://url.motionbank.org/Dh23DJa7',
        tableData: [
          {name: undefined, status: 'https://url.motionbank.org/Dh23DJa7'},
          {name: 'Member 2', status: 'https://url.motionbank.org/Dh23DJa7'},
          {name: undefined, status: 'https://url.motionbank.org/Dh23DJa7'},
          {name: 'Member 4', status: 'https://url.motionbank.org/Dh23DJa7'},
          {name: 'Member 5', status: 'https://url.motionbank.org/Dh23DJa7'}
        ],
        payload,
        config: {
          pagination: {
            rowsPerPage: 0
          },
          columns: [
            {
              name: 'name',
              required: true,
              label: 'Name',
              align: 'left',
              field: 'name',
              sortable: true
            },
            {
              name: 'status',
              required: true,
              label: 'Status',
              align: 'right',
              field: 'status',
              sortable: true
            },
            {
              name: 'actions'
            }
          ]
        },
        schema: {
          fields: {
            title: {
              fullWidth: true,
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
                  [context.$route.params.uuid, context.payload])
              }
              else {
                const group = await context.$store.dispatch('groups/post', context.payload)
                return context.$router.push({
                  name: 'users.groups_edit',
                  params: { uuid: group.uuid }
                })
              }
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        }
      }
    },
    methods: {
      defaultClick (btn, props) {
        if (btn.click) return btn.click(props.row)
        if (btn.type === 'remove') {
          try {
            console.log('REMOVE')
            // await this.$store.dispatch(`${this.path}/delete`, props.row._uuid)
          }
          catch (err) {
            if (typeof this.$captureException === 'function') this.$captureException(err)
            else console.error(err)
          }
        }
      },
      async copyUrl (val) {
        try {
          await navigator.clipboard.writeText(val)
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
        const invitation = await this.$store.dispatch('invites/post', {})
        console.log('invitation', invitation)
      },
      checkStatus (props) {
        if (props.row.name) return 'accepted'
        else return props.row.status
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
