<template lang="pug">
  q-list.sl-marker-details-hover.popup-shadow.bg-dark.no-select.no-event.q-px-md.q-pt-md.q-pb-none(
    v-if="hoveredAnnotation",
    :class="render",
    :style="{bottom: px(bottom), left: px(left), maxWidth: px(maxWidth)}",
    dark
    )
    q-window-resize-observable(@resize="viewportResize")
    q-resize-observable(@resize="elementResize")

    .row.items-center
      .q-mr-sm
        annotation-icon(
        :annotation="hoveredAnnotation"
        )
      timecode-label(
      :mode="root.mode",
      :millis="hoveredAnnotation.target.selector._valueMillis",
      :videoDate="videoDate"
      )
      // annotation has duration
      template(v-if="hoveredAnnotation.target.selector._valueDuration")
        .timecode-label-duration-spacer
        timecode-label(
        :mode="root.mode",
        :millis="annotationEnd",
        :videoDate="videoDate"
        )

    .q-caption.q-ml-lg.q-mt-xs.q-pl-sm(style="color: #fff8;") {{ hoveredAnnotation.creator.name }}

    .q-my-md.ellipsis-3-lines.md-content
      | {{ getAnnotationContent(hoveredAnnotation) }}

    //
      q-item.q-pa-none.items-start.q-caption.q-pb-md(v-if="showDetails && annotationData")
        .ellipsis {{ teaserText }}
      template(v-else)
        q-item.q-pa-none.items-start.q-caption.q-pb-md(v-for="(value, key) in annotationData")
          q-item-side.q-pa-none {{ key }}
          q-item-main.q-pa-none {{ value }}

</template>

