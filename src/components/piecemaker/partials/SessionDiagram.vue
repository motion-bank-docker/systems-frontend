<template lang="pug">

    div

      //
      // info window – dev only
      //
      .fixed(
      v-model="previewLine",
      v-if="previewLine.visibility",
      style="top: 50px; left: 0;"
      ) {{ previewLine.positionY }}

      //
      // sessions – wrap
      //
      div

        //
        // top area
        //
        .row.q-mb-sm.text-grey-5

          //
          // title
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
          // information – dev only
          //
          .col-6.text-right
            span(v-model="numberRandomAnnotations") randomly added annotations: {{ numberRandomAnnotations }}
            // br
              span(v-model="annotations") inlcuding hard coded annotations: {{ annotations.length }}

        //
        // diagramm wrap
        //
        .row.col-12(
        style="border-top: 1px solid #333; border-bottom: 1px solid #333;"
        )

          //
          // svg wrap
          //
          svg.col-6(
          v-model="svgHeight",
          :height="svgHeight"
          )
            //
            // swimlanes – wrap
            //
            svg
              //
              // vertical lines
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
              // horizontal lines
              //
              g
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
            // dots – ALL
            //
            svg(
            x="200"
            )
              line(
              x1="3",
              y1="0",
              x2="3",
              y2="100%",
              style="stroke: rgba(255,255,255,.1); stroke-width: 1;"
              )
              g
                circle.moba-svg-entry.moba-hover-test(
                v-for="annotation in annotations",
                @mouseenter="hoverVal = annotation.referencetime, previewLine.positionY = annotation.referencetime, previewLine.visibility = true",
                @mouseleave="hoverVal = '', previewLine.visibility = false",
                r="3",
                cx="3",
                :cy="annotation.referencetime",
                style="fill: rgb(255,255,255);"
                )

            //
            // dots – FILTERED
            //
            svg(
            v-for="(n, i) in arrFilter",
            :x="250 + ((30 + 10) * i)"
            )
              rect(
              width="30",
              height="100%",
              fill="rgba(255, 255, 255, .025)"
              )
              line(
              x1="15",
              y1="0",
              x2="15",
              y2="100%",
              style="stroke: rgba(255,255,255,.1); stroke-width: 1;"
              )
              g
                circle.moba-svg-entry.moba-hover-test(
                v-for="annotation in annotationsBlocks[i]",
                @mouseenter="hoverVal = annotation.referencetime, previewLine.positionY = annotation.referencetime, previewLine.visibility = true",
                @mouseleave="hoverVal = '', previewLine.visibility = false",
                r="3",
                cx="15",
                :cy="annotation.referencetime"
                style="fill: rgb(255,255,255);"
                )

          //
          // auswahl – wrap
          //
          q-list.col-6.no-border.no-padding(
          style="width: 20vw; min-height: 10vh; display: inline-block;"
          )
            .q-item.text-grey-6
              | Annotation sessions
            //
            // select – ALL
            //
            .q-item
              q-btn.q-mx-sm.q-mb-md(
              @click="filterAnnotations(0, 100000000)",
              label="all",
              no-ripple, no-caps
              )
            //
            // select – FILTERED
            //
            .q-item.text-grey-6(
            v-for="(n, i) in arrFilter"
            )
              q-btn.q-mx-sm.q-mb-md(
              @click="filterAnnotations(arrFilter[i].rangebegin, arrFilter[i].rangeend)",
              no-ripple, no-caps
              ) {{ arrFilter[i].rangebegin }} – {{ arrFilter[i].rangeend }}
</template>

