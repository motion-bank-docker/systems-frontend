<template lang="pug">

    div

      q-window-resize-observable(@resize="onResize")

      .fixed.bg-dark.shadow-6.q-pa-md(v-if="previewWindow.visibility", style="top: 66px; left: 10px;")
        iframe(width="560", height="315", src="", frameborder="0", allow="autoplay; encrypted-media", allowfullscreen)

      // annotations: diagram
      //
      div

        .row.col-12.q-pt-xl

          // Filter
          //
          .hidden.col-12.q-mb-md.row

            .col-12.row.q-mb-sm
              .col-12.q-mt-md
                //
                  div [Platzhalter Filter] (unter Diagramm?)
                  div bspw. Zeitraum festlegen, Annotations von User xxx
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
          .col-4(style="height: 120vh; overflow-x: scroll; overflow-y: hidden;")

            svg(
            v-model="svgHeight",
            width="100%",
            :height="viewportHeight / 100 * 80"
            )

              // swimlanes – wrap
              //
              svg

                // vertical lines
                // VIDEOS + TIME RANGES
                //
                svg(x="15")
                  svg(
                  v-for="(video, i) in videos",
                  width="20",
                  :height="video.duration * ((viewportHeight / 100 * 80) / svgHeight)",
                  :x="(20 + 10) * i",
                  :y="video.referencetime * ((viewportHeight / 100 * 80) / svgHeight)"
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
                g
                  rect.moba-svg-entry(
                  v-for="annotation in filteredAnnotations",
                  @mouseenter="previewDot.visibility = true, previewDot.referencetime = annotation.referencetime, previewDot.positionY = annotation.referencetime",
                  @mouseleave="previewDot.visibility = false",
                  @click="jumpToAnchor(annotation.id)",
                  height="1",
                  x="70%",
                  :y="annotation.referencetime * ((viewportHeight / 100 * 80) / svgHeight)",
                  :style="{fill: 'rgba(255,255,255, .4)', width: '20%'}",
                  :class="{'full-width': annotation.type === 'separator', 'moba-separator': annotation.type === 'separator'}"
                  )

                // previewLine
                //
                rect(
                width="100%",
                height="1",
                :y="previewLine.positionY * ((viewportHeight / 100 * 80) / svgHeight)"
                style="fill: rgba(255, 255, 255, 1)!important;"
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

          // annotations: text
          //
          div#annotations-text.col-8(style="height: 80vh; overflow-y: scroll;")

            div.q-pl-sm(
            v-for="(annotation, i) in byReferencetime",
            @mouseenter="previewLine.positionY = annotation.referencetime, previewLine.visiibility = true",
            :class="{'q-my-xl': annotation.type === 'separator'}",
            :ref="annotation.id"
            )
              // .row(:class="{'q-mb-lg, moba-border-top': handlerPrevItem(i, 'author') != annotation.author}")
              .row.moba-list-entry
                // .col-10.offset-2.text-grey-8(v-if="handlerPrevItem(i, 'author') != annotation.author") {{ annotation.author }}

                // .col-2.text-grey-8.text-right.q-pr-lg.text-bold
                .col-1.text-grey-8.text-right.q-pr-md
                  // div(v-if="handlerPrevItem(i, 'referencetime') != annotation.referencetime") {{ annotation.referencetime }}
                  div(v-if="annotation.type == 'separator'") ###

                .row(:class="[annotation.tags.length > 0 ? 'col-11' : 'col-9']", style="line-height: 1.35rem;")
                  .col-12.text-grey-9.q-pa-sm(v-if="handlerPrevItem(i, 'author') != annotation.author && annotation.type != 'separator' && annotation.type != 'tag'")
                    h6.q-mt-sm.q-mb-none.text-center {{ annotation.author }}
                  .col-12.row.q-pa-sm.moba-hover
                    // .col-8
                    div(:class="[annotation.tags.length > 0 ? 'col-10' : 'col-12']")
                      iframe(v-if="annotation.type == 'video'", width="100%", height="315", :src="annotation.text", frameborder="0", allow="autoplay; encrypted-media", allowfullscreen)
                      span.text-grey-9.q-caption(v-else-if="annotation.type == 'system'") [{{ annotation.text }}]
                      q-chip.bg-transparent.text-grey-4.moba-border(v-else-if="annotation.type == 'tag'") {{ annotation.text }}
                      span(v-else-if="annotation.type != 'tag'") {{ annotation.text }}
                      q-context-menu
                        .q-pa-sm edit
                      // span.q-ml-lg.q-caption() {{ annotation.tags }}
                    .col-1.offset-1
                      div(v-if="annotation.tags.length > 0")
                        div.text-right
                          q-chip.bg-dark.text-white
                            | #
                        q-tooltip.bg-dark.q-py-none.shadow-8.moba-border(anchor="top left", self="top right", :offset="[-20, 0]")
                          q-list.no-border
                            q-item(v-for="(at, ati) in annotation.tags", :class="{'q-pa-xs': ati - 2 < annotation.tags.length}")
                              q-chip.bg-transparent.text-grey-4.moba-border {{ at }}

</template>

<script>
  import { QWindowResizeObservable, QFab, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip, QCard } from 'quasar'

  export default {
    components: {
      QWindowResizeObservable,
      QFab,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemTile,
      QTooltip,
      QCard
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
      this.getSvgHeight(this.videos)
      this.appendRandomAnnotations()
      this.sortAnnotations(this.annotations)
      this.filterAnnotations(0, this.numberRandomAnnotations)
      this.getAnnotationSessionWidth()
    },
    props: ['data', 'meta'],
    computed: {
      computedSvgWidth: function () {
        // return (30 + 10) * this.videos.length + 20 + (this.selectedAnnotationSessions.length * 40)
        return (30 + 10) * this.videos.length + 20 + (this.arrFilter.length * this.annotationSessionWidth)
      }
    },
    methods: {
      jumpToAnchor (target) {
        console.log('target: ' + target)
        var element = this.$refs[target]
        console.log(element)
        // var top = element.offsetTop
        var elementTest = element[0]
        console.log(elementTest)
        var top = elementTest.offsetTop - window.pageYOffset
        console.log('vvvvv')
        console.log(top)
        console.log('AAAAA')
        var annotationsText = document.getElementById('annotations-text')
        annotationsText.scrollTo(0, top)
        // console.log('jumpToAnchor: ' + target)
        // console.log(annotationsText)
        // window.scrollTo(0, top)
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
      appendRandomAnnotations () { // dev only
        let i = 0
        let author = ''
        let dur = ''
        let text = 'Hier steht ein Text.'
        let type = ''
        let tags = []
        for (i = 0; i < this.numberRandomAnnotations; i++) {
          if (i >= 0 && i <= 10) {
            dur = 40
          }
          else {
            dur = 1
          }
          if (i >= 1 && i <= 5) {
            type = 'video'
            text = 'https://www.youtube.com/embed/lDJFMvU2ZqY'
          }
          else if (i >= 30 && i <= 80) {
            type = 'system'
            text = 'Log entry'
          }
          else if (i >= 85 && i <= 120) {
            type = 'tag'
            text = 'timeline tag'
          }
          else if (i >= 10 && i <= 20) {
            type = 'text'
            text = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   \n' +
              '\n' +
              'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   \n' +
              '\n' +
              'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   \n' +
              '\n' +
              'Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer'
          }
          else if (i === 81 || i === 121) {
            type = 'separator'
            text = 'New Section: Lorem ipsum'
          }
          else {
            type = 'text'
            text = 'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo du.'
            if (i >= 160 && i <= 200) {
              tags = ['annotation tag 1', 'annotation tag 2', 'annotation tag 3']
            }
          }
          if (i >= 1 && i <= 20) {
            author = 'A. Z.'
          }
          else if (i >= 30 && i <= 80) {
            author = 'System'
          }
          else if (i >= 100 && i <= 130) {
            author = 'B. Y.'
          }
          else {
            author = 'C. X.'
          }
          this.annotations.push({id: i, referencetime: Math.floor(Math.random() * this.svgHeight), duration: dur, created: i, text: text, type: type, author: author, tags: tags})
        }
      },
      getAnnotationSessionWidth () {
        this.annotationSessionWidth = 100
      },
      getSvgHeight (arr) {
        let newArr = []
        let arrLength = arr.length
        let i = 0
        for (i = 0; i < arrLength; i++) {
          newArr.push(parseInt(arr[i].referencetime) + parseInt(arr[i].duration))
        }
        newArr.sort(function (a, b) {
          return a - b
        })
        this.svgHeight = newArr[arrLength - 1]
        this.scaleFactor = (this.viewportHeight / 100 * 80) / this.svgHeight
        console.log('xxx: ' + this.scaleFactor)
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
        previewWindow: {
          visibility: false
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
        ],
        videos: [{ // dev only
          created: '1',
          duration: '1000',
          id: '',
          referencetime: '0',
          src: 'https://www.youtube.com/embed/zS8hEj37CrA',
          title: 'video 1',
          type: 'video'
        }, {
          created: '20',
          duration: '1100',
          id: '',
          referencetime: '20',
          src: 'https://www.youtube.com/embed/zS8hEj37CrA',
          title: 'video 1',
          type: 'video'
        }, {
          created: '25',
          duration: '500',
          id: '',
          referencetime: '270',
          src: 'https://www.youtube.com/embed/0VqaGkKQRCU',
          title: 'video 1',
          type: 'video'
        }, {
          created: '50',
          duration: '830',
          id: '',
          referencetime: '120',
          title: 'timerange',
          type: 'timerange'
        }, {
          created: '300',
          duration: '200',
          id: '',
          referencetime: '12',
          src: 'https://www.youtube.com/embed/zS8hEj37CrA',
          title: 'video 1',
          type: 'video'
        }]
      }
    }
  }
</script>

<style>

  .moba-border {
    border: 1px solid rgba( 255, 255, 255, .075 );
  }

  .moba-border-top {
    border-top: 1px solid rgba( 255, 255, 255, .05 );
  }

  .moba-hover {
    transition: background-color ease 50ms;
  }

    .moba-hover:hover {
      background-color: rgba(0, 0, 0, .15);
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

  .moba-separator {
    fill: rgba( 255, 255, 255, 1 )!important;
  }

  .moba-swimlane {
    fill: rgba( 255, 255, 255, .1 );
    transition: fill ease 200ms;
  }

  .moba-swimlane:hover {
    fill: rgba( 0, 0, 0, 1 );
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
