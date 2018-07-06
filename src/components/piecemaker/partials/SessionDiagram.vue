<template lang="pug">

    div(@mouseup="resizeButtonUp()")
      q-window-resize-observable(@resize="onResize")

      // video preview
      //
      .fixed(v-if="previewWindow.visibility", :class="{'row full-width': fixDiagram, 'shadow-16': !fixDiagram}", :style="{height: previewWindow.height + 'px', bottom: 0, right: 0}")
        .col-8.offset-4.bg-dark.text-center.moba-border-top(style="position: relative;")
          .absolute(style="bottom: 10px; left: 10px;")
            q-icon(name="info_outlined")
              q-tooltip.bg-dark.shadow-8.moba-border(anchor="top left", self="bottom left", :offset="[0, 10]")
                div
                  |Videoinfos:
                  br
                  | Author, Länge, ...
          .absolute(@mousedown="resizeButtonDown()", style="top: 10px; left: 10px;")
            q-icon.rotate-90(name="code")
          q-btn.absolute(@click="previewWindow.visibility = false", style="top: 10px; right: 10px;", round, size="sm")
            q-icon(name="clear")
          // iframe(width="80%", height="100%", src="https://www.youtube.com/embed/zS8hEj37CrA", frameborder="0", allow="autoplay; encrypted-media", allowfullscreen)
          div(style="width: 80%; margin-left: 10%;")
            video-player(v-if="video", :src="video.annotation.body.source.id", @ready="playerReady($event)", @time="onPlayerTime($event)")

      // annotations: diagram
      //
      div#diagram(ref="diagram")
        .row.col-12.q-pt-xl

          // Filter
          //
          .hidden.col-12.q-mb-md.row

            .col-12.row.q-mb-sm
              .col-12.q-mt-md

                // select – FILTERED
                //
                div.text-grey-6.q-pb-xs.q-caption.float-left.q-pr-lg(
                v-for="(n, i) in arrFilter",
                @mouseenter="filterAnnotations(arrFilter[i].rangebegin, arrFilter[i].rangeend)",
                @mouseleave="filterAnnotations(0, 200)"
                )
                  q-checkbox(
                  v-model="selectedAnnotationSessions",
                  :val="n",
                  checked-icon="check",
                  unchecked-icon="check",
                  color="white"
                  )
                    span.q-ml-sm {{ arrFilter[i].rangebegin }} – {{ arrFilter[i].rangeend }}
                    // q-btn go

            // .col-12.row.q-pt-xs.moba-border-top
              .col-6(v-model="hoverVal")
                | Annotation Session von {{ hoverVal }}
              .col-2.text-right
                q-btn(@click="annotationSessionWidth = annotationSessionWidth - 10", size="sm")
                  q-icon.rotate-90(name="unfold_less")
                q-btn.q-ml-sm(@click="annotationSessionWidth = annotationSessionWidth + 10", size="sm")
                  q-icon.rotate-90(name="unfold_more")
              .col-4.text-right
                q-btn(size="sm") hide

          // svg wrap
          //
          .col-4(:class="{'row': fixDiagram, 'shadow-16': !fixDiagram}")

            .col-4.shadow-16.moba-border(:class="{'moba-fixed': fixDiagram, 'full-width': fixDiagram}", style="height: calc(100vh - 50px); overflow: scroll;")
              svg(
              width="100%",
              :height="session.duration",
              )

                // swimlanes
                // WRAP
                //
                svg(width="100px")
                  svg(v-for="(vid, i) in propGrouped.videos", @click="previewWindow.visibility = true, video = vid", width="20px", height="100%", :x="(20 + 10) * i", y="0")
                    rect.moba-swimlane(width="100%", height="100%", x="0", y="0")
                    line(v-for="n in 30", x1="0", x2="100%", :y1="n * 60", :y2="n * 60", style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;")

                // lines
                // WRAP
                //
                svg(width="20%", height="100%", x="80%")
                  rect.cursor-pointer.moby-svg-entry(
                  v-for="(annotation, i) in propGrouped.sessions[currentSession].annotations",
                    @click="setSessionTime(annotation.seconds), previewLine.positionY = annotation.seconds",
                  height="1",
                  width="100%",
                  x="0",
                  :y="annotation.seconds",
                  style="fill: rgba(255,255,255, .1);"
                  )

                // preview line
                //
                svg(width="100%", height="100%")
                  rect(
                  width="100%",
                  height="1",
                  :y="previewLine.positionY"
                  style="fill: rgba(255, 255, 255, .1)!important;"
                  )

                // swimlanes – wrap
                //
                svg

                  // vertical lines
                  // VIDEOS + TIME RANGES
                  //
                  svg(x="15")
                    svg(
                    @click="previewWindow.visibility = true",
                    v-for="(video, i) in propGrouped.videos",
                    width="20",
                    :height="30",
                    :x="(20 + 10) * i",
                    :y="40"
                    )
                      g(v-if="video.type == 'video'")
                        rect.moba-swimlane(
                        width="100%",
                        height="100%"
                        )
                        rect.moba-svg-entry(
                        v-for="n in 30",
                        width="100%",
                        height="20",
                        :y="(n - 1) * 20"
                        )
                        line(
                        v-for="n in 30"
                        x1="30%", :y1="n * 20",
                        x2="70%", :y2="n * 20",
                        style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;"
                        )
                        line(
                        v-for="n in 10"
                        x1="0%", :y1="n * 120",
                        x2="100%", :y2="n * 120",
                        style="stroke: rgba(255, 255, 255, .25); stroke-width: 1;"
                        )
                      g(v-else-if="video.type == 'timerange'")
                        // rect.moba-swimlane(
                          width="100%",
                          height="100%"
                          )
                        rect.moba-svg-entry(
                        v-for="n in 30",
                        width="100%",
                        height="20",
                        :y="(n - 1) * 20",
                        fill="transparent"
                        )
                        line(
                        x1="50%", y1="0",
                        x2="50%", y2="100%",
                        style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;"
                        )
                        line(
                        v-for="n in 30"
                        x1="40%", :y1="n * 20",
                        x2="60%", :y2="n * 20",
                        style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;"
                        )
                        line(
                        v-for="n in 10"
                        x1="20%", :y1="n * 120",
                        x2="80%", :y2="n * 120",
                        style="stroke: rgba(255, 255, 255, .25); stroke-width: 1;"
                        )

                  // horizontal lines - ANNOTATIONS (all)
                  //
                    svg(width="20%", height="100%", x="80%")
                      rect.moby-svg-entry(
                      v-for="annotation in propGrouped.sessions[0].annotations",
                      height="10",
                      width="40",
                      x="100",
                      y="40",
                      fill="red",
                      // :style="{fill: 'rgba(255,255,255, .4)', width: '80%'}"
                      )

                  //
                    svg(width="20%", x="80%")
                      rect(width="100%", height="100%", fill="rgba(255, 0, 0, 0)") // dev
                      rect.moba-svg-entry(
                      v-for="annotation in propGrouped",
                      v-if="annotation.type != 'video'",
                      @mouseenter="previewDot.visibility = true, previewDot.referencetime = annotation.referencetime, previewDot.positionY = annotation.referencetime",
                      @mouseleave="previewDot.visibility = false",
                      @click="jumpToAnchor(annotation.id), previewLine.positionY = annotation.referencetime",
                      height="1",
                      x="20%",
                      // :y="annotation.referencetime * ((viewportHeight / 100 * 80) / svgHeight)",
                      // :style="{fill: 'rgba(255,255,255, .4)', width: '80%'}",
                      // :class="{'full-width': annotation.type === 'separator', 'moba-separator': annotation.type === 'separator'}"
                      )

                // annotations
                // FILTERED
                // Erstmal nicht löschen!
                //
                  svg(
                  v-for="(n, i) in arrFilter",
                  // :x="180 + (annotationSessionWidth * i)"
                  )
                    rect(
                    @mouseenter="hoverVal = n.rangebegin + ' - ' + n.rangeend",
                    // :width="annotationSessionWidth",
                    height="100%",
                    fill="rgba(0, 0, 0, 0)"
                    )
                    line(
                    // :x1="annotationSessionWidth",
                    y1="0",
                    // :x2="annotationSessionWidth",
                    y2="100%",
                    style="stroke: rgba(255,255,255,.1); stroke-width: 1;"
                    )
                    g
                      rect.moba-svg-entry(
                      v-for="annotation in annotationsBlocks[i]",
                      @mouseenter="previewDot.visibility = true, previewDot.referencetime = annotation.referencetime, previewDot.positionY = annotation.referencetime",
                      @mouseleave="previewDot.visibility = false",
                      // :width="annotationSessionWidth",
                      // :height="annotation.duration * ((viewportHeight / 100 * 80) / svgHeight) + 0.5",
                      // :y="annotation.referencetime * ((viewportHeight / 100 * 80) / svgHeight)"
                      style="fill: rgba(255,255,255, .4)!important;"
                      )

          // annotations
          // TEXT
          //
          div#annotations-text.col-8(v-for="gr in propGrouped.sessions")
            div.q-pl-sm(
            v-for="annotation in gr.annotations",
            @mouseenter="previewLine.positionY = annotation.seconds, previewLine.visibility = true",
            :ref="annotation.annotation.uuid"
            )
              .row.moba-list-entry(:ref="`annotation-${annotation.annotation.uuid}-${annotation.seconds.toFixed(3)}`")
                .row.col-12(style="line-height: 1.35rem;")
                  .col-12.row.q-px-md.q-py-sm.moba-round-borders(:class="[annotation.type != 'system' ? 'moba-hover' : '', annotation.type == 'separator' ? 'bg-grey-9 text-black text-center' : '']")
                    div.col-10

                      // author
                      //
                      span.text-grey-9 {{ shortenName(annotation.annotation.author.name) }}&nbsp;&nbsp;
                        q-tooltip.bg-dark.shadow-8.moba-border(anchor="center left", self="center right", :offset="[10, 0]") {{ annotation.annotation.author.name }}

                      // value
                      //
                      span(:class="[annotation.active ? 'text-primary' : '']") {{ annotation.annotation.body.value }}

                    // annotation tags
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

                    // btn -> post annotation screen
                    //
                    .col-1.text-right.moba-edit
                      q-btn.bg-dark.text-white.flip-horizontal.moba-border(icon="keyboard_backspace", size="sm", round, flat)

            div.q-pl-sm(
            v-for="(annotation, i) in byReferencetime",
            @mouseenter="previewLine.positionY = annotation.referencetime, previewLine.visiibility = true",
            :class="{'q-my-xl': annotation.type === 'separator'}",
            :ref="annotation.id"
            )
              .row.moba-list-entry

                .row.col-12(style="line-height: 1.35rem;")

                  // annotation
                  //
                  .col-12.row.q-px-md.q-py-sm.moba-round-borders(:class="[annotation.type != 'system' ? 'moba-hover' : '', annotation.type == 'separator' ? 'bg-grey-9 text-black text-center' : '']")
                    div.col-10

                      // author
                      span.text-grey-9 {{ annotation.author }}&nbsp;&nbsp;
                        q-tooltip.bg-dark.shadow-8.moba-border(anchor="center left", self="center right", :offset="[10, 0]") Christian Hansen

                      // video
                      iframe(v-if="annotation.type == 'video'", :class="{'hidden':annotation.type == 'video'}", width="100%", height="315", :src="annotation.text", frameborder="0", allow="autoplay; encrypted-media", allowfullscreen)

                      //system
                      span.text-grey-9.q-caption(v-else-if="annotation.type == 'system'") [{{ annotation.text }}]

                      // tag
                      q-chip.bg-transparent.text-grey-4.moba-border(v-else-if="annotation.type == 'tag'") {{ annotation.text }}
                        q-context-menu.bg-dark.text-white.moba-border.moba-annotation-tag
                          .q-pa-sm add to filter

                      // separator
                      q-chip.bg-transparent(v-else-if="annotation.type == 'separator'") {{ annotation.text }}

                      // text
                      span(v-else-if="annotation.type != 'tag'") {{ annotation.text }}

                      // span.q-ml-lg.q-caption() {{ annotation.tags }}
                    .col-1
                      div(v-if="annotation.tags.length > 0")
                        div.text-right
                          span
                            q-chip.bg-dark.text-white.moba-border.moba-annotation-tag
                              | #
                            q-tooltip.bg-dark.q-py-none.shadow-8.moba-border(anchor="top left", self="top right", :offset="[10, 0]")
                              q-list.no-border
                                q-item(v-for="(at, ati) in annotation.tags", :class="{'q-pa-xs': ati - 2 < annotation.tags.length}")
                                  q-chip.bg-transparent.text-grey-4.moba-border {{ at }}
                    .col-1.text-right.moba-edit
                      q-btn.bg-dark.text-white.flip-horizontal.moba-border(:class="[annotation.type != 'system' ? '' : 'hidden']", icon="keyboard_backspace", size="sm", round, flat)

