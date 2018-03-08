<template lang="pug">
  card-full
    span(slot="form-logo")
    span(slot="form-title")

    // q-input(@keyup.enter="counter += 1" type="textarea")
    q-input(@keyup="keyMonitor" type="textarea")
    q-list(no-border)
      // q-item.annotation(v-for="annotation in 5", :key="annotation")
      q-item.annotation(v-for="n in this.anzahlAnnotations", :key="n")
        q-item-main
          q-item-tile.col-12.text-left 17:2{{ n }}
          q-item-tile.col-12.text-left Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aspernatur commodi consequuntur dolores eligendi enim, expedita inventore laborum neque nulla obcaecati.



</template>

<script>
  import { QBtn, QInput, QList, QItem, QItemMain, QItemTile } from 'quasar-framework'
  import CardFull from '../../../shared/layouts/CardFull'
  export default {
    components: {
      QBtn,
      QInput,
      QList,
      QItem,
      QItemMain,
      QItemTile,
      CardFull
    },
    data () {
      return {
        counter: 0,
        prevKey: undefined,
        actualKey: undefined,
        anzahlAnnotations: 0
      }
    },
    mounted: {
    },
    methods: {
      createAnnotation () {
        let self = this
        self.counter++
        // console.log(self.counter)
        if (self.counter === 2) {
          self.counter = 0
          self.anzahlAnnotations++
        }
      },
      keyMonitor (e) {
        let self = this
        // console.log(this.prevKey)
        // console.log(e.keyCode)
        if (this.prevKey === 13 && e.keyCode === 13) {
          self.anzahlAnnotations++
          console.log('ENTER')
          this.prevKey = 30
        }
        this.prevKey = e.keyCode
      }
    }
  }
</script>

<style scoped>

</style>
