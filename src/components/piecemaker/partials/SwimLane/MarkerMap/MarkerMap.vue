<template lang="pug">
  svg.marker-map.no-event(height="4", y="0")
    rect.fill-faded(x="0", y="0", height="4", width="100%")
    rect(
      v-for="a in annotations",
      :width="width(a)", height="3",
      :x="x(a)", y="0",
      :class="getTypeClass(a)",
      opacity="0.35"
      )
    rect.no-event.fill-medium(x="0", y="3", width="100%", height="1")
</template>

<script>
  export default {
    name: 'MarkerMap',
    props: ['root', 'annotations'],
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {
      getTypeClass (a) {
        return 'annotation-type-' + a.body.type
      },
      width (annotation) {
        return Math.max(this.root.millisToAbsComp(annotation.target.selector._valueDuration), 1) || 0
      },
      x (annotation) {
        const v = this.root.millisTotaltoAbsComp(annotation.target.selector._valueMillis)
        return isFinite(v) ? Math.floor(v) : 0
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../swimLane'
</style>
