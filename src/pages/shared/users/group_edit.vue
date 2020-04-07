<template lang="pug">
  full-screen

    confirm-modal(ref="confirmModal", @confirm="removeMember")

    //------------------------------------------------------------------------------------------------------------ title
    content-block(:position="'first'")

      headline(:content="$t('routes.groups.edit.title')")
        | {{ groupTitle }}

      form-main(v-model="payload", :schema="schema")

    //---------------------------------------------------------------------------------------------------------- members
    content-block

      div.q-mb-lg.q-pb-sm(style="display: flex;")
        h5.q-my-none.q-pt-none(style="width: 100%") Members
        div.text-white(style="flex-grow: auto; white-space: nowrap;")

          q-btn.q-mr-md(flat)
            | ?
            q-popover.q-pa-md(anchor="top left", self="top right", :offset="[8, 0]")
              | Create a new invitation. Copy the URL, and send it via mail. Send every invitation only once.

          q-btn.no-shadow(@click="addInvitation()", color="primary")
            q-icon(name="add")

        .text-grey-8.ui-border-bottom.q-pb-md

      //----- table
      q-table(:columns="config.columns", :data="tableData", dark, :pagination.sync="config.pagination", hide-bottom)

        q-td(slot="body-cell-name", slot-scope="props", :props="props")
          template(v-if="props.value") {{ props.value }}
          span.text-grey-7(v-else) unset

        q-td(slot="body-cell-status", slot-scope="props", :props="props")
          | {{ checkStatus(props) }}

        q-td(slot="body-cell-actions", slot-scope="props", :props="props", auto-width)
          q-btn(v-for="btn in actions", :key="btn.icon", flat, size="md", :icon="btn.icon",
          @click="defaultClick(btn, props)",
          :disabled="btn.type === 'copy' && props.row.name",
          :class="{'text-grey-7': btn.type === 'copy' && props.row.name}") {{ $t(btn.title) }}

</template>

<script>
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'

  export default {
    name: 'group_edit',
    components: { FormMain, ContentBlock, Headline },
    data () {
      return {
        groupTitle: 'abc 123',
        inviteUrl: 'https://url.motionbank.org/Dh23DJa7',
        tableData: [
          {name: undefined, status: 'https://url.motionbank.org/Dh23DJa7'},
          {name: 'Member 2', status: 'https://url.motionbank.org/Dh23DJa7'},
          {name: undefined, status: 'https://url.motionbank.org/Dh23DJa7'},
          {name: 'Member 4', status: 'https://url.motionbank.org/Dh23DJa7'},
          {name: 'Member 5', status: 'https://url.motionbank.org/Dh23DJa7'}
        ],
        payload: undefined,
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
            }
          ]
        },
        actions: [
          {
            type: 'copy',
            icon: 'file_copy',
            color: 'primary',
            click: (item) => this.copyUrl(item.status)
          },
          {
            type: 'remove',
            icon: 'clear',
            color: 'primary',
            click: (item) => this.$refs.confirmModal.show('messages.confirm_remove_member', item.__index)
          }
        ],
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.group_title',
              errorLabel: 'errors.field_required'
            }
          },
          submit: {
            handler () {
              console.log('submit')
              /*
              _this.payload.type = [constants.mapClasses.MAP_CLASS_TIMELINE]
              return _this.$store.dispatch('maps/post', _this.payload)
                .then(() => _this.$router.push({ name: 'piecemaker.timelines.list' }))
              */
            }
          }
        }
      }
    },
    mounted () {
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
      copyUrl (val) {
        navigator.clipboard.writeText(val)
          .then(() => {
            this.$q.notify({
              message: 'Copied.',
              timeout: 1000,
              color: 'primary'
            })
          })
          .catch(() => {
            console.log('error')
          })
      },
      addInvitation () {
        this.tableData.unshift({name: undefined, status: this.inviteUrl})
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
