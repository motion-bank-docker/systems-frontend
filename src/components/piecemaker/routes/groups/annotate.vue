<template lang="pug">
  card-full
    span(slot="form-logo")
    span(slot="form-title")

    q-input(@keyup.enter="createAnnotation()")

    q-list(no-border)
      q-item.annotation(v-for="annotation in 5", :key="annotation")
        q-item-main
          q-item-tile.col-12.text-left 17:2{{ annotation }}
          q-item-tile.col-12.text-left Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aspernatur commodi consequuntur dolores eligendi enim, expedita inventore laborum neque nulla obcaecati.



</template>

<script>
  import { QBtn, QInput, QList, QItem, QItemTile } from 'quasar-framework'
  import CardFull from '../../../shared/layouts/CardFull'
  export default {
    components: {
      QBtn,
      QInput,
      QList,
      QItem,
      QItemTile,
      CardFull
    },
    methods: {
      createAnnotation () {
        console.log('geht')
      }
    },
    data: {
      annotations: [{
        message: 'vgcvdschsadc'
      }, {
        message: 'nhjkvbkjdfvsd cdhcavsd cavadghjsc vasdcd.'
      }, {
        message: 'vs cadghs go gzudacasd uz cudkhs d cdhcavsd cavadghjsc vasdcd.'
      }
      ]
    }
  }
</script>

<style scoped>

</style>
