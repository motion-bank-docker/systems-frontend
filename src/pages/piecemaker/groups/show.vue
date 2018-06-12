<template lang="pug">

  card-full

    q-modal(v-model="showModal")
      .q-pa-xl.bg-dark(style="min-width: 66vw;")
        //
          q-modal-layout()
            div(slot="header")
              | Header
            div(slot="footer")
              | Footer
        SessionDiagram()

    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.groups.show.title') }}
    // span(slot="form-caption") {{ $t('routes.piecemaker.groups.show.caption') }}

    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.groups.list' })", icon="keyboard_backspace", round, small)

    span(slot="form-logo")
    // span(slot="form-title") {{ $t('routes.piecemaker.videos.list.title') }}
    // span(slot="form-title")
      .text-grey-6 Session

    .text-right
      q-btn(
      @click="$router.push({ name: 'piecemaker.groups.annotate' })",
      ) Live Annotate

    div.q-mt-md
      .q-mt-xl(v-for="(y, iy) in arrTimelineDataDummy")
        .q-mt-sm(v-for="(m, im) in y.months")
          div(v-for="(d, id) in m.days")
            .row(v-for="(e, ie) in d.entries")
              .col-1.q-pt-xs.moba-border-top(:class="{invisible: im > 0}") {{ y.year }}
              .col-1.q-pt-xs.moba-border-top.text-grey-9(:class="[{invisible: id > 0}, {invisible: ie > 0}]") {{ m.month }}
              .col-1.q-pt-xs.moba-border-top.text-grey-9(:class="{invisible: ie > 0}") {{ d.date }}
              .col-9.q-pt-xs.moba-border-top.row
                .col-1 {{ e.start }}
                .col-1 {{ e.end }}
                .col-6
                .col-4.text-right
                  q-btn.q-mr-sm.q-mt-xs(@click="activeDiagram = e.id", size="sm", no-caps) show diagram
                  q-btn.no-margin.q-mt-xs(size="sm", no-caps) jump
              div.full-width.q-pa-md(v-if="e.id == activeDiagram", style="height: 66vh; overflow: hidden;")
                SessionDiagram(:data="annotations")

    //
      div(v-for="(y, iy) in arrTimelineDataDummy")
        h5.no-padding.q-mb-xs {{ y.year }}
        .row.q-mb-md(v-for="(m, im) in y.months")
          .col-1.q-py-xs.moba-border-top
            div {{ m.month }}
          .col-11
            .row(v-for="(d, id) in m.days")
              .col-1
                .q-py-xs.moba-border-top
                  div {{ d.date }}
                    q-tooltip.bg-black.q-caption {{ y.year }} {{ m.month }} {{ d.date }}
                    span(style="font-size: .66rem; vertical-align: top;") th
              q-list.col-11.no-border.no-padding
                q-item.q-py-xs.q-pb-md.moba-border-top.cursor-pointer(
                v-for="(h, ih) in d.entries",
                style="font-size: inherit; min-height: 10px; padding-left: 0; padding-top: 0; margin-top: 0;",
                multiline
                )
                  q-item-side.q-pt-xs
                    a(@click="showModal = true") {{ h.start }}
                  q-item-side.q-pt-xs
                    a(@click="showModal = true") {{ h.end }}
                  q-item-main
                    q-btn.q-mr-sm.q-mt-xs(@click="activeDiagram = h.id", size="sm", no-caps) show diagram
                    q-btn.no-margin.q-mt-xs(size="sm", no-caps) jump
                    template(v-if="h.id == activeDiagram")
                      div(style="height: 66vh; overflow: hidden;")
                        SessionDiagram(:data="annotations")
                //
                  q-item-side
                    q-btn.no-margin(@click="showModal = true", size="sm", flat) show diagram
                    q-btn.no-margin(size="sm", flat) jump

    // SessionDiagram(:data="annotations")

</template>

<script>
  import CardFull from '../../../components/shared/layouts/CardFull'
  import SessionDiagram from '../../../components/piecemaker/partials/SessionDiagram'
  import { QList, QItem, QItemMain, QItemSide, QItemTile, QModal, QTooltip, QModalLayout } from 'quasar'

  export default {
    components: {
      CardFull,
      SessionDiagram,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemTile,
      QModal,
      QTooltip,
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