</template>

<script>
  import { scroll } from 'quasar'
  import VideoPlayer from '../../shared/media/VideoPlayer'
  import SessionHelpers from '../../../lib/annotations/session-helpers'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
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
      // this.getSvgHeight(this.videos)
      this.getSvgHeight(this.propGrouped)
      this.sortAnnotations(this.annotations)
      this.filterAnnotations(0, this.numberRandomAnnotations)
      this.getAnnotationSessionWidth()
    },
    props: ['data', 'grouped', 'meta'],
    computed: {
      computedSvgWidth: function () {
        // return (30 + 10) * this.videos.length + 20 + (this.selectedAnnotationSessions.length * 40)
        return (30 + 10) * this.videos.length + 20 + (this.arrFilter.length * this.annotationSessionWidth)
      }
    },
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
            if (Array.isArray(el)) _this.scrollToElement(el[0], 500)
          }
          else aobj.active = false
        })
      }
    },
    methods: {
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
      handlerPreviewWindow () {
        this.previewWindow.height = this.viewportHeight - event.clientY + 20
        // console.log(this.previewWindow.height)
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
      handlerPrevItem (valIndex, valProp) {
        if (valIndex > 0) {
          let newIndex = valIndex - 1
          if (valProp === 'author') {
            return this.byReferencetime[newIndex].author
          }
          else if (valProp === 'referencetime') {
            return this.byReferencetime[newIndex].referencetime
          }
        }
      },
      filterAnnotations (valFrom, valTo) {
        this.filteredAnnotations = this.annotations.filter(annotation => annotation.created > valFrom && annotation.created <= valTo)
        let i = 0
        for (i = 0; i < this.arrFilter.length; i++) {
          this.annotationsBlocks.push(this.annotations.filter(annotation => annotation.created > this.arrFilter[i]['rangebegin'] && annotation.created <= this.arrFilter[i]['rangeend']))
        }
      },
      getAnnotationSessionWidth () {
        this.annotationSessionWidth = 100
      },
      getSvgHeight (arr) {
        this.svgHeight = arr.sessions[this.currentSession].seconds
        console.log('dur ' + this.session.duration)
      },
      getSvgWidth (arrVideos, arrSelected) {
        console.log(arrSelected)
        this.svgWidth = (30 + 10) * arrVideos.length + 20
      },
      sortAnnotations (arr) {
        arr.sort(function (a, b) { return a.referencetime - b.referencetime })
        this.byReferencetime = arr
      },
      setPrevCreated (val, valPrev) {
        console.log(valPrev)
        this.prevCreated = parseInt(val) + parseInt(50)
      },
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'annotate':
          return _this.$router.push(`/piecemaker/videos/${data.row.uuid}/annotate`)
        }
      },
      onResize (size) {
        this.viewportHeight = size.height
        console.log(this.viewportHeight / 100 * 80)
      }
    },
    data () {
      const _this = this
      return {
        currentSession: 0,
        sessionTime: 0,
        video: 'https://www.youtube.com/embed/zS8hEj37CrA',
        session: {
          duration: this.grouped.sessions[0].seconds
        },
        propGrouped: this.grouped,
        fixDiagram: '',
        previewWindow: {
          visibility: false,
          height: ''
        },
        prevItem: '',
        map: undefined,
        allAnnotationSessions: [],
        annotations: [],
        annotationsBlocks: [],
        annotationSessionWidth: '',
        arrFilter: [{ // dev only
          rangebegin: 0,
          rangeend: 30
        }, {
          rangebegin: 31,
          rangeend: 60
        }, {
          rangebegin: 61,
          rangeend: 70
        }, {
          rangebegin: 71,
          rangeend: 100
        }, {
          rangebegin: 101,
          rangeend: 120
        }, {
          rangebegin: 121,
          rangeend: 150
        }, {
          rangebegin: 151,
          rangeend: 200
        }, {
          rangebegin: 61,
          rangeend: 70
        }, {
          rangebegin: 71,
          rangeend: 100
        }, {
          rangebegin: 101,
          rangeend: 120
        }, {
          rangebegin: 0,
          rangeend: 20
        }, {
          rangebegin: 71,
          rangeend: 100
        }, {
          rangebegin: 101,
          rangeend: 120
        }],
        byReferencetime: [],
        filteredAnnotations: [],
        hoverVal: '',
        numberRandomAnnotations: 200, // dev only
        prevCreated: '100',
        previewDot: {
          positionY: '',
          referencetime: '',
          visibility: false
        },
        previewLine: {
          positionY: '',
          visibility: false
        },
        scaleFactor: '',
        selectedAnnotationSessions: [],
        svgHeight: '100',
        svgWidth: '',
        viewportHeight: '',
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

  .moba-active-swimlane {
    fill: rgba(255, 255, 255, 1);
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
    fill: rgba( 255, 255, 255, .1 );
    transition: fill ease 200ms;
  }

  .moba-swimlane:hover {
    fill: rgba( 0, 0, 255, .1 );
  }

  .moba-svg-entry {
    opacity: .2;
    cursor: pointer;
  }

  .moba-svg-entry:hover {
    fill: rgba(255, 255, 255, 1)!important;
    opacity: 1;
  }
</style>
