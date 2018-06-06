<template lang="pug">
  card-full
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.groups.show.title') }}
    span(slot="form-caption") {{ $t('routes.piecemaker.groups.show.caption') }}

    div {{ $t('routes.piecemaker.groups.session.title') }}
    div {{ $t('routes.piecemaker.groups.session.caption') }}
    q-list
      q-item(v-for="n in 3")
        q-item-side side
        q-item-main main
    // div
      h4(v-if="map") {{ map.title }}
      p Annotations: {{ annotations.length }}

    q-btn(
      @click="$router.push({ name: 'piecemaker.groups.annotate' })",
      ) Live Annotate
</template>

<script>
  import CardFull from '../../../components/shared/layouts/CardFull'
  import { QList, QItem, QItemMain, QItemSide } from 'quasar'

  export default {
    components: {
      CardFull,
      QList,
      QItem,
      QItemMain,
      QItemSide
    },
    mounted () {
      const
        _this = this,
        uuid = this.$route.params.id
      this.$store.dispatch('maps/get', uuid)
        .then(map => {
          _this.map = map
        })
      this.$store.dispatch('annotations/find', { query: { 'target.id': uuid } })
        .then(annotations => {
          _this.annotations = annotations
          console.log(_this.annotations)
        })
    },
    data () {
      return {
        map: undefined,
        annotations: []
      }
    }
  }
</script>
