<template lang="pug">
  card-full
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.groups.list' })", icon="keyboard_backspace", round, small)
    span(slot="form-logo")
    // span(slot="form-title") {{ $t('routes.piecemaker.videos.list.title') }}
    span(slot="form-title")
      .text-grey-6 Session

    //
    // timeline test
    //
    div

      //
      // dev info window
      //
      .fixed(
        v-model="previewLine",
        v-if="previewLine.visibility",
        style="top: 50px; left: 0;"
        ) {{ previewLine.positionY }}

      //
      // Sessions
      //
      div

        //
        // info
        //
        .row.q-mb-sm.text-grey-5

          //
          // titel
          // calender
          //
          .col-6
            div.q-mb-sm Titel: Session von dann und dann
            div
              q-btn(
                icon="arrow_left"
                size="sm",
                flat, round
                )
              q-btn.q-mx-xs(
                label="27.7.2016",
                size="sm"
                )
              q-btn(
                icon="arrow_right"
                size="sm",
                flat, round
                )

          //
          // development information
          //
          .col-6.text-right
            span(v-model="numberRandomAnnotations") randomly added annotations: {{ numberRandomAnnotations }}
            br
            span(v-model="annotations") inlcuding hard coded annotations: {{ annotations.length }}

        //
        // diagramm wrap
        //
        .row.col-12(
          style="border-top: 1px solid #333;"
          )

          //
          // svg wrap
          //
          svg.col-6(
            v-model="svgHeight",
            :height="svgHeight"
            )

            //
            // videos - swimlanes
            //
            svg(
              x="15"
              )
              rect.moba-swimlane(
                v-for="(video, i) in videos",
                width="30",
                :height="video.duration",
                :x="(30 + 10) * i",
                :y="video.referencetime"
                )

            //
            // annotations - dots
            // ALL
            //
            svg(
              v-for="n in arrFilter",
              x="200"
              )

              line(
                x1="3",
                y1="0",
                x2="3",
                y2="100%",
                style="stroke: rgba(255,255,255,.1); stroke-width: 1;"
                )

              g(
                v-for="annotation in filteredAnnotations",
                :y="annotation.referencetime"
                )

                circle.moba-svg-entry.moba-hover-test(
                  @mouseenter="hoverVal = annotation.referencetime, previewLine.positionY = annotation.referencetime, previewLine.visibility = true",
                  @mouseleave="hoverVal = '', previewLine.visibility = false",
                  r="3",
                  cx="3",
                  :cy="annotation.referencetime"
                  style="fill: rgb(255,255,255);"
                  )

            //
            // annotations - dots
            //
            svg(
              v-for="(n, i) in arrFilter.length",
              :x="230 + (30 * i)"
              )

              line(
                x1="3",
                y1="0",
                x2="3",
                y2="100%",
                style="stroke: rgba(255,255,255,.1); stroke-width: 1;"
                )

              circle.moba-svg-entry(
                v-for="annotation in filteredAnnotations",
                r="3",
                cx="3",
                :cy="annotation.referencetime"
                style="fill: rgb(255,255,255);"
                )

              g(
                v-for="annotation in filteredAnnotations",
                :y="annotation.referencetime"
                )

                circle.moba-svg-entry.moba-hover-test(
                  r="3",
                  cx="3",
                  :cy="annotation.referencetime"
                  style="fill: rgb(255,255,255);"
                  )

                text.text-grey-7(
                  x="30",
                  :y="annotation.referencetime + 3",
                  font-size="15",
                  fill="#666"
                  )
                  | {{ annotation.text }}

            //
            // annotations - lines
            //
            svg
              rect.moba-svg-entry(
                v-for="annotation in filteredAnnotations",
                width="180",
                height="1",
                :y="annotation.referencetime"
                style="fill: rgba(255,255,255, .4)!important;"
                )

              rect(
                v-if="previewLine.visibility",
                width="180",
                height="1",
                :y="previewLine.positionY"
                style="fill: rgba(255,0,0, 1)!important;"
                )

          //
          // auswahl
          //
          q-list.col-6.no-border.no-padding(
            style="width: 20vw; min-height: 10vh; display: inline-block;"
            )
            .q-item.text-grey-6
              | Zeitraum
            // .q-item.text-grey-6
              div() {{ arrFilter }}
            .q-item
              // q-checkbox(@click="selectAllCheckboxes()", color="white")
              q-btn.q-mx-sm.q-mb-md(
                @click="filterAnnotations(0, 100000000)",
                label="all",
                no-ripple, no-caps
                )
            .q-item
              // q-checkbox(v-model="arrFilter", val="1", color="white")
              q-btn.q-mx-sm(
                @click="filterAnnotations(0, 20)",
                label="Annotation Session 1",
                no-ripple, flat, no-caps
                )
              span.text-grey-8 (0-20)
            .q-item
              // q-checkbox(v-model="arrFilter", val="2", color="white")
              q-btn.q-mx-sm(
                @click="filterAnnotations(21, 50)",
                label="Annotation Session 2",
                no-ripple, flat, no-caps
                )
              span.text-grey-8 (21-50)
            .q-item
              // q-checkbox(v-model="arrFilter", val="3", color="white")
              q-btn.q-mx-sm(
                @click="filterAnnotations(80, 120)",
                label="Annotation Session 3",
                no-ripple, flat, no-caps
                )
              span.text-grey-8 (80-120)

