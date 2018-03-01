<template lang="pug">
  div
    div.kachel-wrap
      a(@click="$router.push({ name: 'mosys.listPrivate' })")
        div.kachel My own sets
      a(@click="$router.push({ name: 'mosys.listGroups' })")
        div.kachel Alle Gruppen, in denen ich Mitglied bin
      a(@click="$router.push({ name: 'mosys.listAllPublic' })")
        div.kachel Alle öffentlichen Gruppen
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import ContentBar from '../../partials/ContentBar'
  import DataTable from '../../partials/DataTable'
  import CenterCardThreeQuarter from '../../layouts/CenterCardThreeQuarter'
  import SideMenuMosys from '../../partials/SideMenuMosys'
  // import CancelButton from '../../forms/CancelButton'

  import { FormMain } from '../../forms'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      ContentBar,
      DataTable,
      CenterCardThreeQuarter,
      SideMenuMosys,
      FormMain,
      // CancelButton,
      QBtn
    },
    methods: {
      onAction (type, data) {
        const _this = this
        switch (type) {
          // case 'add_video':
          // return _this.$router.push(`/annotations/${data.row.uuid}/video`)
          // case 'annotate_edit':
          // return _this.$router.push(`/annotations/${data.row.uuid}/edit`)
          case 'edit':
            return _this.$router.push(`/maps/${data.row.uuid}/edit`)
          // case 'alert_ch':
          // return alert('geht')
          case 'delete':
            _this.$store.dispatch('maps/remove', data.row.uuid)
              .then(() => { _this.maps = _this.$store.dispatch('maps/find') })
        }
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
              label: 'labels.description',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            },
            status: {
              fullWidth: true,
              type: 'text',
              label: 'labels.status',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
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
        },
        test: {
          message: 'hallo'
        }
      }
    }
  }
</script>

<style>
  .kachel-wrap {
    display: inline-block;
    vertical-align: top;
    padding: 1em;
    margin-right: 2em;
  }
  .kachel-wrap a:not(:last-of-type) {
    margin-right: 1em;
  }
  .kachel {
    width: 20vw;
    height: 20vw;
    background-color: #ccc;
    display: inline-block;
    color: black;
  }
  .kachel:hover {
    background-color: white;
  }
</style>
