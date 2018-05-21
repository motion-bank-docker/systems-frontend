<template lang="pug">
  div

    nav
      div
        q-btn(@click="$router.push({ name: 'mosys.listPrivate' })") My Sets
        q-btn(@click="$router.push({ name: 'mosys.listGroups' })") Participating
        q-btn(@click="$router.push({ name: 'mosys.listAllPublic' })") Public

    .content-wrap-wide
      h4 Übersicht: Alle öffentlichen Sets (read only)

      div
        div.table-top
          div.invisible
            q-btn(outline @click="OpenForm" color="primary") Add new set
          div.right
            q-btn(outline) Filter by tags
            q-btn(outline) Search

        data-table.margin-bottom(:entries="maps", :columns="columns", :actions="actions", @action="onAction")

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
        case 'annotate_edit':
          return _this.$router.push(`/mosys/set`)
        case 'edit':
          return _this.$router.push(`/maps/${data.row.uuid}/edit`)
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
          label: 'Date',
          field: 'title'
        }, {
          label: 'Last edit',
          field: 'title'
        }
        ],
        actions: [
          { type: 'annotate_edit', title: 'show', color: 'secondary' }
        ],
        payload: undefined,
        schemaNewGroup: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'Group title',
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
  .table-top > div.invisible {
    opacity: 0;
  }

</style>
