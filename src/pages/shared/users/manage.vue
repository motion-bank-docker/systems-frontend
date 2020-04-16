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

      content-paragraph.q-mb-lg
        //----------------- my memberships
        q-table(:columns="memberships.columns", :data="memberships.items", dark,
          :title="$t('labels.group_memberships')",
          :pagination.sync="memberships.pagination", hide-bottom)

          q-td(slot="body-cell-actions", slot-scope="props", :props="props", auto-width)
            q-btn(v-if="!isOwnGroup(props.row)", icon="exit_to_app", flat,
              size="md", @click="leaveGroup(props.row)", :label="$t('buttons.leave')")

      content-paragraph
        //----------------- my groups
        q-table(:columns="groups.columns", :data="groups.items", dark,
          :title="$t('labels.my_groups')",
          :pagination.sync="groups.pagination", hide-bottom)

          template(slot="top-right", slot-scope="props")
            q-btn.no-shadow(@click="$router.push({ name: 'users.groups_create' })",
              color="primary", icon="add")

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
      await this.loadMemberships()
    },
    data () {
      const context = this
      return {
        memberships: {
          items: [],
          pagination: {
            rowsPerPage: 0
          },
          columns: [
            {
              name: 'title',
              required: true,
              label: this.$t('labels.title'),
              align: 'left',
              field: 'title',
              sortable: true
            },
            {
              name: 'creator',
              required: true,
              label: this.$t('labels.creator'),
              align: 'left',
              field: 'creator',
              format: val => val.name
            },
            {
              name: 'actions'
            }
          ]
        },
        groups: {
          items: [],
          pagination: {
            rowsPerPage: 0
          },
          columns: [
            {
              name: 'title',
              required: true,
              label: this.$t('labels.title'),
              align: 'left',
              field: 'title',
              sortable: true
            },
            {
              name: 'actions'
            }
          ]
        },
        state: 'manage-profile',
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
      async loadMemberships () {
        const result = await this.$axios.get(
          `${process.env.API_HOST}/users/memberships`,
          {
            headers: {
              Authorization: `${this.$auth.tokenType} ${this.$auth.token}`
            }
          }
        )
        this.memberships.items = result.data.items || []
      },
      async loadGroups () {
        const result = await this.$store.dispatch('groups/find', {
          'creator.id': this.$auth.user.id
        })
        this.groups.items = result.items
      },
      editGroup (group) {
        this.$router.push({ name: 'users.groups_edit', params: { uuid: group.uuid } })
      },
      async deleteGroup (group) {
        await this.$store.dispatch('groups/delete', group.uuid)
        await this.loadGroups()
      },
      async leaveGroup (group) {
        await this.$axios.delete(
          `${process.env.API_HOST}/users/memberships/${group.uuid}`,
          {
            headers: {
              Authorization: `${this.$auth.tokenType} ${this.$auth.token}`
            }
          }
        )
        await this.loadMemberships()
      },
      isOwnGroup (group) {
        return group.creator.id === this.$auth.user.id
      }
    }
  }
</script>

<style></style>
