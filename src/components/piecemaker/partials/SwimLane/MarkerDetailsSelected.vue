<template lang="pug">
  // q-list.sl-marker-details-selected(color="dark")
  div(style="line-height: 1rem;")
    .q-caption(v-if="checkAnnotationType() === 'Video'")
      .ellipsis {{ annotationText }}
      q-btn.q-mt-md(
      @click="pushToVideo(annotationData.uuid)",
      size="sm", icon="theaters", round,
      :disabled="selectedAnnotation.uuid === $route.params.id")
    .q-caption(v-else-if="checkAnnotationType() === 'TextualBody'") {{ annotationText }}
    .q-caption.ellipsis(v-else) {{ annotationText }}
    //
      q-list.q-pa-none(color="dark", no-border)
        template(v-if="annotationData")
          q-item.q-pa-none.items-start.q-pb-md( v-for="(value, key) in annotationData" )
            q-item-side.q-pa-none(:class="{'q-caption': resizable}") {{ key }}
            q-item-main.q-pa-none.q-pr-md.ellipsis(:class="{'q-caption': resizable}") {{ value }}
        template(v-else)
          q-item.q-pa-none.items-start
            q-item-side.q-pa-none(:class="{'q-caption': resizable}") {{ $t('labels.no_selection') }}
</template>

<script>
  // import { EventHub } from './EventHub'

  export default {
    props: ['root', 'resizable'],
    data () {
      return {
        annotationData: this.$store.state.swimLaneSettings.selectedAnnotation,
        annotationText: undefined
      }
    },
    computed: {
      top () {
        return -75
      },
      selectedAnnotation () {
        return this.$store.state.swimLaneSettings.selectedAnnotation
      }
    },
    watch: {
      selectedAnnotation (val) {
        this.getAnnotationText(val)
      }
    },
    async mounted () {
      // EventHub.$on('markerUnselect', this.onMarkerUnselect)
      // EventHub.$on('markerDown', this.onMarkerDown)
      this.getAnnotationText(this.$store.state.swimLaneSettings.selectedAnnotation)
    },
    beforeDestroy () {
      // EventHub.$off('markerUnselect', this.onMarkerUnselect)
      // EventHub.$off('markerDown', this.onMarkerDown)
    },
    methods: {
      checkAnnotationType () {
        if (this.selectedAnnotation !== null) return this.selectedAnnotation.body.type
      },
      getAnnotationText (val) {
        this.annotationData = val
        if (val !== null) {
          let type = val.body.type
          switch (type) {
          case 'TextualBody':
            this.annotationText = val.body.value
            break
          case 'Video':
            this.annotationText = val.body.source.id
            break
          case 'VocabularyEntry':
            this.annotationText = val.body.source.id
            break
          default:
            this.annotationText = 'unknown'
            break
          }
        }
      },
      pushToVideo (val) {
        this.$router.push({name: 'piecemaker.videos.annotate', params: {id: val}})
      },
      onMarkerUnselect () {
        this.annotationData = null
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import 'swimLane'

  .sl-marker-details-selected
    height: 298px /* TEMP quick fix */

  .q-item-side
    width: 100px

  .q-list-header
    min-height none!important

  .q-item
    min-height auto!important
</style>
