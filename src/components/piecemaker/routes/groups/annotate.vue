<template lang="pug">
  full
    q-btn(slot="nav-button", icon="keyboard_backspace", @click="$router.push(`/piecemaker/groups`)") {{ $t('buttons.back') }}
    span(slot="form-logo")
    span(slot="form-title")

    q-input#input(v-model="currentBody.value", @keyup="keyMonitor", type="textarea", :min-rows="4", autofocus)
    q-list(no-border)#list
      q-item.annotation(v-for="(annotation, i) in annotations", :key="annotation.uuid")
        q-item-side {{ annotation.target.selector.value }}
        q-item-main
          q-item-tile.text-left
            q-input.color(type="textarea" v-model="annotation.body.value")
        q-item-side.text-right
          q-btn(@click="deleteAnnotation(annotation.uuid, i)") delete
</template>

<script>
  import { QBtn, QInput, QList, QItem, QItemMain, QItemSide, QItemTile } from 'quasar-framework'
  import Full from '../../../shared/layouts/Full'
  import { DateTime } from 'luxon'
  import assert from 'assert'
  import uuidValidate from 'uuid-validate'
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
    methods: {
      keyMonitor (e) {
        if (this.prevKey === 13 && e.keyCode === 13) {
          this.prevKey = undefined
          if (this.currentBody.value.replace(/\n/g, '').length > 0) {
            this.createAnnotation()
          }
          else {
            this.currentBody.value = undefined
          }
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
        this.currentBody.value = undefined
        return this.$store.dispatch('annotations/create', annotation)
          .then(annotation => {
            console.log(annotation, this)
            _this.annotations.push(annotation)
          })
      },
      deleteAnnotation (uuid, index) {
        assert(uuidValidate(uuid))
        assert.equal(typeof index, 'number')
        return this.$store.dispatch('annotations/remove', uuid)
          .then(() => {
            this.annotations.splice(index, 1)
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
