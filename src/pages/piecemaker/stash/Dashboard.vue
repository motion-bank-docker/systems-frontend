<template lang="pug">
  div
    div.kachel-wrap
      a(@click="$router.push({ name: 'stash.listVideos' })")
        div.kachel My Videos
    div.kachel-wrap
      a(@click="$router.push({ name: 'stash.listPrivate' })")
        div.kachel Alle eigenen Gruppen
      a(@click="$router.push({ name: 'stash.listGroups' })")
        div.kachel Alle Gruppen, in denen ich Mitglied bin
      a(@click="$router.push({ name: 'stash.listAllPublic' })")
        div.kachel Alle öffentlichen Gruppen
</template>

<script>
  import ContentBar from '../../../components/shared/partials/ContentBar'
  import DataTable from '../../../components/shared/partials/DataTable'
  import FormAdd from '../../../components/shared/forms/FormAdd'
  import SideMenu from '../../../components/shared/partials/Sidemenu'
  import { FormMain } from '../../../components/shared/forms'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      ContentBar,
      DataTable,
      FormAdd,
      FormMain,
      SideMenu
    },
    methods: {
      action: function () {
        console.log('click geht')
        // document.getElementById('formulat-test').removeAttribute('hidden')
      },
      OpenForm: function () {
        document.getElementById('piecemaker-add-form').style.display = 'block'
      },
      AddNew: function () {
        document.getElementById('piecemaker-add-form').style.display = 'none'
      },
      HideForm: function () {
        document.getElementById('piecemaker-add-form').style.display = 'none'
      },
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'add_video':
          return _this.$router.push(`/annotations/${data.row.uuid}/video`)
        case 'annotate_edit':
          return _this.$router.push(`/annotations/${data.row.uuid}/edit`)
        case 'edit':
          return _this.$router.push(`/maps/${data.row.uuid}/edit`)
        case 'delete':
          _this.$store.dispatch('maps/remove', data.row.uuid)
              .then(() => { _this.maps = _this.$store.dispatch('maps/find') })
        }
      }
    },
    data () {
      const _this = this
      const context = this

      return {
        maps: _this.$store.dispatch('maps/find'),
        columns: [{
          label: _this.$t('labels.map_title'),
          field: 'title'
        }],
        actions: [
          { type: 'add_video', title: 'buttons.add_video', color: 'primary' },
          { type: 'annotate_edit', title: 'buttons.annotate', color: 'primary' },
          { type: 'edit', title: 'buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
        ],
        payload: undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.map_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          }
        },
        submit: {
          handler () {
            context.payload.owner = context.$store.state.auth.payload.userId
            context.$store.dispatch('maps/create', context.payload)
              .then(() => context.$router.push(`/maps`))
          }
        }
      }
    }
    // name: 'dashboard'
  }
</script>

<style scoped>
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
