<template lang="pug">
  full-screen

    confirm-modal(ref="confirmModal", @confirm="deleteGroup")

    //---------------------- user
    content-block(position="first")

      headline(:content="$t('routes.users.manage.title')")
        | {{ $t('routes.users.manage.caption') }}
        template(v-if="$route.params.isFirst")
          | {{ $t('routes.users.manage.first_login') }}

      content-paragraph
        h6 {{ $t('labels.profile') }}
        form-main(v-model="profile", :schema="profileSchema")

      content-paragraph(v-if="!$route.params.isFirst")
        h6 {{ $t('labels.account_credentials') }}
        form-main(v-model="credentials", :schema="credentialsSchema")
          // q-btn.q-mr-md.bg-grey-9(v-if="!$route.params.isFirst", slot="form-buttons-add", :label="$t('buttons.close_account')")

    //---------------------- groups
    content-block

      div.q-mb-lg.q-pb-sm(style="display: flex;")
        h5.q-my-none.q-pt-none(style="width: 100%") {{ $t('routes.groups.list.title') }}
        div.text-white(style="flex-grow: auto; white-space: nowrap;")

          q-btn.no-shadow(@click="$router.push({ name: 'users.groups_create' })", color="primary")
            q-icon(name="add")

      content-paragraph
        //----------------- table
        q-table(:columns="config.columns", :data="groups", dark,
          :pagination.sync="config.pagination", hide-bottom)

          q-td(slot="body-cell-title", slot-scope="props", :props="props")
            template(v-if="props.value") {{ props.value }}
            span.text-grey-7(v-else) unset

          q-td(slot="body-cell-actions", slot-scope="props", :props="props", auto-width)
            q-btn(icon="edit", flat, size="md", @click="editGroup(props.row)")
            q-btn(icon="delete", flat, size="md",
              @click="$refs.confirmModal.show('messages.confirm_delete_group', props.row)")
</template>

<script>
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import { FormMain } from '../../../components/shared/forms'
  import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  export default {
    components: {
      FullScreen,
      FormMain,
      Headline,
      ContentBlock,
      ContentParagraph
    },
    async mounted () {
      await this.loadGroups()

      this.config.columns.push({
        name: 'actions',
        align: 'right',
        type: 'string',
        filter: false,
        sortable: false,
        sort: false
        // format: makeFormatter('actions')
      })
    },
    data () {
      const context = this
      return {
        inviteUrl: 'https://url.motionbank.org/Dh23DJa7',
        tableData: [
          { title: 'My Super Group', id: 'asdf-1234' },
          { title: 'My Other Group', id: 'qwer-5678' }
        ],
        groups: [],
        config: {
          pagination: {
            rowsPerPage: 0
          },
          columns: [
            {
              name: 'title',
              required: true,
              label: 'Title',
              align: 'left',
              field: 'title',
              sortable: true
            }
          ]
        },
        demo: [
          { title: 'My Super Group', id: 'asdf-1234' },
          { title: 'My Other Group', id: 'qwer-5678' }
        ],
        requestTransform: async demo => {
          for (let i in demo) {
            const transformed = {}
            const row = demo[i]
            transformed.title = row.title
            transformed.id = row.id
            demo[i] = transformed
          }
          return demo
        },
        state: 'manage-profile',
        roles: [],
        profileSchema: {
          fields: {
            name: {
              type: 'text',
              label: 'labels.name',
              errorLabel: 'errors.field_required',
              validators: {
                required,
                minLength: minLength(2)
              }
            },
            organisation: {
              type: 'text',
              label: 'labels.organisation'
            }
          },
          submit: {
            async handler () {
              const profile = await context.$store.dispatch(
                'profiles/patch',
                [context.$store.state.auth.user.uuid, context.payload]
              )
              if (profile) {
                const user = Object.assign({}, context.$store.state.auth.user)
                user.profile = Object.assign({}, user.profile, profile)
                context.$auth._setUser(user, context.$store)
              }
              if (context.$route.params.isFirst && context.$route.params.redirect) {
                context.$router.push(context.$route.params.redirect.fullPath)
              }
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        },
        profile: context.$store.dispatch('profiles/get', context.$store.state.auth.user.uuid),

        credentialsSchema: {
          fields: {
            email: {
              type: 'text',
              label: 'labels.email',
              errorLabel: 'errors.field_required',
              validators: {
                required,
                email
              }
            },
            password: {
              type: 'password',
              label: 'labels.password',
              errorLabel: 'errors.minimum_length_6',
              validators: {
                minLength: minLength(6)
              }
            },
            password_repeat: {
              type: 'password',
              label: 'labels.password_confirmation',
              errorLabel: 'errors.passwords_do_not_match',
              validators: {
                sameAsPassword: sameAs('password')
              }
            }
          },
          submit: {
            async handler () {
              const payload = {}
              if (context.credentials.password) payload.password = context.credentials.password
              else payload.email = context.credentials.email
              try {
                await context.$store.dispatch(
                  'auth0/patchUser', [context.$store.state.auth.user.sub, payload])
                context.credentials.password_repeat = undefined
                context.credentials.password = undefined
              }
              catch (err) {
                throw new Error(err.response.data.message)
              }
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        },
        credentials: context.$store.dispatch('auth0/getUser', context.$store.state.auth.user.sub)
      }
    },
    computed: {
      password () {
        return this.credentials.password
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
      async loadGroups () {
        const result = await this.$store.dispatch('groups/find', {
          'creator.id': this.$auth.user.id
        })
        this.groups = result.items
      },
      editGroup (group) {
        this.$router.push({ name: 'users.groups_edit', params: { uuid: group.uuid } })
      },
      async deleteGroup (group) {
        await this.$store.dispatch('groups/delete', group.uuid)
        await this.loadGroups()
      }
    }
  }
</script>

<style></style>
