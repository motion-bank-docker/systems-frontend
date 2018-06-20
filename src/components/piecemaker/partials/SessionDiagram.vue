<template lang="pug">

    div

      q-window-resize-observable(@resize="onResize")

      // info window – dev only
      //
        .fixed(
        v-model="previewLine",
        style="top: 50px; left: 30px;"
        ) bla {{ previewLine.positionY }} {{ previewDot.referencetime }}

      // sessions – wrap
      //
      div

        // diagramm wrap
        //
        div.q-mb-lg

          .row.col-12.q-pt-xl

            // dev test
              div.bg-blue(style="height: 90%;")
                svg.bg-red(
                // :width="100",
                height="50%"
                )
                  rect(
                  width="30",
                  height="100",
                  x="0",
                  y="0",
                  style="fill: rgba(255,255,255, .4)!important;"
                  )

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
            .col-4(style="height: 80vh; overflow-x: scroll; overflow-y: hidden;")

              // svg(
                v-model="svgHeight",
                // :width="computedSvgWidth",
                // :height="viewportHeight / 100 * 80"
                )
              svg(
              v-model="svgHeight",
              width="100%",
              :height="viewportHeight / 100 * 80"
              )

                // swimlanes – wrap
                //
                svg

                  // Linie links
                  //
                  line(
                  x1="0", y1="0",
                  x2="0", :y2="viewportHeight / 100 * 80",
                  style="stroke: rgba(255,255,255,.1); stroke-width: 1;"
                  )

                  // Trennlinie zwischen gesamt / annotation sessions
                  //
                  line(
                  x1="100%", y1="0",
                  x2="100%", y2="100%",
                  style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;"
                  )

                  // vertical lines – VIDEOS
                  //
                  svg(
                  x="15"
                  )
                    rect.moba-swimlane(
                    v-for="(video, i) in videos",
                    width="30",
                    :height="video.duration * ((viewportHeight / 100 * 80) / svgHeight)",
                    :x="(30 + 10) * i",
                    :y="video.referencetime * ((viewportHeight / 100 * 80) / svgHeight)"
                    )

                  // annotations - ALL
                  //
                  g
                    rect.moba-svg-entry(
                    v-for="annotation in filteredAnnotations",
                    @mouseenter="previewDot.visibility = true, previewDot.referencetime = annotation.referencetime, previewDot.positionY = annotation.referencetime",
                    @mouseleave="previewDot.visibility = false",
                    width="100%",
                    height="1",
                    :y="annotation.referencetime * ((viewportHeight / 100 * 80) / svgHeight)"
                    style="fill: rgba(255,255,255, .4)!important;"
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

            div.col-8(style="height: 80vh; overflow-y: scroll;")
              // div.q-pa-md.q-caption(
                v-for="(annotation, i) in byReferencetime",
                //:class="{'moba-border-top': i > 0}",
                @mouseenter="previewLine.positionY = annotation.referencetime, previewLine.visiibility = true",
                style="border-right: 1px solid rgba( 255, 255, 255, .1 );"
                )
              div.q-pa-md(
              v-for="(annotation, i) in byReferencetime",
              @mouseenter="previewLine.positionY = annotation.referencetime, previewLine.visiibility = true"
              )
                .row(
                :class="{'moba-border-top': handlerPrevItem(i) != annotation.author}"
                )
                  .col-2.text-grey-8.q-caption
                    div(v-if="handlerPrevItem(i) != annotation.author")
                      | {{ annotation.author }}
                    | {{ annotation.referencetime }}
                  //
                    .col-3.text-grey-8 Created: {{ annotation.created }}
                    .col-3.text-grey-8 Type: {{ annotation.type }}
                    .col-3.text-grey-8.text-right Author: {{ annotation.author }}
                  .col-10(v-if="annotation.type == 'video'")
                    iframe(width="100%", height="315", :src="annotation.text", frameborder="0", allow="autoplay; encrypted-media", allowfullscreen)
                  .col-10(v-else) {{ annotation.text }}

</template>

<script>
  import { QWindowResizeObservable, QList, QItem, QItemMain, QItemSide, QItemTile, QTooltip, QCard } from 'quasar'

  export default {
    components: {
      QWindowResizeObservable,
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
      handlerPrevItem (valIndex) {
        if (valIndex > 0) {
          let newIndex = valIndex - 1
          return this.byReferencetime[newIndex].author
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
            text = 'sss'
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
          else {
            type = 'text'
            text = 'aaaaaa'
          }
          if (i >= 1 && i <= 20) {
            author = 'A. Z.'
          }
          else if (i >= 30 && i <= 80) {
            author = 'system'
          }
          else if (i >= 100 && i <= 130) {
            author = 'B. Y.'
          }
          else {
            author = 'C. X.'
          }
          this.annotations.push({referencetime: Math.floor(Math.random() * this.svgHeight), duration: dur, created: i, text: text, type: type, author: author})
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
          title: 'video 1'
        }, {
          created: '20',
          duration: '1100',
          id: '',
          referencetime: '20',
          title: 'video 1'
        }, {
          created: '25',
          duration: '500',
          id: '',
          referencetime: '270',
          title: 'video 1'
        }, {
          created: '300',
          duration: '200',
          id: '',
          referencetime: '12',
          title: 'video 1'
        }]
      }
    }
  }
</script>

<style>

  .moba-border-top {
  border-top: 1px solid rgba( 255, 255, 255, .05 );
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
  }

  .moba-svg-entry:hover {
    fill: red!important;
    opacity: 1;
  }
</style>
