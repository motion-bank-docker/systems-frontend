<template lang="pug">

    div(@mouseup="resizeButtonUp()")
      q-window-resize-observable(@resize="onResize")

      // VIDEO PREVIEW
      //
      .fixed-bottom-right(v-if="previewWindow.visibility", :class="{'row full-width': fixDiagram, 'shadow-16 q-mb-md q-mr-md': !fixDiagram}", style="z-Index: 10;")
        .bg-dark.text-center.relative-position(:class="{'col-8 offset-4 moba-border-top': fixDiagram}")

          // VIDEO PLAYER
          //
            div(:class="{'moba-active-preview': fixDiagram}", :style="styleActivePreview")
            div(:style="styleActivePreview", :class="{styleActivePreviewDocked: fixDiagram}")
          div(:style="[fixDiagram ? styleActivePreview : styleActivePreviewDocked]")
            video-player(v-if="video", :src="video.annotation.body.source.id", @ready="playerReady($event)", @time="onPlayerTime($event)")

          // ICON
          // INFO
          //
          .absolute-bottom-left.q-mb-sm.q-ml-sm
            q-btn.bg-dark.text-center(round, size="sm")
              q-icon(name="info")
            q-tooltip.bg-dark.shadow-8.moba-border(anchor="top left", self="bottom left", :offset="[0, 10]")
              q-list.no-border
                q-item Videoinfos
                q-item Author, Länge, ...

          // BTN
          // RESIZE
          //
          .absolute-top-left.q-mt-sm.q-ml-sm(v-if="fixDiagram", @mousedown="resizeButtonDown()")
            q-btn.rotate-90.bg-dark(icon="code", round, size="sm")

          // BTN
          // CLOSE
          //
          .absolute-top-right.q-mt-sm.q-mr-sm(@click="previewWindow.visibility = false, currentVideo = ''")
            q-btn.bg-dark(icon="clear", round, size="sm")

      // DIAGRAM
      //
      div#diagram(ref="diagram")
        .row.col-12.q-pt-xl

          // SVG
          //
          .col-4(:class="{'row': fixDiagram, 'shadow-16': !fixDiagram}")

            .col-4.shadow-16.moba-border(:class="{'moba-fixed': fixDiagram, 'full-width': fixDiagram}",
            style="height: calc(100vh - 50px); overflow: scroll; z-index: 20;")
              svg(
              width="100%",
              :height="session.duration",
              )

                // LINES - ANNOTATIONS
                // WRAP
                //
                  svg(width="20%", height="100%", x="80%")
                svg(width="100%", height="100%", x="0%")
                  rect.cursor-pointer.moby-svg-entry(
                  v-for="(annotation, i) in propGrouped.sessions[currentSession].annotations",
                    @click="setSessionTime(annotation.seconds), previewLine.positionY = annotation.seconds",
                  height="1",
                  width="100%",
                  x="0",
                  :y="annotation.seconds",
                  style="fill: rgba(255, 255, 255, .2);"
                  )

                // SWIMLANES - VIDEOS
                //
                svg(width="80%")
                  // rect(width="100%", height="100%", fill="rgba(255, 0, 255, .3)")
                  svg.shadow-6(
                  v-for="(vid, i) in propGrouped.videos",
                  :id="vid.annotation._id",
                  @click="previewWindow.visibility = true, video = vid, currentVideo = vid.annotation._id, checkPreviousVideo(vid.annotation._id, sessionTime)",
                  :width="propGrouped.videos.length * 10", height="100%", :x="(propGrouped.videos.length * 10 + 15) * i + 20", y="0"
                  )
                    rect.moba-swimlane(:class="{ 'moba-active-swimlane': currentVideo == vid.annotation._id }",
                    width="100%", height="100%", x="0", y="0")
                    line(v-for="n in parseInt(propGrouped.sessions[currentSession].seconds / 60 + 1)",
                    x1="0", x2="100%", :y1="n * 60", :y2="n * 60", style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;")
                    g(v-if="currentVideo == vid.annotation._id")
                      rect.moba-svg-entry(v-for="n in parseInt(propGrouped.sessions[currentSession].seconds / 20 + 1)",
                      @click="setSessionTime(parseInt(n * 20)), prevVideo = vid.annotation._id",
                      width="100%", height="20", :y="(n - 1) * 20")
                      line(v-for="n in parseInt(propGrouped.sessions[currentSession].seconds / 20 + 1)",
                      x1="25%", x2="75%", :y1="n * 20", :y2="n * 20", style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;")

                // PREVIEW LINE
                //
                svg(width="100%", height="100%")
                  rect(
                  width="100%",
                  height="1",
                  :y="previewLine.positionY"
                  style="fill: rgba(255, 255, 255, .5)!important;"
                  )

          // TEXT
          //
          .col-8
            div(v-for="gr in propGrouped.sessions")
              div.q-pl-sm(
              v-for="annotation in gr.annotations",
              @mouseenter="previewLine.positionY = annotation.seconds, previewLine.visibility = true",
              @click="setSessionTime(annotation.seconds)",
              :ref="annotation.annotation.uuid"
              )
                .row.moba-list-entry(:ref="`annotation-${annotation.annotation.uuid}-${annotation.seconds.toFixed(3)}`")
                  .row.col-12(style="line-height: 1.35rem;")
                    .col-12.row.q-px-md.q-py-sm.moba-round-borders(:class="[annotation.type != 'system' ? 'moba-hover' : '', annotation.type == 'separator' ? 'bg-grey-9 text-black text-center' : '']")
                      div.col-10

                        // AUTHOR
                        //
                        span.text-grey-9 {{ shortenName(annotation.annotation.author.name) }}&nbsp;&nbsp;
                          q-tooltip.bg-dark.shadow-8.moba-border(anchor="center left", self="center right", :offset="[10, 0]") {{ annotation.annotation.author.name }}

                        // TEXT
                        //
                        span(:class="[annotation.active ? 'text-primary' : '']") {{ annotation.annotation.body.value }}

                      // ANNOTATION TAGS
                      // erstmal drin lassen
                      //
                      .col-1
                        // div(v-if="annotation.tags.length > 0")
                          div.text-right
                            span
                              q-chip.bg-dark.text-white.moba-border.moba-annotation-tag
                                | #
                              q-tooltip.bg-dark.q-py-none.shadow-8.moba-border(anchor="top left", self="top right", :offset="[10, 0]")
                                q-list.no-border
                                  q-item(v-for="(at, ati) in annotation.tags", :class="{'q-pa-xs': ati - 2 < annotation.tags.length}")
                                    q-chip.bg-transparent.text-grey-4.moba-border {{ at }}

                      // BUTTON
                      // go to annotation screen
                      //
                      .col-1.text-right.moba-edit
                        q-btn.bg-dark.text-white.flip-horizontal.moba-border(icon="keyboard_backspace", size="sm", round, flat)

</template>

<script>
  import { scroll, easing } from 'quasar'
  import VideoPlayer from '../../shared/media/VideoPlayer'
  import SessionHelpers from '../../../lib/annotations/session-helpers'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      easing,
      VideoPlayer
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
      this.getSvgHeight(this.propGrouped)
    },
    props: ['data', 'grouped', 'meta'],
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
        this.propGrouped.sessions[this.currentSession].annotations.forEach(aobj => {
          if (aobj.seconds >= _this.sessionTime && !found) {
            aobj.active = found = true
            const el = this.$refs[`annotation-${aobj.annotation.uuid}-${aobj.seconds}`]
            if (Array.isArray(el)) _this.scrollToElement(el[0], 250)
          }
          else aobj.active = false
        })
      }
    },
    methods: {
      checkPreviousVideo (video, seconds) { // TODO: doesn't work yet
        if (video !== this.prevVideo) {
          console.log('ch video ' + video)
          console.log('ch seconds ' + seconds)
          console.log('ch sessionTime ' + this.sessionTime)
          // this.sessionTime = seconds
          // this.setSessionTime(this.sessionTime)
          // this.player.currentTime(this.sessionTime)
          this.setSessionTime(seconds)
        }
        // console.log(val)
        // console.log(this.prevVideo)
      },
      playerReady (player) {
        this.player = player
      },
      onPlayerTime (evt) {
        this.sessionTime = SessionHelpers.annotationToSessionTime(evt, this.video.annotation,
          this.propGrouped.sessions[this.currentSession])
      },
      shortenName (val) {
        return val.match(/\b\w/g).join('')
      },
      resizeButtonDown () {
        window.addEventListener('mousemove', this.handlerPreviewWindow)
      },
      resizeButtonUp () {
        window.removeEventListener('mousemove', this.handlerPreviewWindow)
      },
      handlerPreviewWindow () { // TODO: clean up
        this.previewWindow.height = this.viewport.height - event.clientY + 20
        this.previewWindow.testHeight = this.viewport.height - event.clientY
        this.previewWindow.testWidth = this.previewWindow.testHeight * 1.77777
        // this.styleActivePreview.width = (this.viewport.width / 12 * 8) - event.clientY + 'px'
        let testWidth = (this.viewport.height - event.clientY) * 1.777 + 35
        let testMarginLeft = ((this.viewport.width / 12 * 8) / 2) - (testWidth / 2)
        this.styleActivePreview.width = testWidth + 'px'
        if (testMarginLeft > 0) this.styleActivePreview.marginLeft = testMarginLeft + 'px'
        else this.styleActivePreview.marginLeft = '0px'
      },
      scrollPos () {
        this.fixDiagram = this.$refs.diagram.getBoundingClientRect().top < '50'
      },
      setSessionTime (seconds) {
        console.log(seconds, this.player, this.sessionTime)
        if (this.player) {
          const time = SessionHelpers.sessionToAnnotationTime(seconds, this.video.annotation,
            this.propGrouped.sessions[this.currentSession])
          this.player.currentTime(time)
          console.log('new time', time)
        }
        else this.sessionTime = seconds
      },
      scrollToElement (el, duration = 1000) {
        let target = getScrollTarget(el)
        let offset = el.offsetTop - el.scrollHeight
        setScrollPosition(target, offset, duration)
      },
      getSvgHeight (arr) {
        this.svgHeight = arr.sessions[this.currentSession].seconds
      },
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'annotate':
          return _this.$router.push(`/piecemaker/videos/${data.row.uuid}/annotate`)
        }
      },
      onResize (size) {
        this.viewport.height = size.height
        this.viewport.width = size.width
      }
    },
    data () {
      const _this = this
      return {
        /* allAnnotationSessions: [], */
        annotations: [],
        annotationsBlocks: [],
        /* byReferencetime: [], */
        currentVideo: '',
        currentSession: 0,
        /* filteredAnnotations: [], */
        fixDiagram: '',
        hoverVal: '',
        map: undefined,
        propGrouped: this.grouped,
        // prevCreated: '100',
        prevItem: '',
        prevVideo: '',
        previewDot: {
          positionY: '',
          referencetime: '',
          visibility: false
        },
        previewLine: {
          positionY: '',
          visibility: false
        },
        previewWindow: {
          visibility: false,
          height: '',
          testHeight: '',
          testWidth: ''
        },
        session: {
          duration: this.grouped.sessions[0].seconds
        },
        sessionTime: 0,
        styleActivePreview: {
          width: 40 + '%',
          maxWidth: '100%',
          marginLeft: '30%'
        },
        styleActivePreviewDocked: {
          // scaleFactor: 1.77777,
          width: 200 * 1.77777 + 'px',
          height: 200 + 'px!important',
          maxHeight: 200 + 'px!important',
          marginLeft: '0px'
        },
        scaleFactor: '',
        selectedAnnotationSessions: [],
        svgHeight: '100',
        svgWidth: '',
        // viewportHeight: '',
        video: '',
        viewport: {
          height: '',
          width: ''
        },
        columns: [
          {
            label: _this.$t('labels.video_title'),
            field: 'title',
            type: 'string',
            sort: true,
            filter: true
          },
          {
            label: _this.$t('labels.created'),
            field: 'created',
            type: 'date',
            sort: true
          },
          {
            label: _this.$t('labels.updated'),
            field: 'updated',
            type: 'date',
            sort: true
          },
          {
            label: _this.$t('labels.author'),
            field: 'author'
          }
        ],
        actions: [
          { type: 'annotate', title: 'buttons.annotate', color: 'primary' },
          { type: 'edit', title: 'buttons.edit' },
          { type: 'synchronize', title: 'buttons.synchronize' },
          { type: 'delete', title: 'buttons.delete', icon: 'highlight off' }
        ]
      }
    }
  }
