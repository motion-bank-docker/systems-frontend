<template lang="pug">
  div
    nav
      q-btn(@click="goBack") Back
      q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Grid View
      q-btn(@click="$router.push({ name: 'mosys.setListView' })") List View

      //div(style="float: right;")
        // q-btn(outline @click="$router.push({ name: 'mosys.setGridView' })") Define grid dimensions
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Set information
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Browse in sources
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Preconfigured cells

    .form-wrap
      nav
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Set information
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Browse in sources
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })") Preconfigured cells
        q-btn(@click="$router.push({ name: 'mosys.setGridView' })" style="float: right;") hide

      div#set-sources
        h5 Sources
        #select-sources-wrap
          q-btn piecemaker
          q-btn youtube
          q-btn vimeo
          // q-btn(outline icon="stars" style="position: absolute; right: 0;") Favoriten
        form-main(v-model="payload", :schema="schemaPreconfigCells")
          q-btn(slot="form-buttons-add", @click="cancel") Cancel

        .source-search-results
          h5 Suchergebnisse:
          div(v-for="n in 3")
            .source-search-result
              // .source-search-result-buttons-top
                div(style="display: inline-block;")
                  q-btn(style="display: inline-block;") embed in set now
                  q-btn(style="display: inline-block;") embed in set later
                div(style="display: inline-block; float: right;")
                  q-btn(icon="stars", style="display: inline-block;") favorisieren
                  span /
                  q-btn(icon="stars", style="display: inline-block;") ent-favorisieren
              .source-search-result-video Video
              .source-search-result-desc
                h5 Video-Beschreibung
                p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab distinctio molestias veniam! Alias aperiam asperiores beatae enim eos error expedita harum, minus, officia optio quas quod, sapiente sequi similique ullam!
              // .source-search-result-buttons(style="background-color: #333; padding: 1em;")
                h5 Weiterleiten
                form-main(v-model="payload", :schema="schemaWeiterleiten")
                  q-btn(slot="form-buttons-add", @click="cancel") Cancel

      div
        h5 Vorkonfigurierte Zellen
        div.preconfig-cell(v-for="item in preconfigCells") {{ item.label }}

      div
        h5 Generelle Set Informationen
        form-main(v-model="payload", :schema="schemaSetDetails")
          q-btn(slot="form-buttons-add", @click="cancel") Cancel

        div
          div.mosys-set-participants-wrap(style="width: 75%;")
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

          div.mosys-set-tags-wrap(style="width: 50%;")
            p {{ $t('labels.tags') }}
            form-main(v-model="payload", :schema="schemaTags")
              q-btn(slot="form-buttons-add", @click="cancel") {{ $t('buttons.cancel') }}
            div Tag 1
              a remove
            div Tag 2
              a remove
            div Tag 3
              a remove

          div.mosys-set-meta-wrap(style="width: 50%;")
            p Meta Data
            table
              tr(v-for="meta in setMetaData")
                td {{ meta.label }}
                td(style="text-align: right;") {{ meta.val }}

    #grid-wrap
      #pop-up-wrap
        div
          p Basic cells:
            span Preconfigured cells
          div.pop-up-item(v-for="item in itemsBasicCells") {{ item.text }}

      // #grid-layout
        .cell-width-wrap
          div Cell width ({{ cellWidth }} px)
            q-btn.btn-grid-resize.inline-block(@click=("cellWidth -= 1")) <
            q-btn.btn-grid-resize.inline-block(@click=("cellWidth += 1")) >
            q-slider.slider(v-model="selectedValue" :min="1" :max="500", @change="cellWidth = selectedValue")

        .grid-size-wrap.x
          div ({{ cellsX }} columns)
            q-btn.btn-grid-resize(@click=("cellsX -= 1")) –
            q-btn.btn-grid-resize(@click=("cellsX += 1")) +

        .grid-size-wrap.y
          div ({{ cellsY }} rows)
            q-btn.btn-grid-resize(@click=("cellsY -= 1")) –
            q-btn.btn-grid-resize(@click=("cellsY += 1")) +
      .grid
        .row(v-for="n in cellsY", v-bind:style="{ height: 500 / cellsY + 'px' }")
          // .cell(v-for="n in cellsX", @click="cellClick($event.target, '1234')", v-bind:style="{ width: cellWidth + 'px' }")
          .cell(v-for="n in cellsX", v-bind:style="{ width: cellWidth + 'px' }")


</template>