<script>
  import { QList, QItem, QItemMain, QItemSide } from 'quasar'

  export default {
    components: {
      QList,
      QItem,
      QItemMain,
      QItemSide
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
    },
    methods: {
      filterAnnotations (valFrom, valTo) {
        this.filteredAnnotations = this.annotations.filter(annotation => annotation.created > valFrom && annotation.created <= valTo)
        // console.log(this.filteredAnnotations)
        // console.log(this.arrFilter)
        let i = 0
        for (i = 0; i < this.arrFilter.length; i++) {
          this.annotationsBlocks.push(this.annotations.filter(annotation => annotation.created > this.arrFilter[i]['rangebegin'] && annotation.created <= this.arrFilter[i]['rangeend']))
        }
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
        // console.log(newArr)
        this.svgHeight = newArr[arrLength - 1]
      },
      divideInBlocks (arr) {
        // let ab = this.annotationsBlocks
        // console.log(ab)
        var byReferencetime = arr.slice(0)
        byReferencetime.sort(function (a, b) {
          return a.byReferencetime - b.byReferencetime
        })
        // console.log(byReferencetime)
        // console.log(arr)
      },
      setPrevCreated (val, valPrev) {
        // console.log(val)
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
        map: undefined,
        annotations: [],
        annotationsBlocks: [],
        arrFilter: [{ // dev only
          rangebegin: 0,
          rangeend: 30
        }, {
          rangebegin: 31,
          rangeend: 120
        }, {
          rangebegin: 121,
          rangeend: 150
        }, {
          rangebegin: 151,
          rangeend: 200
        }],
        arrTimelineDataDummy: [{ // dev only
          year: 2018,
          months: [{
            month: 'January',
            days: [{
              date: '4',
              entries: [{
                time: '12',
                title: 'Titel abc'
              }]
            }]
          }, {
            month: 'March',
            days: [{
              date: '15',
              entries: [{
                time: '8:24',
                title: 'aaaa'
              }]
            }]
          }, {
            month: 'October',
            days: [{
              date: '18',
              entries: [{
                time: '7',
                title: 'Titel abc'
              }]
            }, {
              date: '21',
              entries: [{
                time: '7.30',
                title: 'Titel abc'
              }, {
                time: '14.45',
                title: 'Titel abc'
              }]
            }, {
              date: '26',
              entries: [{
                time: '5',
                title: 'Titel abc'
              }]
            }]
          }, {
            month: 'November',
            days: [{
              date: '2',
              entries: [{
                time: '8:50',
                title: 'vdvdscdscd Titel abc'
              }]
            }, {
              date: '4',
              entries: [{
                time: '8:43',
                title: 'kgnvadvdscvads'
              }]
            }]
          }]
        }, {
          year: '2016',
          months: [{
            month: 'June',
            days: [{
              date: '9',
              entries: [{
                time: '19.12',
                title: 'hallo'
              }]
            }]
          }, {
            month: 'July',
            days: [{
              date: '14',
              entries: [{
                time: '11:00',
                title: 'vormittags'
              }, {
                time: '18:19',
                title: 'blablabla'
              }]
            }]
          }]
        }, {
          year: '2015',
          months: [{
            month: 'June',
            days: [{
              date: '9',
              entries: [{
                time: '19.12',
                title: 'hallo'
              }]
            }]
          }, {
            month: 'July',
            days: [{
              date: '14',
              entries: [{
                time: '11:00',
                title: 'vormittags'
              }, {
                time: '18:19',
                title: 'blablabla'
              }]
            }]
          }, {
            month: 'September',
            days: [{
              date: '9',
              entries: [{
                time: '19.12',
                title: 'hallo'
              }]
            }]
          }, {
            month: 'December',
            days: [{
              date: '14',
              entries: [{
                time: '11:00',
                title: 'vormittags'
              }, {
                time: '18:19',
                title: 'blablabla'
              }, {
                time: '11:00',
                title: 'vormittags'
              }, {
                time: '18:19',
                title: 'blablabla'
              }]
            }]
          }]
        }],
        byReferencetime: [],
        filteredAnnotations: [],
        hoverVal: '',
        numberRandomAnnotations: 200, // dev only
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
          duration: '1282',
          id: '',
          referencetime: '12',
          title: 'video 1'
        }]
      }
    }
  }
</script>

<style>
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