</script>

<style>

  .moba-annotation-tag:hover {
    background-color: white!important;
    color: #000!important;
    /*transition: all ease 350ms;*/
  }

  /* .moba-active-preview {
    margin-left: 10%;
    width: 80%;
  } */

  .moba-active-swimlane {
    fill: #749dfc!important;
  }

  .moba-border {
    border: 1px solid rgba( 255, 255, 255, .075 );
  }
  .moba-border-top {
    border-top: 1px solid rgba( 255, 255, 255, .05 );
  }

  .moba-fixed {
    position: fixed;
    top: 50px;
    left: 0px;
  }

  .moba-hover {
    border: 1px solid transparent;
  }

    .moba-hover:hover {
      /* background-color: rgba(0, 0, 0, .15);
      border: 1px solid rgba( 255, 255, 255, .1 );*/
      background-color: rgba(0, 0, 0, 0);
      border: 1px solid rgba( 255, 255, 255, 0);
    }

    .moba-hover .moba-edit{
      opacity: 0;
    }

    .moba-hover:hover .moba-edit{
      opacity: 1;
    }

  .moba-list-entry:hover {
    transition: background-color ease 250ms;
    /* background-color: rgba(255, 255, 255, .05); */
  }

  .moba-list-entry .moba-list-hidden {
    transition: opacity ease 250ms;
    opacity: 0;
  }

    .moba-list-entry:hover .moba-list-hidden {
      opacity: 1;
    }

  .moba-round-borders {
    border-radius: .5rem;
  }

  .moba-separator {
    fill: rgba( 255, 255, 255, 1 )!important;
    x: 0;
  }

  .moba-swimlane {
    /* fill: rgba( 20, 20, 20, 1 ); */
    /* fill: rgba( 255, 255, 255, 1 ); */
    fill: #1F1D1E;
    stroke-width: 1;
    stroke: rgba(255, 255, 255, .25);
    transition: fill ease 200ms;
  }

  .moba-swimlane:hover {
    fill: rgba( 255, 255, 255, .4 );
  }

  .moba-svg-entry {
    opacity: 0;
    cursor: pointer;
  }

  .moba-svg-entry:hover {
    fill: rgba(255, 255, 255, 1)!important;
    opacity: 1;
  }
</style>
