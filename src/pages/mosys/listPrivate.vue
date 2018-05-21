<template lang="pug">
  div

    nav
      div
        q-btn(@click="$router.push({ name: 'mosys.listPrivate' })") My Sets
        q-btn(@click="$router.push({ name: 'mosys.listGroups' })") Participating
        q-btn(@click="$router.push({ name: 'mosys.listAllPublic' })") Public

    .content-wrap-wide
      h4 Übersicht: Meine erstellten Sets

      div
        div.table-top
          div
            q-btn(outline @click="OpenForm" color="primary") Add new set
          div.right
            q-btn(outline) Filter by tags
            q-btn(outline) Search

        data-table.margin-bottom(:entries="maps", :columns="columns", :actions="actions", @action="onAction")

        #piecemaker-add-form.add-form
          p Add new set
          form-main(v-model="payload", :schema="schemaNewGroup")
            q-btn(slot="form-buttons-add", @click="$router.push({ name: 'mosys.set' })") {{ $t('buttons.add_and_go') }}
            q-btn(slot="form-buttons-add", @click="cancel") {{ $t('buttons.cancel') }}

</template>

<script>
  import ContentBar from '../../components/shared/partials/ContentBar'
  import DataTable from '../../components/shared/partials/DataTable'
  import CenterCardThreeQuarter from '../../components/shared/layouts/CenterCardThreeQuarter'
  import SideMenuMosys from '../../components/shared/partials/SideMenuMosys'
  import CancelButton from '../../components/shared/forms/CancelButton'

  import { FormMain } from '../../components/shared/forms'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      ContentBar,
      DataTable,
      CenterCardThreeQuarter,
      SideMenuMosys,
      FormMain,
      CancelButton
    },
    methods: {
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'add_video':
          return _this.$router.push(`/annotations/${data.row.uuid}/video`)
        case 'annotate_edit':
          return _this.$router.push(`/mosys/setGridView`)
        case 'delete':
          _this.$store.dispatch('maps/remove', data.row.uuid)
              .then(() => { _this.maps = _this.$store.dispatch('maps/find') })
        }
        console.log('test')
      },
      OpenForm () {
        document.getElementById('piecemaker-add-form').style.display = 'block'
      },
      cancel: function () {
        document.getElementById('piecemaker-add-form').style.display = 'none'
      }
    },
    data () {
      const _this = this
      const context = this

      return {
        maps: _this.$store.dispatch('maps/find'),
        columns: [{
          label: 'Set title',
          field: 'title'
        }, {
          label: _this.$t('labels.description'),
          field: 'title'
        }, {
          label: 'Status',
          field: 'title'
        }, {
          label: 'Date',
          field: 'title'
        }, {
          label: 'Last edit',
          field: 'title'
        }, {
          label: 'Number of contents',
          field: 'title'
        }, {
          label: 'Participants',
          field: 'title'
        }
        ],
        actions: [
          { type: 'annotate_edit', title: 'edit content', color: 'secondary' },
          { type: 'delete', title: 'buttons.delete' }
        ],
        payload: undefined,
        schemaNewGroup: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'Set title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            },
            description: {
              fullWidth: true,
              type: 'textarea',
              label: 'labels.description'
            },
            status: {
              fullWidth: true,
              type: 'text',
              label: 'labels.status'
            },
            tags: {
              fullWidth: true,
              type: 'text',
              label: 'labels.tags'
            }
          },
          submit: {
            handler () {
              context.payload.owner = context.$store.state.auth.payload.userId
              context.$store.dispatch('maps/create', context.payload)
                // .then(() => context.$router.push(`/maps`))
                .then(() => context.$router.push(`/piecemaker/list`))
            }
          }
        }
      }
    }
  }
</script>

<style>
  .ausstehend {
    opacity: .5;
  }
  nav {
    padding: 1em .5em;
  }
  nav > div {
    display: inline-block;
  }
  nav > div.right {
    float: right;
  }
  .table-top > div {
    display: inline-block;
  }
  .table-top > div.right {
    float: right;
  }
</style>
