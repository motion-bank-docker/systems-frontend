<template lang="pug">
  div
    side-menu

    .content-wrap
      content-bar
        a.content-bar-item(slot="content-bar-item") Filter

      a(@click="OpenForm") Add new video


      // div(slot="table-form-item")#piecemaker-add-form
      div#piecemaker-add-form
        div blablabla

        //span(slot="form-title") {{ $t('routes.maps.create.title') }}
          p.caption(slot="form-caption") {{ $t('routes.maps.create.caption') }}
          p.caption(slot="form-caption") test
          form-main

        form-add
          q-input(slot="form-middle-item" v-model="text" float-label="URL" value="11111111" name="set-title")


        a(@click="$router.push({ name: 'piecemaker.annotator' })") add & annotate
        a(@click="AddNew") add & stay
        a(@click="HideForm") cancel


        // form-add#piecemaker-add-form

          span(slot="form-title") {{ $t('routes.maps.create.title') }}
          p.caption(slot="form-caption") {{ $t('routes.maps.create.caption') }}
          form-main(v-model="payload", :schema="schema")

          div(slot="form-middle-item")#form-frame

            q-field(slot="form-middle-item")
              q-input(v-model="text" float-label="Title" value="11111111" name="set-title")

            q-field(slot="form-middle-item")
              q-input(v-model="text" float-label="URL" value="222" name="set-desc")

            | Status:
            q-radio(slot="form-middle-item" v-model="option" val="opt1" label="private")
            q-radio(slot="form-middle-item" v-model="option" val="opt2" label="public")
            q-radio(slot="form-middle-item" v-model="option" val="opt3" label="shared")

          a(slot="form-bottom-item", @click="$router.push({ name: 'piecemaker.annotator' })") add & annotate
          a(slot="form-bottom-item", @click="AddNew") add & stay
          a(slot="form-bottom-item", @click="HideForm") cancel

      data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")

</template>

<script>
  import {
    QBtn,
    QField,
    QInput,
    QRadio
  } from 'quasar-framework'
  import ContentBar from '../../partials/ContentBar'
  import DataTable from '../../partials/DataTable'
  // import DataTableTest from '../../partials/DataTableTest'
  import FormAdd from '../../forms/FormAdd'
  import SideMenu from '../../partials/Sidemenu'
  import { FormMain } from '../../forms'
  // import { FormMain } from '../../forms'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      QBtn,
      QField,
      QInput,
      QRadio,
      ContentBar,
      DataTable,
      // DataTableTest,
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
  p {
    margin: 0;
  }
.form-test {
  background-color: red;
}
  #piecemaker-add-form {
    display: none;
  }

  #formular-test {
    background-color: cadetblue;
    display: none;
  }

  #form-frame {
    width: 60%;
    display: inline-block;
    vertical-align: top;

  }
  #video-frame {
    background-color: aqua;
    width: 40%;
    height: 20vw;
    cursor: pointer;
    display: inline-block;
    vertical-align: top;
  }
</style>
