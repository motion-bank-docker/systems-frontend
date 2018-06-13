<template lang="pug">

  // card-full
  full-screen
    q-modal(v-model="showModal")
      .q-pa-xl.bg-dark(style="min-width: 66vw;")
        //
          q-modal-layout()
            div(slot="header")
              | Header
            div(slot="footer")
              | Footer
        SessionDiagram()

    .row
      // div(v-for="(v, vi) in videos")
        | {{ Object.keys(v)[vi - 1] }}
      .col-6(slot="form-title") {{ $t('routes.piecemaker.groups.show.title') }}
      // span(slot="form-caption") {{ $t('routes.piecemaker.groups.show.caption') }}
      .col-6.text-right
        q-btn(
        @click="$router.push({ name: 'piecemaker.groups.annotate' })",
        ) Live Annotate
    span(slot="form-logo")

    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.groups.list' })", icon="keyboard_backspace", round, small)

    div.q-mt-md
      .q-mt-xl(v-for="(y, iy) in arrTimelineDataDummy")
        h5.text-weight-light
          | {{ y.year }}
          span.text-grey-8.q-ml-md Recordingsessions
        div(v-for="(m, im) in y.months")
          div(v-for="(d, id) in m.days")
            div.moba-border-top(v-for="(e, ie) in d.entries")

              .row.q-py-sm
                .col-1.q-pl-sm(:class="[{'text-grey-8': id > 0}, {'text-grey-8': ie > 0}]") {{ m.month }}
                .col-1(:class="{'text-grey-8': ie > 0}") {{ d.date }}
                .col-10.row
                  .col-8.row.cursor-pointer(@click="activeDiagram = e.id")
                    .col-2 {{ e.start }} – {{ e.end }}
                    .col-2
                      // q-btn.no-margin(size="sm", no-caps) jump
                    .col-8
                  .col-4.text-right
                    // q-btn.q-mr-sm(@click="activeDiagram = e.id", size="sm", no-caps) show details

                    // div(v-if="e.id !== activeDiagram")
                      q-btn.no-margin(size="sm", no-caps) jump

                    div(v-if="e.id == activeDiagram")
                      q-btn.q-mr-sm.cursor-pointer(size="sm", round) ?
                        q-tooltip.q-caption.bg-black This is a recording session, it's part of a timeline.
                      q-btn(@click="activeDiagram = ''", icon='clear', size="sm", no-caps, round)

              template(v-if="e.id == activeDiagram")
                .full-width.q-px-xl.q-py-lg.q-pt-none.q-mb-lg
                  //.moba-active

                  .row.q-mb-lg.q-pb-sm
                    // .col-8
                      | {{ y.year }} {{ m.month }} {{ d.date }}
                      //
                        q-btn(size="sm", no-caps) prev
                        q-btn(size="sm", no-caps) next
                    // .col-4.text-right
                  //
                    .col-12.text-right
                      q-btn.q-mr-sm.cursor-pointer(size="sm", round) ?
                        q-tooltip.q-caption.bg-black This is a recording session, it's part of a timeline.
                      q-btn(@click="activeDiagram = ''", icon='clear', size="sm", no-caps, round)

                  SessionDiagram(:data="annotations", :meta="e")
            // .moba-border-top(v-if="ei <= d.entries.length")

</template>

<script>
  // import CardFull from '../../../components/shared/layouts/CardFull'
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import SessionDiagram from '../../../components/piecemaker/partials/SessionDiagram'
  import { QList, QItem, QItemMain, QItemSide, QItemTile, QModal, QTooltip, QPopover, QModalLayout } from 'quasar'

  export default {
    components: {
      // CardFull,
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
      }
    },
    data () {
      const _this = this
      return {
        showModal: false,
        hallo: 'abc',
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
            month: 'January',
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
            month: 'March',
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
            month: 'October',
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
            month: 'November',
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
            month: 'June',
            days: [{
              date: '9',
              entries: [{
                end: '23.00',
                id: '9',
                start: '19.12',
                title: 'hallo'
              }]
            }]
          }, {
            month: 'July',
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
            month: 'June',
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
            month: 'July',
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
            month: 'September',
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
            month: 'December',
            days: [{
              date: '14',
              entries: [{
                end: '23.00',
                id: '16',
                start: '11:00',
                title: 'vormittags'
              }, {
                end: '23.00',
                id: '17',
                start: '18:19',
                title: 'blablabla'
              }, {
                end: '23.00',
                id: '18',
                start: '11:00',
                title: 'vormittags'
              }, {
                end: '23.00',
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
