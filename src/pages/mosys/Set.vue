<template lang="pug">
  div
    nav
      q-btn(@click="goBack") Back
      q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Grid View
      q-btn(@click="$router.push({ name: 'mosys.setListView' })") List View

    .grid
      .row(v-for="n in 10")
        .cell(v-for="n in 8")

</template>

<script>
  import ContentBar from '../../components/shared/partials/ContentBar'
  import DataTable from '../../components/shared/partials/DataTable'
  import CancelButton from '../../components/shared/forms/CancelButton'

  import { FormMain } from '../../components/shared/forms'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      ContentBar,
      DataTable,
      FormMain,
      CancelButton
    },
    methods: {
      goBack () {
        window.history.back()
      }
    },
    data () {
      const context = this

      return {
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
    /* background-color: #eee; */
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
  }
  .form-wrap > div {
    margin-bottom: 3em;
    background-color: #333;
    padding: 1em;
  }
  .form-wrap form {
    width: 50%;
  }
  .source-search-results {
    background-color: #ddd;
    height: 30vh;
    width: 50%;
  }
  .preconfig-cells-wrap {
    width: 50%;
    height: 30vh;
    background-color: #ddd;
  }
  .used-cells-wrap {
    width: 50%;
    height: 30vh;
    background-color: #ddd;
  }
</style>
