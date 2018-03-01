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

    .grid
      .row(v-for="n in 10")
        .cell(v-for="n in 8")


    div.form-wrap
      div
        h5 Generelle Set Informationen
        form-main(v-model="payload", :schema="schemaSetDetails")
          q-btn(slot="form-buttons-add", @click="cancel") Cancel

        div
          div.mosys-set-participants-wrap
            p {{ $t('labels.participants') }}
            form-main(v-model="payload", :schema="schemaParticipants")
              q-btn(slot="form-buttons-add", @click="cancel") {{ $t('buttons.cancel') }}
            div bestätigter User 1
              a remove
            div bestätigter User 2
              a remove
            div bestätigter User 3
              a remove
            div.ausstehend ausstehend 1
              a remove
            div.ausstehend ausstehend 2
              a remove

          div.mosys-set-tags-wrap
            p {{ $t('labels.tags') }}
            form-main(v-model="payload", :schema="schemaTags")
              q-btn(slot="form-buttons-add", @click="cancel") {{ $t('buttons.cancel') }}
            div Tag 1
              a remove
            div Tag 2
              a remove
            div Tag 3
              a remove

      div#set-sources
        h5 Sources
        div#select-sources-wrap
          q-btn piecemaker
          q-btn vimeo
          q-btn youtube
        form-main(v-model="payload", :schema="schemaPreconfigCells")
          q-btn(slot="form-buttons-add", @click="cancel") Cancel
        div.source-search-results
          | Suchergebnisse

      div
        h5 vorkonfigurierte Zellen
        div.preconfig-cells-wrap
          data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")

</template>

<script>
  import { QBtn } from 'quasar-framework'
  import ContentBar from '../../partials/ContentBar'
  import DataTable from '../../partials/DataTable'
  import CancelButton from '../../forms/CancelButton'

  import { FormMain } from '../../forms'
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
        columns: [{
          label: 'Type',
          field: 'title'
        }, {
          label: _this.$t('labels.description'),
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
        },
        schemaParticipants: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'Email',
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
        },
        schemaTags: {
          fields: {
            title: {
              fullWidth: true,
              type: 'new tag',
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
  nav button {
    display: inline-block!important;
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
  .grid {
    height: 80vh;
    padding: 1em;
    width: 100vw;
    overflow-x: scroll;
  }
  .row {
    /* border: 1px solid blue; */
    height: 3vw;
    position: relative;
    /* background-color: yellow; */
    /* border: 1px solid black; */
    display: block;
    width: auto;
    white-space: nowrap;
  }
  .cell {
    width: 10vw;
    height: 100%;
    background-color: #333;
    display: inline-block;
    border-right: 1px solid #666;
    border-top: 1px solid #666;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
  }
  .cell:hover {
    background-color: #e3e3e3;
  }
  .cell:last-of-type {
    margin-right: 1em;
  }
  .form-wrap {
    margin: 2em;
    /* background-color: white; */
  }
    .form-wrap > div {
      background-color: #333;
      padding: 1em;
    }
    .form-wrap > div:not(:last-of-type) {
      /* border-bottom: 1px solid yellow; */
      margin-bottom: 4em;
    }
  .source-search-results {
    background-color: #777;
    min-height: 30vh;
  }
  .preconfig-cells-wrap {
    min-height: 30vh;
    background-color: #777;
  }
  .inline-block {
    display: inline-block;
    vertical-align: top;
  }
  .mosys-set-participants-wrap,
  .mosys-set-tags-wrap {
    margin-bottom: 2em;
    background-color: #111;
    display: inline-block;
    vertical-align: top;
    padding: 1em;
    width: 30%;
  }
  .mosys-set-participants-wrap {
    margin-right: 1em;
  }
  #select-sources-wrap button {
    display: inline-block!important;
  }
</style>
