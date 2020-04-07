<template lang="pug">
  full-screen

    confirm-modal(ref="confirmModal", @confirm="deleteGroup")

    //------------------------------------------------------------------------------------------------------------- user
    content-block(:position="'first'")

      headline(v-if="state == 'manage-profile'", :content="$t('routes.users.manage.title')")
        | {{ $t('routes.users.manage.caption') }}
        template(v-if="isFirst")
          | {{ $t('routes.users.manage.first_login') }}

      headline(v-else, :content="$t('routes.users.first_login.title')")
        template()
          | {{ $t('routes.users.first_login.caption') }}

      content-paragraph
        form-main(v-model="payload", :schema="schema")
          // q-btn.q-mr-md.bg-grey-9(v-if="!isFirst", slot="form-buttons-add", :label="$t('buttons.close_account')")

    //----------------------------------------------------------------------------------------------------------- groups
    content-block

      div.q-mb-lg.q-pb-sm(style="display: flex;")
        h5.q-my-none.q-pt-none(style="width: 100%") {{ this.$t('routes.groups.list.title') }}
        div.text-white(style="flex-grow: auto; white-space: nowrap;")

          q-btn.no-shadow(@click="addGroup()", color="primary")
            q-icon(name="add")

      content-paragraph
        //----- table
        q-table(:columns="config.columns", :data="tableData", dark, :pagination.sync="config.pagination", hide-bottom)

          q-td(slot="body-cell-title", slot-scope="props", :props="props")
            template(v-if="props.value") {{ props.value }}
            span.text-grey-7(v-else) unset

          q-td(slot="body-cell-actions", slot-scope="props", :props="props", auto-width)
            q-btn(v-for="btn in actions", :key="btn.icon", flat, size="md", :icon="btn.icon",
            @click="defaultClick(btn, props)",
            :disabled="btn.type === 'copy' && props.row.name",
            :class="{'text-grey-7': btn.type === 'copy' && props.row.name}") {{ $t(btn.title) }}

    //
      h5.no-margin(slot="form-title")
        div(v-if="state == 'manage-profile'")
          span.text-grey-6 {{ $t('routes.users.manage.title') }}
          br
          | {{ $t('routes.users.manage.caption') }}
          div(v-if="isFirst")
            br
            | {{ $t('routes.users.manage.first_login') }}

        div(v-else)
          span.text-grey-6 {{ $t('routes.users.first_login.title') }}
          br
          | {{ $t('routes.users.first_login.caption') }}

</template>

<script>
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import { FormMain } from '../../../components/shared/forms'
  // import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'
  import { required, minLength } from 'vuelidate/lib/validators'
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
      this.isFirst = this.$route.params.isFirst

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
            },
            {
              name: 'id',
              required: true,
              label: 'ID',
              align: 'right',
              field: 'id',
              sortable: true
            }
          ]
        },
        actions: [
          {
            type: 'edit',
            icon: 'edit',
            color: 'primary',
            click: (item) => {
              console.log(item)
              this.$router.push({ name: 'users.groupedit' })
            }
          },
          {
            type: 'delete',
            icon: 'delete',
            color: 'primary',
            click: (item) => this.$refs.confirmModal.show('messages.confirm_delete_group', item.__index)
          }
        ],
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
        isFirst: false,
        state: 'manage-profile',
        schema: {
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
              const profile = await context.$store.dispatch('profiles/patch', [context.$store.state.auth.user.uuid, context.payload])
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
        payload: context.$store.dispatch('profiles/get', context.$store.state.auth.user.uuid)
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
      addGroup () {
        this.tableData.unshift({title: undefined, id: 'yxcv-5555'})
      },
      deleteGroup (index) {
        this.tableData.splice(index, 1)
      }
    }
  }
</script>

<style></style>