<script>
  import { QBtn, QSlider } from 'quasar-framework'
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
      QBtn,
      QSlider
    },
    created: function () {
    },
    methods: {
      goBack () {
        window.history.back()
      },
      cellClick (e, el) {
        console.log(e)
        console.log(el)
        e.style.backgroundColor = '#888'
      }
    },
    data () {
      const _this = this
      const context = this

      return {
        cellsX: 10,
        cellsY: 6,
        cellWidth: 150,
        preconfigCells: [{
          label: 'Headline & Absatz'
        }, {
          label: 'Video and Comment'
        }, {
          label: 'nur Headline'
        }, {
          label: 'etc.'
        }
        ],
        columns: [{
          label: 'Type',
          field: 'title'
        }, {
          label: _this.$t('labels.description'),
          field: 'title'
        }
        ],
        setMetaData: [{
          label: 'Date',
          val: '2018-02-02'
        }, {
          label: 'Last edit',
          val: '2018-02-08'
        }, {
          label: 'Anzahl items',
          val: '8'
        }
        ],
        itemsBasicCells: [{
          text: 'iframe'
        }, {
          text: 'image'
        }, {
          text: 'html'
        }, {
          text: 'text'
        }, {
          text: 'title cell'
        }, {
          text: '(vorgemerktes Video 1) [remove]'
        }, {
          text: '(vorgemerktes Video 2) [remove]'
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
              label: 'Status (radiobuttons)'
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
              label: 'Invite someone',
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
        },
        schemaWeiterleiten: {
          fields: {
            title: {
              fullWidth: true,
              type: 'new tag',
              label: 'Email',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            },
            msg: {
              fullWidth: true,
              type: 'new tag',
              label: 'Message',
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
    padding: 1em;
    width: 100vw;
    overflow-x: scroll;
  }
  .row {
    height: 3vw;
    position: relative;
    display: block;
    width: auto;
    white-space: nowrap;
  }
  .row:last-of-type .cell {
    border-bottom: 1px solid #666;
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
  .cell:first-of-type {
    border-left: 1px solid #666;
  }
  .cell:last-of-type {
    margin-right: 1em;
  }
  .form-wrap {
    width: 50vw;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    z-index: 100;
    overflow-y: scroll;
    background-color: black;
    box-shadow: 0 0 20px 20px rgba( 0, 0, 0, .25 );
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
    padding: 1em;
  }
    .source-search-result {
      background-color: black;
      margin-bottom: 3em;
    }
      .source-search-result-buttons-top {
        margin-bottom: 1em;
      }
        .source-search-result-buttons-top > button {
          display: inline-block;
        }
      .source-search-result-video {
        vertical-align: top;
        display: inline-block;
        width: 100%;
        height: 300px;
        margin-right: 1em;
        margin-bottom: 1em;
        padding: 1em;
        background-color: rgba( 255, 255, 255, .2 );
      }
      .source-search-result-desc {
        vertical-align: top;
        display: inline-block;
        width: 100%;
        margin-right: 1em;
        padding: 1em;
        background-color: rgba( 255, 255, 255, .2 );
      }
      .source-search-result-buttons {
        vertical-align: top;
        display: inline-block;
        width: 100%;
      }
  .preconfig-cells-wrap {
    min-height: 30vh;
    background-color: #777;
  }
    .preconfig-cell {
      display: inline-block;
      margin-right: 1em;
      margin-bottom: 1em;
      padding: 1em;
      width: 30%;
      height: 10vw;
      cursor: pointer;
      background-color: black;
    }
  .inline-block {
    display: inline-block;
    vertical-align: top;
  }
  .mosys-set-participants-wrap,
  .mosys-set-tags-wrap,
  .mosys-set-meta-wrap {
    margin-bottom: 2em;
    background-color: #111;
    vertical-align: top;
    padding: 1em;
  }
  #select-sources-wrap {
    position: relative;
  }
    #select-sources-wrap button {
      display: inline-block!important;
    }
  #pop-up-wrap {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 1em;
    z-index: 2;
  }
    .pop-up-item {
      background-color: #aaa;
      padding: .25em;
      margin: .5em .25em;
      cursor: pointer;
    }
  #pop-up-wrap > div {
    opacity: .3;
    background-color: white;
    color: #333;
    display: inline-block;
    vertical-align: bottom;
    background-color: black;
  }
  #pop-up-wrap > div:first-of-type {
    opacity: 0;
    padding: .5em;
    background-color: white;
    color: #333;
    display: inline-block;
  }
  #pop-up-wrap > div:hover {
    opacity: 1;
  }
  #grid-wrap {
    position: relative;
    /* background-color: red; */
    height: 80vh
  }
  .grid-size-wrap,
  .cell-width-wrap {
    position: absolute;
    z-index: 2;
  }
  .grid-size-wrap.x {
    right: 0;
  }
  .grid-size-wrap.x *,
  .cell-width-wrap {
    display: inline-block;
  }
  .cell-width-wrap {
    /* top: 50%;
    width: 100%;
    text-align: center; */
  }
  .grid-size-wrap.y {
    bottom: 0;
  }
  .slider {
    width: 500px;
    margin-left: .5em;
  }
  #grid-layout {
    /* display: none; */
  }
</style>
