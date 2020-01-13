<template lang="pug">
    div
      stream-video(
        ref="streamVideo",
        @close="onCloseVideo",
        :fix-diagram="fixDiagram",
        :video="video",
        :visible="showVideo")

      // STREAM VIEW
      //
      div(ref="stream")
        .row.col-12.q-pt-xl

          // DIAGRAM
          //
          .col-4(:class="{'row': fixDiagram, 'shadow-16': !fixDiagram}")
            // @click-video="onClickVideo",
            stream-diagram(
              @session-time="changeSessionTime",
              :previewTime="previewTime",
              :fix-diagram="fixDiagram",
              :session="session",
              :session-time="sessionTime",
              :visible-window="visibleWindow")

          // TEXT
          //
          .col-8(:style="{minHeight: '100vh', paddingBottom: $refs.streamVideo ? $refs.streamVideo.height + 'px' : '0px'}")
            stream-annotations(
              :annotations="session.annotations",
              @annotation-preview="onAnnotationPreview",
              @session-time="changeSessionTime")
</template>

<script>
  import { scroll, easing } from 'quasar'

  import StreamAnnotations from './StreamAnnotations'
  import StreamDiagram from './StreamDiagram'
  import StreamVideo from './StreamVideo'

  import SessionHelpers from '../../../../lib/annotations/session-helpers'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      easing,
      StreamAnnotations,
      StreamDiagram,
      StreamVideo
    },
    data () {
      // const _this = this
      return {
        annotations: [],
        currentVideo: '',
        currentSession: 0,
        fixDiagram: false,
        hoverVal: '',
        map: undefined,
        prevVideo: '',
        showVideo: false,
        propActiveSession: this.activesession,
        propGrouped: this.grouped,
        previewTime: undefined,
        scaleFactor: '',
        sessionTime: 0,
        svgHeight: '100',
        svgWidth: '',
        video: '',
        viewport: {
          height: '',
          width: ''
        },
        visibleWindow: undefined
      }
    },
    mounted () {
      this.getSvgHeight()
    },
    props: ['session'],
    created: function () {
      window.addEventListener('scroll', this.scrollPos)
    },
    destroyed: function () {
      window.removeEventListener('scroll', this.scrollPos)
    },
    watch: {
      sessionTime () {
        const _this = this
        let found = false
        this.session.annotations.forEach(aobj => {
          if (aobj.duration >= _this.sessionTime && !found) {
            aobj.active = found = true
            const el = this.$refs[`annotation-${aobj.annotation._uuid}-${aobj.duration}`]
            if (Array.isArray(el)) _this.scrollToElement(el[0], 250)
          }
          else aobj.active = false
        })
      }
    },
    methods: {
      changeSessionTime (val) {
        this.setSessionTime(val)
      },
      checkVideoVisibility (videoStart, videoEnd, sessionStart, sessionEnd) {
        if ((videoStart <= sessionStart && videoEnd >= sessionEnd) || (videoStart >= sessionStart && videoEnd <= sessionEnd) || (videoStart > sessionStart && videoStart < sessionEnd && videoEnd > sessionEnd)) return true
        else return false
      },
      playerReady (player) {
        this.player = player
        this.setSessionTime(this.sessionTime)
      },
      onPlayerTime (evt) {
        this.sessionTime = SessionHelpers.annotationToSessionTime(evt, this.video.annotation, this.session)
      },
      onClickVideo (vid) {
        this.showVideo = true
        this.video = vid
        this.currentVideo = vid.annotation._uuid
      },
      onCloseVideo () {
        this.showVideo = false
        this.currentVideo = ''
      },
      onAnnotationPreview (annotation) {
        if (annotation !== undefined) this.previewTime = annotation.relativeTime
        else this.previewTime = undefined
      },
      scrollPos (event) {
        this.visibleWindow = {
          top: window.scrollY,
          height: event.target.body.offsetHeight,
          windowHeight: window.innerHeight
        }
        const bounds = this.$refs.stream.getBoundingClientRect()
        this.fixDiagram = bounds.top < 50 && (bounds.height + bounds.top) >= window.innerHeight
      },
      setSessionTime (seconds) {
        if (this.player) {
          const time = SessionHelpers.sessionToAnnotationTime(seconds, this.video.annotation, this.session)
          this.player.currentTime(time)
        }
        else this.sessionTime = seconds
      },
      scrollToElement (el, duration = 1000) {
        let target = getScrollTarget(el)
        let offset = el.offsetTop - el.scrollHeight
        setScrollPosition(target, offset, duration)
      },
      getSvgHeight () {
        this.svgHeight = this.session.duration
      },
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'annotate':
          return _this.$router.push(`/piecemaker/media/${data.row._uuid}/annotate`)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .moba-active-line
    fill $primary!important

  .moba-active-swimlane
    fill $primary!important

  .moba-annotation-tag:hover
    background-color white!important
    color #000!important

  .moba-border
    border 1px solid rgba( 255, 255, 255, .075 )

  .moba-border-top
    border-top 1px solid rgba( 255, 255, 255, .05 )

  .moba-fixed
    position fixed
    top 50px
    left 0px

  .moba-hover
    border: 1px solid transparent

  .moba-hover:hover
    background-color rgba(0, 0, 0, 0)
    border 1px solid rgba( 255, 255, 255, 0)

  .moba-hover .moba-edit
    opacity 0

  .moba-hover:hover .moba-edit
    opacity 1

  .moba-list-entry:hover
    transition background-color ease 250ms

  .moba-list-entry .moba-list-hidden
    transition opacity ease 250ms
    opacity 0

  .moba-list-entry:hover .moba-list-hidden
    opacity 1

  .moba-separator
    fill rgba( 255, 255, 255, 1 )!important
    x 0
</style>
