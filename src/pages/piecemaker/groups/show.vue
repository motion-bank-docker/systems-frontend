<template lang="pug">
  div
    h4(v-if="map") {{ map.title }}
    p Annotations: {{ annotations.length }}
</template>

<script>
  export default {
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
