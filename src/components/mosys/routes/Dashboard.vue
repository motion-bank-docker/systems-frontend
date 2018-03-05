<template lang="pug">
  div
    div.kachel-wrap
      div.kachel
        h5(@click="$router.push({ name: 'mosys.listPrivate' })") My Sets
        p Last edit:
        div(@click="$router.push({ name: 'mosys.setGridView' })")
          div.group-title Titel 32
          div.last-change 2018-06-23
        div(@click="$router.push({ name: 'mosys.setGridView' })")
          div.group-title Titel 7
          div.last-change 2017-12-29
        div(@click="$router.push({ name: 'mosys.setGridView' })")
          div.group-title Titel 15
          div.last-change 2017-11-04

      div.kachel
        h5(@click="$router.push({ name: 'mosys.listGroups' })") Participating
        p New invitations:
        div(@click="$router.push({ name: 'mosys.setGridView' })").invitation
          div.group-title Titel 11
          div.last-change 2018-06-23
        p Last edit:
        div(@click="$router.push({ name: 'mosys.setGridView' })")
          div.group-title Titel 4
          div.last-change 2017-12-29
        div(@click="$router.push({ name: 'mosys.setGridView' })")
          div.group-title Titel 9
          div.last-change 2017-11-04
        div(@click="$router.push({ name: 'mosys.setGridView' })")
          div.group-title Titel 20
          div.last-change 2017-11-04

      div.kachel
        h5(@click="$router.push({ name: 'mosys.listAllPublic' })") Public
        p Last edit:
        div(@click="$router.push({ name: 'mosys.set' })")
          div.group-title Titel 22
          div.last-change 2018-06-23
        div(@click="$router.push({ name: 'mosys.set' })")
          div.group-title Titel 41
          div.last-change 2017-12-29
        div(@click="$router.push({ name: 'mosys.set' })")
          div.group-title Titel 2
          div.last-change 2017-11-04
</template>

<script>
  import { QBtn } from 'quasar-framework'
  import ContentBar from '../../shared/partials/ContentBar'
  import DataTable from '../../shared/partials/DataTable'
  import CenterCardThreeQuarter from '../../shared/layouts/CenterCardThreeQuarter'
  import SideMenuMosys from '../../shared/partials/SideMenuMosys'
  // import CancelButton from '../../forms/CancelButton'

  import { FormMain } from '../../shared/forms'
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
    height: 30vw;
    background-color: #333;
    display: inline-block;
    vertical-align: top;
    color: black;
    padding: 1em;
    overflow-y: scroll;
  }
  .kachel:not(:last-of-type) {
    margin-right: 2em;
  }
  .kachel > div {
    margin: 20px 0;
    background-color: #999;
    cursor: pointer;
    padding: .5em;
  }
  .kachel > div:hover {
    background-color: transparent;
  }
  .kachel > div.invitation {
    background-color: red;
    border-bottom: 2px solid red;
    margin-bottom: 2em;
  }
  .kachel > h5 {
    cursor: pointer;
    color: #729bff;
  }
  .kachel > h5:hover {
    background-color: #222;
  }
</style>
