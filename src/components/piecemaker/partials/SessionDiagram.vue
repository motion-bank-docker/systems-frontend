<template lang="pug">

    div

      q-window-resize-observable(@resize="onResize")

      // info window – dev only
      //
      .fixed(
      v-model="previewLine",
      v-if="previewLine.visibility"
      ) {{ previewLine.positionY }} {{ previewDot.referencetime }}

      // sessions – wrap
      //
      div

        // diagramm wrap
        //
        div.q-mb-lg(style="height: 80vh; overflow: hidden;")

          .row.col-12(style="height: 100%;")

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
            .col-12.q-mb-md.row
              .col-9
                div [Platzhalter Filter] (unter Diagramm?)
                div bspw. Zeitraum festlegen, Annotations von User xxx
              .col-3.text-right
                q-btn(@click="annotationSessionWidth = annotationSessionWidth - 10")
                  q-icon.rotate-90(name="unfold_less")
                q-btn.q-ml-sm(@click="annotationSessionWidth = annotationSessionWidth + 10")
                  q-icon.rotate-90(name="unfold_more")

            // auswahl – wrap
            //
            .col-4.hidden

              // select – FILTERED
              //
              div.text-grey-6.q-pb-xs.q-caption(
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
                  q-btn go

              div
                q-btn(@click="", no-caps) Detailview

            // svg wrap
            //
            // .col-8
            .col-12(style="overflow-x: scroll; overflow-y: hidden;")

              svg(
              v-model="svgHeight",
              :width="computedSvgWidth",
              :height="viewportHeight / 100 * 80"
              )

                // swimlanes – wrap
                //
                svg

                  line(
                  x1="0",
                  y1="0",
                  x2="0",
                  :y2="viewportHeight / 100 * 80",
                  style="stroke: rgba(255,255,255,.1); stroke-width: 1;"
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

                  // Trenner: gesamt < > annotation sessions
                  //
                  line(
                  :x1="180",
                  y1="0",
                  :x2="180",
                  y2="100%",
                  style="stroke: rgba(255,255,255,.5); stroke-width: 1;"
                  )

                  // annotations - ALL
                  //
                  g
                    rect.moba-svg-entry(
                    v-for="annotation in filteredAnnotations",
                    @mouseenter="previewDot.visibility = true, previewDot.referencetime = annotation.referencetime, previewDot.positionY = annotation.referencetime",
                    @mouseleave="previewDot.visibility = false",
                    width="180",
                    height="1",
                    :y="annotation.referencetime * ((viewportHeight / 100 * 80) / svgHeight)"
                    style="fill: rgba(255,255,255, .4)!important;"
                    )
                    rect(
                    v-if="previewLine.visibility",
                    width="180",
                    height="1",
                    :y="previewLine.positionY"
                    style="fill: rgba(255,0,0, 1)!important;"
                    )

                // annotations
                // FILTERED
                //
                  svg(
                  v-for="(n, i) in selectedAnnotationSessions",
                  // :x="180 + ((20 + 10) * i)"
                  )
                svg(
                v-for="(n, i) in arrFilter",
                :x="180 + (annotationSessionWidth * i)"
                )
                  line(
                  :x1="annotationSessionWidth",
                  y1="0",
                  :x2="annotationSessionWidth",
                  y2="100%",
                  style="stroke: rgba(255,255,255,.1); stroke-width: 1;"
                  )
                  g
                    rect.moba-svg-entry(
                    v-for="annotation in annotationsBlocks[i]",
                    @mouseenter="previewDot.visibility = true, previewDot.referencetime = annotation.referencetime, previewDot.positionY = annotation.referencetime",
                    @mouseleave="previewDot.visibility = false",
                    :width="annotationSessionWidth",
                    :height="annotation.duration * ((viewportHeight / 100 * 80) / svgHeight) + 0.5",
                    :y="annotation.referencetime * ((viewportHeight / 100 * 80) / svgHeight)"
                    style="fill: rgba(255,255,255, .4)!important;"
                    )

</template>

<script>
  import { QWindowResizeObservable, QList, QItem, QItemMain, QItemSide, QTooltip, QCard } from 'quasar'

  export default {
    components: {
      QWindowResizeObservable,
      QList,
      QItem,
      QItemMain,
      QItemSide,
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
      this.divideInBlocks(this.annotations)
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
      filterAnnotations (valFrom, valTo) {
        this.filteredAnnotations = this.annotations.filter(annotation => annotation.created > valFrom && annotation.created <= valTo)
        let i = 0
        for (i = 0; i < this.arrFilter.length; i++) {
          this.annotationsBlocks.push(this.annotations.filter(annotation => annotation.created > this.arrFilter[i]['rangebegin'] && annotation.created <= this.arrFilter[i]['rangeend']))
        }
      },
      appendRandomAnnotations () { // dev only
        let i = 0
        let dur = ''
        for (i = 0; i < this.numberRandomAnnotations; i++) {
          if (i >= 0 && i <= 10) {
            dur = 40
          }
          else {
            dur = 1
          }
          this.annotations.push({referencetime: Math.floor(Math.random() * this.svgHeight), duration: dur, created: i, text: 'Hier steht der Text. (' + i + ')'})
        }
      },
      getAnnotationSessionWidth () {
        this.annotationSessionWidth = 50
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
      divideInBlocks (arr) { // in development
        var byReferencetime = arr.slice(0)
        byReferencetime.sort(function (a, b) {
          return a.byReferencetime - b.byReferencetime
        })
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

  .mobafill {
    fill: rgba( 255, 0, 0, 1 );
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
