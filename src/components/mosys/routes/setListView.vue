<template lang="pug">
  div
    nav
      q-btn(@click="goBack") Back
      q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Grid View
      q-btn(@click="$router.push({ name: 'mosys.setListView' })") List View

      div(style="float: right;")
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Set Details
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Browse in sources
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Preconfigured cells

    div.content-wrap-wide
      h5 alle gesetzten Zellen
      data-table.margin-bottom(:entries="maps", :columns="columns", :actions="actions", @action="onAction")


    div.form-wrap
      div
        h5 Generelle Set Informationen
        form-main(v-model="payload", :schema="schemaSetDetails")
          q-btn(slot="form-buttons-add", @click="cancel") Cancel

</template>

<script>
  import { QBtn } from 'quasar-framework'
  import ContentBar from '../../shared/partials/ContentBar'
  import DataTable from '../../shared/partials/DataTable'
  import CancelButton from '../../shared/forms/CancelButton'

  import { FormMain } from '../../shared/forms'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      ContentBar,
      DataTable,
      FormMain,
      CancelButton,
      QBtn
    },
    methods: {
      goBack () {
        window.history.back()
      }
    },
    data () {
      const _this = this
      const context = this

      return {
        maps: _this.$store.dispatch('maps/find'),
        columns: [{
          label: 'Preview (bei img & video)',
          field: 'title'
        }, {
          label: 'Text (bei Textfeld)',
          field: 'title'
        }, {
          label: 'Link (bei img & video)',
          field: 'title'
        }, {
          label: 'Cell type',
          field: 'title'
        }, {
          label: 'Added',
          field: 'title'
        }
        ],
        schemaSetDetails: {
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
            cell_width: {
              fullWidth: true,
              type: 'text',
              label: 'cell width'
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
        },
        schemaPreconfigCells: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'search',
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
                .then(() => context.$router.push(`/piecemaker/list`))
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  nav {
  }
  nav > div {
    display: inline-block;
  }

  .buttons {
    float: right;
  }
  .buttons > div {
    display: inline-block;
    padding: .2em .5em;
    margin-right: .2em;
    background-color: grey;
  }
  .form-wrap {
    margin: 2em;
  }
  .form-wrap > div {
    margin-bottom: 3em;
    background-color: #333;
    padding: 1em;
  }
  .form-wrap form {
    width: 50%;
  }
</style>
