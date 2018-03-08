<template lang="pug">
  card-full
    span(slot="form-logo")
    span(slot="form-title")

    q-input(@keyup="keyMonitor" type="textarea")
    q-list(no-border)
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
        prevKey: undefined,
        anzahlAnnotations: 0
      }
    },
    mounted: {
    },
    methods: {
      keyMonitor (e) {
        let self = this
        if (self.prevKey === 13 && e.keyCode === 13) {
          self.anzahlAnnotations++
          // console.log('ENTER')
        }
        self.prevKey = e.keyCode
      }
    }
  }
</script>

<style scoped>

</style>
