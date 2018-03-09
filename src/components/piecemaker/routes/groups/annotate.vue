<template lang="pug">
  full
    q-btn(slot="nav-button" icon="keyboard_backspace" @click="$router.push(`/piecemaker/groups`)") {{ $t('buttons.back') }}
    span(slot="form-logo")
    span(slot="form-title")

    q-input#input(v-model="msg" @keyup="keyMonitor" type="textarea" :min-rows="4" autofocus)
    q-list(no-border)#list
      q-item.annotation(v-for="n in this.anzahlAnnotations", :key="n")
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
        anzahlAnnotations: 0,
        msg: undefined
      }
    },
    mounted () {
      window.addEventListener('keypress', this.newAnnotation)
    },
    methods: {
      keyMonitor (e) {
        window.removeEventListener('keypress', this.newAnnotation)
        let self = this
        if (self.prevKey === 13 && e.keyCode === 13) {
          self.anzahlAnnotations++
          // console.log('ENTER')
          // window.addEventListener('keypress', this.newAnnotation)
        }
        self.prevKey = e.keyCode
      },
      newAnnotation () {
        this.anzahlAnnotations++
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
