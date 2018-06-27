<template lang="pug">

  full-screen

    // detect window dimensions
    // (necessary, do not delete)
    //
    q-window-resize-observable(@resize="onResize")

    .row
      .col-8(slot="form-title")
        | {{ $t('routes.piecemaker.groups.show.title') }}
      .col-4.text-right
        q-btn(
        @click="$router.push({ name: 'piecemaker.groups.annotate' })",
        ) Live Annotate
    span(slot="form-logo")

    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.groups.list' })", icon="keyboard_backspace", round, small)

    // timeline diagramm
    //
    .row
      svg(
      width="100%",
      :height="viewportHeight / 3",
      style="top: 80px; right: 30px;"
      )
        // path(d="M0 0 C 100 0, 10 200, 0 80", stroke="white", fill="transparent")
        // path(d="M0,0 C10,100 40,10 40,25 S40,40 25,25", stroke="white", fill="transparent")
        path(d="M10 80 Q 52.5 10, 95 80 T 180 80, 100 Q 120 10", stroke="white", fill="transparent")

        // line bottom
        // (x-axis)
        //
        line(
        x1="0", y1="100%",
        x2="100%", y2="100%",
        style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;"
        )

        // years
        //
        svg(
        v-for="(y, iy) in arrTimelineDataDummy",
        :width="(viewportWidth - 96) / arrTimelineDataDummy.length",
        :x="((viewportWidth - 96) / arrTimelineDataDummy.length) * iy"
        )

          // years:
          // separators
          //
          line(
          :x1="(viewportWidth - 96) / 3", y1="80%",
          :x2="(viewportWidth - 96) / 3", y2="100%",
          style="stroke: rgba(255, 255, 255, .1); stroke-width: 1;"
          )

          // months
          //
          svg(
          v-for="(m, im) in y.months",
          :x="((viewportWidth - 96) / arrTimelineDataDummy.length / 12) * (m.month - 1)",
          :width="(viewportWidth - 96) / arrTimelineDataDummy.length / 12",
          height="100%"
          )
            rect(
            :height="10 * m.days.length",
            :y="(viewportHeight / 3) - (10 * m.days.length)",
            width="100%",
            style="fill: rgba(255, 255, 255, .1)!important;"
            )

    // wrap - recording sessions
    //
    .row.q-mt-xl
      .col-10.offset-1
        div Recording Session
      .col-10.offset-1
        SessionDiagram(:data="annotations", :meta="e")

</template>

<script>
  // import CardFull from '../../../components/shared/layouts/CardFull'
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import SessionDiagram from '../../../components/piecemaker/partials/SessionDiagram'
  import { QWindowResizeObservable, QList, QItem, QItemMain, QItemSide, QItemTile, QModal, QTooltip, QPopover, QModalLayout } from 'quasar'

  export default {
    components: {
      // CardFull,
      QWindowResizeObservable,
      FullScreen,
      SessionDiagram,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemTile,
      QModal,
      QTooltip,
      QPopover,
      QModalLayout
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
        for (i = 0; i < this.numberRandomAnnotations; i++) {
          this.annotations.push({referencetime: Math.floor(Math.random() * this.svgHeight), created: i, text: 'Hier steht der Text. (' + i + ')'})
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
      },
      onResize (size) {
        this.viewportHeight = size.height
        this.viewportWidth = size.width
      }
    },
    data () {
      const _this = this
      return {
        map: undefined,
        activeDiagram: '',
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
            month: '1',
            days: [{
              date: '4',
              entries: [{
                end: '22.12',
                id: '1',
                start: '12',
                title: 'Titel abc'
              }]
            }]
          }, {
            month: '3',
            days: [{
              date: '15',
              entries: [{
                end: '22.12',
                id: '2',
                start: '8:24',
                title: 'aaaa'
              }]
            }]
          }, {
            month: '10',
            days: [{
              date: '18',
              entries: [{
                end: '22.12',
                id: '3',
                start: '7',
                title: 'Titel abc'
              }]
            }, {
              date: '21',
              entries: [{
                end: '22.12',
                id: '4',
                start: '7.30',
                title: 'Titel abc'
              }, {
                end: '22.12',
                id: '5',
                start: '14.45',
                title: 'Titel abc'
              }]
            }, {
              date: '26',
              entries: [{
                end: '22.12',
                id: '6',
                start: '5',
                title: 'Titel abc'
              }]
            }]
          }, {
            month: '11',
            days: [{
              date: '2',
              entries: [{
                end: '22.12',
                id: '7',
                start: '8:50',
                title: 'vdvdscdscd Titel abc'
              }]
            }, {
              date: '4',
              entries: [{
                end: '22.12',
                id: '8',
                start: '8:43',
                title: 'kgnvadvdscvads'
              }]
            }]
          }]
        }, {
          year: '2016',
          months: [{
            month: '6',
            days: [{
              date: '2',
              entries: [{
                end: '23.00',
                id: 'dedasca',
                start: '19.12',
                title: 'hallo'
              }]
            }, {
              date: '9',
              entries: [{
                end: '23.00',
                id: '9',
                start: '19.12',
                title: 'hallo'
              }]
            }, {
              date: '10',
              entries: [{
                end: '23.00',
                id: '9vvdscasdc',
                start: '19.12',
                title: 'hallo'
              }]
            }, {
              date: '15',
              entries: [{
                end: '23.00',
                id: 'lvdsvsdc',
                start: '19.12',
                title: 'hallo'
              }]
            }]
          }, {
            month: '7',
            days: [{
              date: '14',
              entries: [{
                end: '23.00',
                id: '10',
                start: '11:00',
                title: 'vormittags'
              }, {
                end: '12.00',
                id: '11',
                start: '9:00',
                title: 'blablabla'
              }]
            }]
          }]
        }, {
          year: '2015',
          months: [{
            month: '6',
            days: [{
              date: '9',
              entries: [{
                end: '23.00',
                id: '12',
                start: '19.12',
                title: 'hallo'
              }]
            }]
          }, {
            month: '7',
            days: [{
              date: '14',
              entries: [{
                end: '23.00',
                id: '13',
                start: '11:00',
                title: 'vormittags'
              }, {
                end: '23.00',
                id: '14',
                start: '18:19',
                title: 'blablabla'
              }]
            }]
          }, {
            month: '9',
            days: [{
              date: '9',
              entries: [{
                end: '23.00',
                id: '15',
                start: '19.12',
                title: 'hallo'
              }]
            }]
          }, {
            month: '12',
            days: [{
              date: '14',
              entries: [{
                end: '11.00',
                id: '16',
                start: '11:00',
                title: 'vormittags'
              }, {
                end: '12.00',
                id: '17',
                start: '18:19',
                title: 'blablabla'
              }, {
                end: '13.00',
                id: '18',
                start: '11:00',
                title: 'vormittags'
              }, {
                end: '14.00',
                id: '19',
                start: '18:19',
                title: 'blablabla'
              }]
            }]
          }]
        }],
        byReferencetime: [],
        filteredAnnotations: [],
        hoverVal: '',
        // maps: [],
        numberRandomAnnotations: 200, // dev only
        prevCreated: '100',
        previewLine: {
          visibility: false,
          positionY: ''
        },
        svgHeight: '100',
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
  .moba-active {
    background-color: rgba( 0, 0, 0, .1 );
  }
  .moba-border-top {
  border-top: 1px solid rgba( 255, 255, 255, .2 );
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