</template>

<script>
  import DataTable from '../../../components/shared/partials/DataTable'
  import CardFull from '../../../components/shared/layouts/CardFull'
  import { QCollapsible, QList, QItem, QItemSide, QItemMain, QTooltip, QBtn, QCheckbox } from 'quasar'

  export default {
    components: {
      DataTable,
      CardFull,
      QCollapsible,
      QList,
      QItem,
      QItemSide,
      QItemMain,
      QTooltip,
      QBtn,
      QCheckbox
    },
    mounted () {
      this.getSvgHeight(this.videos)
      this.divideInBlocks(this.annotations)
      this.appendRandomAnnotations()
      this.filterAnnotations(0, 100000000)
    },
    methods: {
      selectAllCheckboxes () {
        console.log('geht check')
      },
      filterAnnotations (valFrom, valTo) {
        this.filteredAnnotations = this.annotations.filter(annotation => annotation.created > valFrom && annotation.created <= valTo)
        // console.log(result)
      },
      appendRandomAnnotations () {
        let i = 0
        let arrAnnotations = this.annotations
        for (i = 0; i < this.numberRandomAnnotations; i++) {
          arrAnnotations.push({referencetime: Math.floor(Math.random() * this.svgHeight), created: i, text: 'Hier steht der Text. (' + i + ')'})
        }
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
        console.log(newArr)

        this.svgHeight = newArr[arrLength - 1]
      },
      divideInBlocks (arr) {
        var byReferencetime = arr.slice(0)
        byReferencetime.sort(function (a, b) {
          return a.byReferencetime - b.byReferencetime
        })
        console.log(byReferencetime)
        console.log(arr)
      },
      setPrevCreated (val, valPrev) {
        console.log(val)
        console.log(valPrev)
        this.prevCreated = parseInt(val) + parseInt(50)
      },
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'annotate':
          return _this.$router.push(`/piecemaker/videos/${data.row.uuid}/annotate`)
        }
      }
    },
    data () {
      const _this = this
      return {
        arrFilter: [{
          rangebegin: 0,
          rangeend: 30
        }, {
          rangebegin: 40,
          rangeend: 120
        }],
        byReferencetime: [],
        filteredAnnotations: [],
        hoverVal: '',
        // maps: [],
        numberRandomAnnotations: 200,
        prevCreated: '100',
        previewLine: {
          visibility: false,
          positionY: ''
        },
        svgHeight: '100',
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
        videos: [{
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
          duration: '1282',
          id: '',
          referencetime: '12',
          title: 'video 1'
        }],
        annotations: [{
          created: '1',
          id: '',
          referencetime: '110',
          text: 'blablabla'
        }, {
          created: '2',
          id: '',
          referencetime: '111',
          text: 'blablabla'
        }, {
          created: '24',
          id: '',
          referencetime: '321',
          text: 'blablabla'
        }, {
          created: '10',
          id: '',
          referencetime: '130',
          text: 'lnkjlfvsdvdsa'
        }, {
          created: '18',
          id: '',
          referencetime: '30',
          text: 'fgbd'
        }, {
          created: '22',
          id: '',
          referencetime: '150',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '34',
          id: '',
          referencetime: '1000',
          text: 'qwekbö vfbsöfdbjdföb jvfödjsölvsfn vdsfv'
        }, {
          created: '200',
          id: '',
          referencetime: '203',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '201',
          id: '',
          referencetime: '500',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '207',
          id: '',
          referencetime: '130',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '210',
          id: '',
          referencetime: '111',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '410',
          id: '',
          referencetime: '110',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '440',
          id: '',
          referencetime: '220',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '450',
          id: '',
          referencetime: '182',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '458',
          id: '',
          referencetime: '120',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '460',
          id: '',
          referencetime: '191',
          text: 'öoij adfdsv bfdsvdf'
        }, {
          created: '800',
          id: '',
          referencetime: '500',
          text: 'öoij adfdsv bfdsvdf'
        }]
      }
    }
  }
</script>

<style>
/*
  .moba-calender-item {
    opacity: .2;
  }

  .moba-calender-item:hover {
    opacity: 1;
  }
*/
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

  text {
    opacity: 0;
    transition: opacity ease 50ms;
  }

  circle:hover + text {
    opacity: 1!important;
  }
</style>
