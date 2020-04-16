<template lang="pug">
  full-screen

    confirm-modal(ref="confirmModal", @confirm="deleteGroup")

    //---------------------- groups
    content-block

      headline(:content="$t('routes.users.groups.title')")
        | {{ $t('routes.users.groups.caption') }}

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
        }
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
