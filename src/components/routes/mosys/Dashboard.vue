<template lang="pug">
  div

    side-menu

    .content-wrap
      // content-bar

      div
        a(@click="OpenForm") Add new set
        #mosys-add-form.add-form
          // span(slot="form-title") {{ $t('routes.piecemaker.add.title') }}
          // p.caption(slot="form-caption") {{ $t('routes.piecemaker.add.caption') }}
          form-main(v-model="payload", :schema="schema")
            q-btn(slot="form-buttons-add", @click="addAndGo") {{ $t('buttons.add_and_go') }}
            q-btn(slot="form-buttons-add", @click="cancel") {{ $t('buttons.cancel') }}
        // p
          q-btn(@click="$router.push('/maps/create')", color="primary") {{ $t('buttons.create_map') }}
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
        document.getElementById('mosys-add-form').style.display = 'block'
      },
      cancel: function () {
        document.getElementById('mosys-add-form').style.display = 'none'
      }
    },
    data () {
      const _this = this
      const context = this

      return {
        maps: _this.$store.dispatch('maps/find'),
        columns: [{
          label: _this.$t('labels.set_title'),
          field: 'title'
        }, {
          label: _this.$t('labels.description'),
          field: 'title'
        }, {
          label: _this.$t('labels.elements_length'),
          field: 'title'
        }, {
          label: _this.$t('labels.last_edit'),
          field: 'title'
        }
        ],
        actions: [
          // { type: 'add_video', title: 'buttons.add_video', color: 'primary' },
          // { type: 'annotate_edit', title: 'buttons.annotate', color: 'secondary' },
          { type: 'edit', title: 'buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
          // { type: 'alert_ch', title: 'buttons.test', color: 'primary' }
        ],
        payload: undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.set_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            },
            desc: {
              fullWidth: true,
              type: 'textarea',
              label: 'labels.description'
            },
            status: {
              fullWidth: true,
              type: 'radio',
              label: 'labels.status'
            }
          },
          submit: {
            handler () {
              context.payload.owner = context.$store.state.auth.payload.userId
              context.$store.dispatch('maps/create', context.payload)
              // .then(() => context.$router.push(`/maps`))
                .then(() => context.$router.push(`/mosys/dashboard`))
            }
          }
        }
      }
    }
  }
</script>

<style>
</style>
