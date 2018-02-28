<template lang="pug">
  div

    side-menu

    .content-wrap
      // content-bar
      h4 List of all other public groups (read only)

      q-btn(outline) Filter by tags
      q-btn(outline) Search

      div
        data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")

</template>

<script>
  import { QBtn } from 'quasar-framework'
  import ContentBar from '../../partials/ContentBar'
  import DataTable from '../../partials/DataTable'
  import CenterCardThreeQuarter from '../../layouts/CenterCardThreeQuarter'
  import SideMenu from '../../partials/Sidemenu'
  import CancelButton from '../../forms/CancelButton'

  import { FormMain } from '../../forms'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      ContentBar,
      DataTable,
      CenterCardThreeQuarter,
      SideMenu,
      FormMain,
      CancelButton,
      QBtn
    },
    methods: {
      onAction (type, data) {
        const _this = this
        switch (type) {
          case 'add_video':
            return _this.$router.push(`/annotations/${data.row.uuid}/video`)
          case 'annotate_edit':
            return _this.$router.push(`/annotations/${data.row.uuid}/edit`)
          case 'edit':
            return _this.$router.push(`/maps/${data.row.uuid}/edit`)
          case 'alert_ch':
            return alert('geht')
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
          label: 'Group title',
          field: 'title'
        }, {
          label: _this.$t('labels.description'),
          field: 'title'
        }, {
          label: 'Status',
          field: 'title'
        }, {
          label: 'Time range',
          field: 'title'
        }, {
          label: _this.$t('labels.last_annotation'),
          field: 'title'
        }, {
          label: 'Number of contents',
          field: 'title'
        }, {
          label: 'Number of participants',
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
</style>