<script>
  // import { EventHub } from './EventHub'
  import AnnotationIcon from '../AnnotationIcon'
  import TimecodeLabel from '../../../shared/partials/TimecodeLabel'

  export default {
    components: {
      AnnotationIcon,
      TimecodeLabel
    },
    props: ['root'],
    data () {
      return {
        annotationData: null,
        maxWidth: 350,
        teaserText: undefined,
        viewportHeight: undefined,
        hoverboxWidth: undefined,
        hoveredAnnotation: undefined,
        rightAlignment: false
      }
    },
    computed: {
      /*
      showDetails () {
        return this.$store.state.swimLane.visibilityDetails
      },
      */
      /*
      top () {
        // TODO: should be bound to this.$el.clientHeight:
        // ISSUE: Sometimes data is filled in one tick too late, so value jumps from 0 to X when already visible
        // return (this.annotationData) ? this.$parent.inputPosition.clientY - this.$el.clientHeight - 15 : -99999
        // 228
        let offsetY
        this.showDetails ? offsetY = 60 : offsetY = 250
        return (this.annotationData) ? this.$parent.inputPosition.clientY - offsetY - 15 : -99999
        // return 100
      },
      */
      bottom () {
        return (this.annotationData) ? this.viewportHeight - this.$parent.inputPosition.clientY + 20 : -99999
      },
      left () {
        return (this.annotationData && this.hoverboxWidth) ? this.$parent.restrict(this.$parent.inputPosition.clientX, 0, this.$parent.el.bounds.right - this.hoverboxWidth) : -99999
        // return (this.annotationData) ? this.$parent.restrict(this.$parent.inputPosition.clientX, 0, this.$parent.el.bounds.right - this.width) : -99999
      },
      render () {
        if (this.rightAlignment) return this.annotationData && !this.$parent.isDragged() ? 'far-right' : 'far-right is-transparent'
        else return this.annotationData && !this.$parent.isDragged() ? 'not-far-right' : 'not-far-right is-transparent'
      },
      videoDate () {
        return this.root.getVideoDate()
      },
      annotationEnd () {
        // return this.root.getAnnotationEndMillis(this.hoveredAnnotation)
        return this.hoveredAnnotation.target.selector._valueMillis + this.hoveredAnnotation.target.selector._valueDuration
      }
    },
    watch: {
      left () {
        let currentBoxPosition = this.$parent.restrict(this.$parent.inputPosition.clientX, 0, this.$parent.el.bounds.right - this.hoverboxWidth)
        let cursorX = this.$parent.inputPosition.clientX
        if (currentBoxPosition < cursorX) this.rightAlignment = true
        else this.rightAlignment = false
      }
    },
    async mounted () {
      this.$root.$on('markerEnter', this.onMarkerEnter)
      this.$root.$on('markerLeave', this.onMarkerLeave)
      this.$root.$on('globalUp', this.onMarkerLeave)
    },
    beforeDestroy () {
      this.$root.$off('markerEnter', this.onMarkerEnter)
      this.$root.$off('markerLeave', this.onMarkerLeave)
      this.$root.$off('globalUp', this.onMarkerLeave)
    },
    methods: {
      getAnnotationContent (annotation) {
        if (annotation.body['rdf:label']) {
          return `${annotation.body['rdf:label']}`
        }
        return annotation.body.value
      },
      elementResize (obj) {
        this.hoverboxWidth = obj.width
      },
      viewportResize (obj) {
        this.viewportHeight = obj.height
      },
      onMarkerEnter (annotationData) {
        this.hoveredAnnotation = annotationData
        let ms = this.$parent.millisTotalToTimeline(annotationData.target.selector._valueMillis)
        this.annotationData = {
          // 'Created': DateTime.fromISO(annotationData.created).toFormat('yyyy LLL dd, HH:mm:ss.SSS'),
          'Start': this.root.millisToText(ms),
          'Duration': annotationData.target.selector._valueDuration ? this.root.millisToText(annotationData.target.selector._valueDuration) : '-',
          'Author': annotationData.creator.name,
          // 'Purpose': annotationData.body.purpose,
          // 'Body Type': annotationData.body.type,
          'Body Value': annotationData.body.value
        }
        /*
        switch (annotationData.body.type) {
        case 'TextualBody':
          this.teaserText = annotationData.body.value
          break
        case 'Video':
          this.teaserText = annotationData.body.source.id
          break
        case 'VocabularyEntry':
          this.teaserText = annotationData.body.source.id
          break
        default:
          this.teaserText = 'unknown'
          break
        }
        */
      },
      onMarkerLeave () {
        this.annotationData = null
      },
      px (v) {
        return v + 'px'
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
  @import 'swimLane'

  $delay = 200ms
  $delay-long = 300ms

  .far-right
    -webkit-transition: opacity 200ms $delay-long, left 200ms
    -moz-transition: opacity 200ms $delay-long, left 200ms
    -ms-transition: opacity 200ms $delay-long, left 200ms
    -o-transition: opacity 200ms $delay-long, left 200ms
    transition: opacity 200ms $delay-long, left 200ms

  .not-far-right
    -webkit-transition: opacity 200ms $delay
    -moz-transition: opacity 200ms $delay
    -ms-transition: opacity 200ms $delay
    -o-transition: opacity 200ms $delay
    transition: opacity 200ms $delay

  .sl-marker-details-hover
    position: fixed
    z-index: 100
    /*background: orangered*/
    /*color: black*/
    /*padding: 5px*/
    /*
    -webkit-transition: opacity 200ms $delay
    -moz-transition: opacity 200ms $delay
    -ms-transition: opacity 200ms $delay
    -o-transition: opacity 200ms $delay
    transition: opacity 200ms $delay
    */
    /*
    -webkit-transition-delay: $delay
    -moz-transition-delay: $delay
    -ms-transition-delay: $delay
    -o-transition-delay: $delay
    transition-delay: $delay
    */

  .sl-marker-details-hover.is-transparent
    -webkit-transition-delay: 0ms
    -moz-transition-delay: 0ms
    -ms-transition-delay: 0ms
    -o-transition-delay: 0ms
    transition-delay: 0ms
    -webkit-transition-duration: 0ms
    -moz-transition-duration: 0ms
    -ms-transition-duration: 0ms
    -o-transition-duration: 0ms
    transition-duration: 0ms

  .q-item-side
    width: 100px

  .q-item
    min-height auto!important

  .md-content
    font-size: 1rem
    line-height: 24px

  .timecode-label-duration-spacer
    border-bottom: 1px solid $faded
    width: 8px

</style>
