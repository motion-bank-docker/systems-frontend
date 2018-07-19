<template lang="pug">

  full-screen
    // detect window dimensions
    // (necessary, do not delete)
    //
    q-window-resize-observable(@resize="onWindowResize")

    // filter
    //
      q-layout-drawer(v-model="openDiagram", side="right", overlay)
        div diagram

    // filter
    //
    // q-layout-drawer(v-model="openFilter", side="right", overlay)
      // div.bg-dark.q-pa-md.q-caption(:class="{ 'text-grey-8': radioFilter == 'allsessions' || radioFilter == 'thissession' }")
      div.bg-dark.q-pa-md.q-caption(style="min-height: 100%;")
        .row.q-mb-md
          .col-10.bg-grey-10.q-pa-sm
            // q-radio.q-mb-md(v-model="radioFilter", val="allsessions", label="Apply on all sessions in this timeline.", color="white")
            q-radio.q-mb-md(v-model="radioFilter", val="thissession", label="Apply filter.", color="white")
            br
            q-radio(v-model="radioFilter", val="none", label="Do not apply.", color="white")
          .col-2.text-right
            q-btn.rotate-180(@click="openFilter = false", icon="keyboard_backspace", size="sm", round, flat)

        div(:class="{ 'text-grey-8': radioFilter == 'none' }")
          q-tabs(color="dark")
            q-tab(slot="title", name="authors") authors
            q-tab(slot="title", name="types") types
            q-tab(slot="title", name="date") date
            q-tab(slot="title", name="search") search

            q-tab-pane(name="authors")
              q-list.no-border
                q-item.no-padding
                  q-btn(size="sm") select all
                  q-btn(size="sm") select none
                q-item.no-padding(v-for="author in authors")
                  q-checkbox.q-caption(v-model="filterAuthors", :val="author", :label="author", color="white")

            q-tab-pane(name="types")
              q-list.no-border
                q-item.no-padding
                  q-btn(size="sm") select all
                  q-btn(size="sm") select none
                q-item.no-padding(v-for="type in annotationTypes")
                  q-checkbox.q-caption(v-model="filterTypes", :val="type", :label="type", color="white")

            q-tab-pane(name="date")
              div creation

            q-tab-pane(name="search")
              q-search.bg-transparent.text-white(color="white", dark)

    // headline
    //
    .row.q-mb-xl
      .col-10.offset-1(slot="form-title")
        // div {{ $t('routes.piecemaker.groups.show.title') }}: Titel der Timeline
        h5.no-margin.text-center
          div Meine Timeline seit Studienbeginn (Titel)
          .text-grey-8 by Vorname Nachname (Inhaber)

    // hide logo
    //
    span(slot="form-logo")

    // btn: back
    //
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.groups.list' })", icon="keyboard_backspace", round, small)

    // btn: filter
    //
    q-btn.fixed.text-white(@click="openFilter = true", :class="{ 'bg-green': radioFilter == 'allsessions' || radioFilter == 'thissession' }", style="top: 66px; right: 16px; z-index: 1000;")
      //
        q-icon(v-if="radioFilter == 'allsessions' || radioFilter == 'thissession'", name="visibility")
        q-icon(v-else, name="visibility_off")
        span.q-ml-md Filter
      | Filter

      // FILTER
      //
      q-popover.bg-transparent.moba-round-borders-filter.moba-border.shadow-8(v-model="openFilter", anchor="top left", self="top right", :offset="[10,0]")
        div.bg-dark.q-pa-md.q-caption(style="min-height: 100%;")
          .row.q-mb-md
            .col-10.q-pa-sm
              q-radio.q-mr-lg(v-model="radioFilter", val="thissession", label="Apply filter.", color="white")
              q-radio(v-model="radioFilter", val="none", label="Do not apply.", color="white")
            // .col-2.text-right
              q-btn.rotate-180(@click="openFilter = false", icon="keyboard_backspace", size="sm", round, flat)

          div(:class="{'text-grey-8': radioFilter == 'none'}")
            q-tabs(color="dark")
              q-tab(:class="{'bg-green': filterAuthors.length > 0}", slot="title", name="authors") authors
                q-tooltip.bg-dark.shadow-8.moba-border(v-if="filterAuthors.length > 0", anchor="bottom middle", self="top middle", :offset="[10, 0]")
                  q-list.no-border.no-padding
                    q-item.q-caption.q-pa-xs.no-margin(v-for="author in filterAuthors") {{ author }}

              q-tab(:class="{'bg-green': filterTags.length > 0}", slot="title", name="tags") tags
                q-tooltip.bg-dark.shadow-8.moba-border(v-if="filterTags.length > 0", anchor="bottom middle", self="top middle", :offset="[10, 0]")
                  q-list.no-border.no-padding
                    q-item.q-caption.q-pa-xs.no-margin(v-for="tag in filterTags") {{ tag }}

              q-tab(:class="{'bg-green': filterTypes.length > 0}", slot="title", name="types") types
                q-tooltip.bg-dark.shadow-8.moba-border(v-if="filterTypes.length > 0", anchor="bottom middle", self="top middle", :offset="[10, 0]")
                  q-list.no-border.no-padding
                    q-item.q-caption.q-pa-xs.no-margin(v-for="type in filterTypes") {{ type }}

              q-tab(slot="title", name="date") date
              q-tab(slot="title", name="search") search

              q-tab-pane(name="authors")
                q-btn-group.row.full-width
                  q-btn.col-6 select all
                  q-btn.col-6(@click="filterAuthors = ['']") select none
                q-list.no-border
                  q-item.no-padding(v-for="author in authors")
                    q-checkbox.q-caption(v-model="filterAuthors", :val="author", :label="author", color="white")

              q-tab-pane(name="tags")
                q-btn-group.row.full-width
                  q-btn.col-6 select all
                  q-btn.col-6(@click="filterTags = ['']") select none
                q-list.no-border
                  q-checkbox.q-caption(v-model="filterTags", :val="tag", label="annotation tag", color="white")
                  // q-item.no-padding(v-for="author in authors")
                    q-checkbox.q-caption(v-model="filterAuthors", :val="author", :label="author", color="white")

              q-tab-pane(name="types")
                q-btn-group.row.full-width
                  q-btn.col-6 select all
                  q-btn.col-6(@click="filterTypes = ['']") select none
                q-list.no-border
                  q-item.no-padding(v-for="type in annotationTypes")
                    q-checkbox.q-caption(v-model="filterTypes", :val="type", :label="type", color="white")

              q-tab-pane(name="date")
                q-range.q-mt-lg(v-model="rangeValues", :min="0", :max="10", :step="1", color="white", label, dark)

              q-tab-pane(name="search")
                q-search.bg-transparent.text-white(color="white", dark)
                q-btn.q-mt-sm.full-width search

    // DIAGRAM:
    // TIMELINE OVERVIEW
    //
    .text-center
      svg(:width="(diagramDimensions.barWidth + diagramDimensions.barSpace) * grouped.sessions.length - diagramDimensions.barSpace", :height="diagramDimensions.height")
        svg(v-for="(session, isession) in grouped.sessions", :width="diagramDimensions.barWidth",
        height="100%", :x="(diagramDimensions.barWidth + diagramDimensions.barSpace) * isession")
          rect.cursor-pointer.moba-diagram-bar(@click="toggleShowSession(), setActiveSession(isession), activeBar = isession",
          @mouseenter="hoverVal = session.start",
          @mouseleave="hoverVal = ''",
          :class="{'moba-active-bar' : activeBar == isession}",
          width="100%", :height="getActiveSessionDuration(session.start.millis, session.end.millis) + 10", :y="diagramDimensions.height - getActiveSessionDuration(session.start.millis, session.end.millis)")

    .text-center(style="min-height: 2rem;")
      | {{ hoverVal }}

    //
      .text-center
        svg(
        // :width="(newArrTimelineDataDummy.length * diagramDimensions.barWidth) + (newArrTimelineDataDummy.length * diagramDimensions.barSpace) - diagramDimensions.barSpace",
        height="250"
        )
          rect(
          width="1px",
          height="100%",
          // :x="(newArrTimelineDataDummy.length * diagramDimensions.barWidth) + (newArrTimelineDataDummy.length * diagramDimensions.barSpace) - diagramDimensions.barSpace - 1",
          fill="rgba(255, 255, 255, .1)"
          )

          svg(
            v-for="(data, idata) in newArrTimelineDataDummy",
            // :width="diagramDimensions.barWidth", height="100%",
            // :x="diagramDimensions.barWidth * idata + diagramDimensions.barSpace * idata"
            )
            rect.cursor-pointer.moba-diagram-bar(
            @click="toggleShowSession(), diagramDimensions.activeId = data.id",
            // :class="{'moba-active-bar': diagramDimensions.activeId == data.id }",
            width="100%", :height="data.duration / 10", :y="200 - (data.duration / 10) - 20"
            )
            //
            // separator – YEARS
            //
            g(v-if="handlerPrevItem(idata, 'year') != data.year")
              rect(width="1px", height="100%", fill="rgba(255, 255, 255, .1)")
              text.rotate-90.q-caption(y="-5", fill="rgba( 255, 255, 255, .2)") {{ data.year }}
            //
            // separator – MONTHS
            //
            g(v-if="handlerPrevItem(idata, 'month') != data.month && handlerPrevItem(idata, 'year') == data.year")
              rect(width="1px", height="50px", y="calc(100% - 70px)", fill="rgba(255, 255, 255, .1)")
              // text.q-caption(x="10", y="10", fill="rgba( 255, 255, 255, .2)") {{ data.month }}

    // WRAP - recording sessions
    //
    .row.q-mt-xl.q-pt-xl(v-if="showSession")
      .col-11.row
        div
          q-btn.bg-grey-10(@click='jumpBetweenSessions(false)', icon="keyboard_arrow_left", flat, round)
          q-btn.bg-grey-10.q-ml-sm.q-mr-md(@click="jumpBetweenSessions(true), getActiveSessionDuration(activeSession.start.millis, activeSession.end.millis)", icon="keyboard_arrow_right", flat, round)
        div
          // h5.q-my-xs
            span (Recording Session Titel)
          .row.q-mt-sm
            div {{ activeSession.start.millis }} – {{ activeSession.end.millis }}
            // .col-12 {{ activeSessionDuration }}
            //
              div {{ activeSession.start._dateTime.weekdayShort }}, {{ activeSession.start._dateTime.year }}-{{ activeSession.start._dateTime.month }}-{{ activeSession.start._dateTime.day }}
                br
                | {{ activeSession.start._dateTime.hour }}:{{ activeSession.start._dateTime.minute }}:{{ activeSession.start._dateTime.second }}
              div.q-mx-md &mdash;
              div {{ activeSession.end._dateTime.weekdayShort }}, {{ activeSession.end._dateTime.year }}-{{ activeSession.end._dateTime.month }}-{{ activeSession.end._dateTime.day }}
                br
                | {{ activeSession.end._dateTime.hour }}:{{ activeSession.end._dateTime.minute }}:{{ activeSession.end._dateTime.second }}
      .col-1.text-right
        q-btn.shadow-6(@click="showSession = false, diagramDimensions.activeId = null, activeBar = null", icon="clear", size="small", flat)

      .col-12
        SessionDiagram(:grouped="grouped", :activesession="activeSession")

    .row.q-my-xl(v-else)
      .col-12.row
        .col-10.offset-1
          q-btn.full-width.q-py-xl.bg-transparent.shadow-6(
          @click="$router.push({ name: 'piecemaker.groups.annotate' })",
          style="border: 1px solid rgba( 255, 255, 255, .1 ); border-radius: .75rem; letter-spacing: .005rem;"
          ) Live Annotate this timeline
