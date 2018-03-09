<template lang="pug">
  full
    q-btn(slot="nav-button", icon="keyboard_backspace", @click="$router.push(`/piecemaker/groups`)") {{ $t('buttons.back') }}
    span(slot="form-logo")
    span(slot="form-title")

    q-input#input(v-model="msg", @keyup="keyMonitor", type="textarea", :min-rows="4", autofocus)
    q-list(no-border)#list
      q-item.annotation(v-for="n in this.annotations", :key="annotation.uuid")
        q-item-side 17:2{{ n }}
        q-item-main
          q-item-tile.text-left
            q-input.color(type="textarea" v-model="msg")
        q-item-side.text-right
          q-btn() delete
</template>

<script>
  import { QBtn, QInput, QList, QItem, QItemMain, QItemSide, QItemTile } from 'quasar-framework'
  import Full from '../../../shared/layouts/Full'
  import { DateTime } from 'luxon'
  export default {
    components: {
      QBtn,
      QInput,
      QList,
      QItem,
      QItemMain,
      QItemTile,
      QItemSide,
      Full
    },
    data () {
      return {
        prevKey: undefined,
        currentBody: {
          value: undefined,
          purpose: 'commenting',
          type: 'TextualBody'
        },
        currentSelector: {
          type: 'Fragment',
          value: undefined
        },
        annotations: []
      }
    },
    mounted () {
      window.addEventListener('keypress', this.keyMonitor)
    },
    beforeDestroy () {
      window.removeEventListener('keypress', this.keyMonitor)
    },
    methods: {
      keyMonitor (e) {
        if (this.prevKey === 13 && e.keyCode === 13) {
          this.prevKey = undefined
          this.createAnnotation()
        }
        else {
          this.prevKey = e.keyCode
        }
      },
      createAnnotation () {
        const _this = this
        this.currentSelector.value = DateTime.local().toString()
        const annotation = {
          author: _this.$store.state.auth.payload.userId,
          body: Object.assign({}, _this.currentBody),
          target: {
            id: _this.$route.params.id,
            type: 'Timeline',
            selector: Object.assign({}, _this.currentSelector)
          }
        }
        return this.$store.dispatch('annotations/create', annotation)
          .then(annotation => {
            console.log(annotation, this)
            _this.annotations.push(annotation)
          })
      }
    }
  }
</script>

<style scoped>
  #input {
    background-color: #ddd;
    position: absolute;
    bottom: 0;
    width: calc(100vw - 10rem);
    /* width: calc(80vw - 10rem); */
    height: 100px;
    overflow: scroll;
    margin-bottom: 0;
    padding: 0 .5em;
  }
  #list {
    max-height: 50vh;
    width: calc(100vw - 10rem);
    overflow-y: scroll;
    position: absolute;
    bottom: 20vh;
  }
  .annotation {
    padding: .75em 1em;
  }
  .annotation:hover {
    background-color: rgba( 255, 255, 255, .05 );
  }
  .annotation:not(:last-of-type) {
    border-bottom: 1px solid #555;
  }
  .q-item-side {
    color: white;
    padding: 0 1.5em;
    vertical-align: top;
  }
  .color {
    color: white!important;
  }
</style>