</template>

<script>
  // import CardFull from '../../../components/shared/layouts/CardFull'
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import SessionDiagram from '../../../components/piecemaker/partials/SessionDiagram'
  import groupBySessions from '../../../lib/annotations/sessions'

  export default {
    components: {
      FullScreen,
      SessionDiagram
    },
    mounted () {
      const
        _this = this,
        uuid = this.$route.params.id
      this.$store.dispatch('maps/get', uuid)
        .then(map => {
          _this.map = map
        })
      this.$store.dispatch('annotations/find', { 'target.id': uuid })
        .then(annotations => {
          return groupBySessions(annotations.items, 40) // geteilt
          // return groupBySessions(annotations.items)
        })
        .then(grouped => {
          _this.grouped = grouped
          console.log(_this.grouped)
        })
      // this.getSvgHeight(this.videos)
      // this.appendRandomAnnotations()
      // this.divideInBlocks(this.annotations)
      // this.filterAnnotations(0, this.numberRandomAnnotations)
      // this.handlerCountAllSessions()
    },
    methods: {
      getActiveSessionDuration (start, end) {
        // getActiveSessionDuration () {
        // this.activeSessionDuration = (end - start) / 1000
        return (end - start) / 1000
      },
      jumpBetweenSessions (val) {
        if (!val && this.activeBar > 0) this.activeBar -= 1
        else if (val && this.activeBar < this.grouped.sessions.length - 1) this.activeBar += 1
        this.setActiveSession(this.activeBar)
      },
      setActiveSession (val) {
        this.activeSession = this.grouped.sessions[val]
        console.log(this.activeSession)
      },
      toggleShowSession () {
        // this.showSession = !this.showSession
        this.showSession = true
      },
      /* handlerPrevItem (valIndex, valProp) {
        if (valIndex > 0) {
          let newIndex = valIndex - 1
          if (valProp === 'year') {
            return this.newArrTimelineDataDummy[newIndex].year
          }
          else if (valProp === 'month') {
            return this.newArrTimelineDataDummy[newIndex].month
          }
        }
      }, */
      /* handlerCountAllSessions () {
        let i = 0
        let j = 0
        let k = 0
        let l = 0
        for (i = 0; i < this.arrTimelineDataDummy.length; i++) {
          for (j = 0; j < this.arrTimelineDataDummy[i].months.length; j++) {
            // this.countAllSessions++
            for (k = 0; k < this.arrTimelineDataDummy[i].months[j].days.length; k++) {
              // this.countAllSessions++
              for (l = 0; l < this.arrTimelineDataDummy[i].months[j].days[k].entries.length; l++) {
                this.countAllSessions++
                this.newArrTimelineDataDummy.push({id: this.countAllSessions, year: this.arrTimelineDataDummy[i].year, month: this.arrTimelineDataDummy[i].months[j].month, day: this.arrTimelineDataDummy[i].months[j].days[k].date, begin: this.arrTimelineDataDummy[i].months[j].days[k].entries[l].start, duration: this.arrTimelineDataDummy[i].months[j].days[k].entries[l].duration})
              }
            }
          }
        }
      }, */
      /* randomNumber (fromRandom, toRandom) {
        return Math.floor(Math.random() * toRandom) + fromRandom
      }, */
      /* filterAnnotations (valFrom, valTo) {
        this.filteredAnnotations = this.annotations.filter(annotation => annotation.created > valFrom && annotation.created <= valTo)
        // console.log(this.filteredAnnotations)
        // console.log(this.arrFilter)
        let i = 0
        for (i = 0; i < this.arrFilter.length; i++) {
          this.annotationsBlocks.push(this.annotations.filter(annotation => annotation.created > this.arrFilter[i]['rangebegin'] && annotation.created <= this.arrFilter[i]['rangeend']))
        }
      }, */
      /* appendRandomAnnotations () {
        // console.log('GEHT !')
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
            type = this.annotationTypes[2]
            text = 'https://www.youtube.com/embed/lDJFMvU2ZqY'
          }
          else if (i >= 30 && i <= 80) {
            type = this.annotationTypes[1]
            text = 'Log entry'
          }
          else if (i >= 85 && i <= 120) {
            type = this.annotationTypes[4]
            text = '#tag1'
          }
          else if (i >= 10 && i <= 20) {
            type = this.annotationTypes[0]
            text = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   \n' +
              '\n' +
              'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   \n' +
              '\n' +
              'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   \n' +
              '\n' +
              'Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer'
          }
          else if (i === 81 || i === 121) {
            type = this.annotationTypes[3]
            text = 'New Section: Lorem ipsum'
          }
          else {
            type = this.annotationTypes[0]
            text = 'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo du.'
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
          this.annotations.push({id: i, referencetime: Math.floor(Math.random() * this.svgHeight), duration: dur, created: i, text: text, type: type, author: author})
        }
      }, */
      /* getSvgHeight (arr) {
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
      }, */
      /* divideInBlocks (arr) {
        // let ab = this.annotationsBlocks
        // console.log(ab)
        var byReferencetime = arr.slice(0)
        byReferencetime.sort(function (a, b) {
          return a.byReferencetime - b.byReferencetime
        })
        // console.log(byReferencetime)
        // console.log(arr)
      }, */
      /* setPrevCreated (val, valPrev) {
        // console.log(val)
        console.log(valPrev)
        this.prevCreated = parseInt(val) + parseInt(50)
      }, */
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'annotate':
          return _this.$router.push(`/piecemaker/videos/${data.row.uuid}/annotate`)
        }
      },
      onWindowResize (size) {
        this.viewportHeight = size.height
        this.viewportWidth = size.width - 96
      }
    },
    data () {
      const _this = this
      return {
        // activeDiagram: '',
        // annotations: [],
        // annotationsBlocks: [],
        // annotationTypes: ['text', 'system', 'video', 'separator', 'tag'],
        // authors: ['A.Z.', 'B.Y.', 'C.X.'],
        // countAllSessions: null,
        activeBar: null,
        activeSession: [],
        activeSessionDuration: '',
        diagramDimensions: {
          activeId: null,
          barSpace: 1,
          barWidth: 15,
          height: 250
        },
        filterAuthors: [],
        filterTags: [],
        filterTypes: [],
        grouped: { annotations: [], videos: [] },
        map: undefined,
        openFilter: false,
        radioFilter: 'none',
        rangeValues: { max: 4, min: 2 },
        /* arrFilter: [{ // dev only
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
        }], */
        // newArrTimelineDataDummy: [],
        /* arrTimelineDataDummy: [{ // dev only
          year: 2018,
          months: [{
            month: '1',
            days: [{
              date: '4',
              entries: [{
                duration: 300,
                end: '22.12',
                id: '1',
                start: '12',
                title: 'Titel bc'
              }]
            }]
          }, {
            month: '3',
            days: [{
              date: '15',
              entries: [{
                duration: 1000,
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
                duration: 1000,
                end: '22.12',
                id: '3',
                start: '7',
                title: 'Titel bc'
              }]
            }, {
              date: '21',
              entries: [{
                duration: 1000,
                end: '22.12',
                id: '4',
                start: '7.30',
                title: 'Titel bc'
              }, {
                duration: 400,
                end: '22.12',
                id: '5',
                start: '14.45',
                title: 'Titel abc'
              }]
            }, {
              date: '26',
              entries: [{
                duration: 400,
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
                duration: 934,
                end: '22.12',
                id: '7',
                start: '8:50',
                title: 'vdvdscdscd Titel abc'
              }]
            }, {
              date: '4',
              entries: [{
                duration: 400,
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
                duration: 320,
                end: '23.00',
                id: 'dedasca',
                start: '19.12',
                title: 'hallo'
              }]
            }, {
              date: '9',
              entries: [{
                duration: 1200,
                end: '23.00',
                id: '9',
                start: '19.12',
                title: 'hallo'
              }]
            }, {
              date: '10',
              entries: [{
                duration: 410,
                end: '23.00',
                id: '9vvdscasdc',
                start: '19.12',
                title: 'hallo'
              }]
            }, {
              date: '15',
              entries: [{
                duration: 80,
                end: '23.00',
                id: 'lvdsvsdc',
                start: '19.12',
                title: 'hallo'
              }]
            }]
          }, {
            month: '12',
            days: [{
              date: '14',
              entries: [{
                duration: 561,
                end: '23.00',
                id: '10',
                start: '11:00',
                title: 'vormittags'
              }, {
                duration: 912,
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
                duration: 1287,
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
                duration: 1058,
                end: '23.00',
                id: '13',
                start: '11:00',
                title: 'vormittags'
              }, {
                duration: 1701,
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
                duration: 461,
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
                duration: 950,
                end: '11.00',
                id: '16',
                start: '11:00',
                title: 'vormittags'
              }, {
                duration: 317,
                end: '12.00',
                id: '17',
                start: '18:19',
                title: 'blablabla'
              }, {
                duration: 873,
                end: '13.00',
                id: '18',
                start: '11:00',
                title: 'vormittags'
              }, {
                duration: 900,
                end: '14.00',
                id: '19',
                start: '18:19',
                title: 'blablabla'
              }]
            }]
          }]
        }], */
        // byReferencetime: [],
        // filteredAnnotations: [],
        hoverVal: null,
        // maps: [],
        // numberRandomAnnotations: 200, // dev only
        // prevCreated: '100',
        previewLine: {
          visibility: false,
          positionY: ''
        },
        showSession: false,
        // svgHeight: '100',
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
        /* videos: [{ // dev only
          created: '1',
          duration: '1000',
          id: '',
          referencetime: '0',
          title: 'video 1',
          type: 'video'
        }, {
          created: '20',
          duration: '1100',
          id: '',
          referencetime: '20',
          title: 'video 1',
          type: 'video'
        }, {
          created: '25',
          duration: '500',
          id: '',
          referencetime: '270',
          title: 'video 1',
          type: 'video'
        }, {
          created: '59',
          duration: '821',
          id: '',
          referencetime: '200',
          title: 'Zeitraum 1',
          type: 'timerange'
        }, {
          created: '300',
          duration: '1282',
          id: '',
          referencetime: '12',
          title: 'video vfvdfcasd',
          type: 'video'
        }] */
      }
    }
  }
</script>

<style lang="stylus">
  $primary = #729BFF
  /* .moba-active {
    background-color: rgba( 0, 0, 0, .1 );
  } */

  .moba-border-top
    border-top 1px solid rgba( 255, 255, 255, .2 )

  .moba-diagram-bar
    fill rgba(255, 255, 255, .05)

  .moba-diagram-bar:hover
    fill rgba(255, 255, 255, .2)

  .moba-active-bar
    fill $primary!important

  /* .moba-empty {
  }

  .moba-round-borders-filter {
    border-radius: .5rem;
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
  } */
</style>
