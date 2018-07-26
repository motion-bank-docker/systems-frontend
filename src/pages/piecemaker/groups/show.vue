<template lang="pug">

  full-screen
    // detect window dimensions
    // (necessary, do not delete)
    //
    q-window-resize-observable(@resize="onWindowResize")

    // headline
    //
    .row.q-mb-xl
      .col-10.offset-1(slot="form-title")
        // div {{ $t('routes.piecemaker.groups.show.title') }}: Titel der Timeline
        h5.no-margin.text-center
          div {{ map.title }}
          .text-grey-8 {{ map.author.name }}

    // hide logo
    //
    span(slot="form-logo")

    // btn: back
    //
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.groups.list' })", icon="keyboard_backspace", round, small)

    // btn: filter
    //
    q-btn.fixed.text-white(@click="openFilter = true", :class="{ 'bg-green': radioFilter == 'allsessions' || radioFilter == 'thissession' }", style="top: 66px; right: 16px; z-index: 1000;")
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

    // DIAGRAM
    // timeline overview
    //
    .text-center
      svg(
      width="100%",
      :height="diagramDimensions.height")

        // BACKGROUND LINES
        //
        line(
        v-for="n in diagramDimensions.distances.length"
        x1="0",
        :y1="diagramDimensions.height / diagramDimensions.distances.length * (n - 1)",
        x2="100%",
        :y2="diagramDimensions.height / diagramDimensions.distances.length * (n - 1)",
        style="stroke: rgba( 255, 255, 255, .1 ); stroke-width: 1;")

        // BACKGROUND LINES
        //
        text(
        v-for="(n, i) in diagramDimensions.distances.length"
        x="10",
        :y="diagramDimensions.height - (diagramDimensions.height / diagramDimensions.distances.length * (n - 1)) - ((diagramDimensions.height / diagramDimensions.distances.length) / 2) + 5",
        style="fill: rgba( 255, 255, 255, 1 );") {{ diagramDimensions.distances[i] }}

        // SESSION BARS
        //
        svg(:x="((viewportWidth / 2) - 48)")
          svg(v-for="(session, isession) in grouped.sessions", :width="diagramDimensions.barWidth",
          height="100%", :x="(diagramDimensions.barWidth + diagramDimensions.barSpace) * isession")
            rect.cursor-pointer.moba-diagram-bar(
            @click="toggleShowSession(), setActiveSession(isession), activeBar = isession",
            @mouseenter="hoverVal.start = session.start.millis, hoverVal.end = session.end.millis",
            @mouseleave="hoverVal.start = false, hoverVal.end = ''",
            :class="{'moba-active-bar' : activeBar == isession}",
            width="100%",
            :height="(diagramDimensions.height / 2 / 60 / 60) * (getActiveSessionDuration(session.start.millis, session.end.millis) / 1000)",
            :y="diagramDimensions.height - ((diagramDimensions.height / 2 / 60 / 60) * (getActiveSessionDuration(session.start.millis, session.end.millis) / 1000))")
            // rect.cursor-pointer.moba-diagram-bar(
              @click="toggleShowSession(), setActiveSession(isession), activeBar = isession",
              @mouseenter="hoverVal.start = getTime(session.start), hoverVal.end = getTime(session.end)",
              @mouseleave="hoverVal.start = false, hoverVal.end = ''",
              // :class="{'moba-active-bar' : activeBar == isession}",
              width="100%", :height="(getActiveSessionDuration(session.start.millis, session.end.millis) / 2) + 10",
              // :y="diagramDimensions.height - (getActiveSessionDuration(session.start.millis, session.end.millis) / 2)")

        // BOTTOM LINE
        //
        line(
        x1="0",
        :y1="diagramDimensions.height",
        x2="100%",
        :y2="diagramDimensions.height",
        style="stroke: rgba( 255, 255, 255, .25 ); stroke-width: 1;")

    // HOVERSTATE
    // shows time range from hovering session bar in diagram above
    //
    .row.full-width.q-mt-lg(style="min-height: 2rem;")
      .full-width.text-center(v-if="hoverVal.start")
        // span.q-py-sm.q-px-md.shadow-6.moba-border {{ hoverVal.start }} &mdash; {{ hoverVal.end }}
        // span.q-py-sm.q-px-md.shadow-6.moba-border {{ (hoverVal.end - hoverVal.start) * 0.035 }}
        span.q-py-sm.q-px-md.shadow-6.moba-border {{ (hoverVal.end - hoverVal.start) / 1000 }}

    // vorübergehend drin lassen
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

    // ACTIVE SESSION IN DETAIL
    //
    .row.q-mt-md(v-if="showSession")
      .col-10.offset-1.text-center
        q-btn.bg-grey-10(@click='jumpBetweenSessions(false)', icon="keyboard_arrow_left", flat, round)
        span.q-mx-md.q-py-sm.q-px-md.shadow-6.text-primary.moba-border {{ getTime(activeSession.start) }} – {{ getTime(activeSession.end) }}
        q-btn.bg-grey-10(@click="jumpBetweenSessions(true), getActiveSessionDuration(activeSession.start.millis, activeSession.end.millis)", icon="keyboard_arrow_right", flat, round)

      .col-1.text-right
        q-btn.shadow-6(@click="showSession = false, diagramDimensions.activeId = null, activeBar = null", icon="clear", size="small", flat, round)

      .col-12.q-mt-xl
        SessionDiagram(:grouped="grouped", :activesession="activeSession")

    // BUTTON: LIVE ANNOTATE
    // appears when no session active
    //
    .row.q-my-md(v-else)
      .col-12.row
        .col-10.offset-1
          q-btn.full-width.q-py-xl.bg-transparent.shadow-6(
          @click="$router.push({ name: 'piecemaker.groups.annotate' })",
          style="border: 1px solid rgba( 255, 255, 255, .1 ); border-radius: .75rem; letter-spacing: .005rem;"
          ) Live Annotate this timeline
</template>

<script>
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
          console.log(map)
        })
      this.$store.dispatch('annotations/find', { 'target.id': uuid })
        .then(annotations => {
          return groupBySessions(annotations.items, 90) // geteilt
          // return groupBySessions(annotations.items)
        })
        .then(grouped => {
          _this.grouped = grouped
          console.log(_this.grouped)
        })
    },
    methods: {
      getTime (val) {
        return val._dateTime.toLocaleString({ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' })
      },
      checkVideoVisibility (videoStart, videoEnd, sessionStart, sessionEnd) {
        // console.log(videoStart, videoEnd, sessionStart, sessionEnd)
        if ((videoStart <= sessionStart && videoEnd >= sessionEnd) || (videoStart >= sessionStart && videoEnd <= sessionEnd) || (videoStart > sessionStart && videoStart < sessionEnd && videoEnd > sessionEnd)) return true
        else return false
      },
      getActiveSessionDuration (start, end) {
        let difference = (end - start)
        if (difference <= 10) difference = 10
        return difference
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
        this.showSession = true
      },
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
      // const _this = this
      return {
        activeBar: null,
        activeSession: [],
        diagramDimensions: {
          activeId: null,
          barSpace: 1,
          barWidth: 15,
          height: 250,
          distances: ['0 - 30', '30 - 60', '60 - 90', '90 - 120']
        },
        filterAuthors: [],
        filterTags: [],
        filterTypes: [],
        grouped: { annotations: [], videos: [] },
        hoverVal: {
          end: null,
          start: null
        },
        map: undefined,
        openFilter: false,
        previewLine: {
          visibility: false,
          positionY: ''
        },
        radioFilter: 'none',
        rangeValues: { max: 4, min: 2 },
        showSession: false,
        viewportHeight: ''
      }
    }
  }
</script>

<style lang="stylus">
  $primary = #729BFF

  .moba-border
    border 1px solid rgba( 255, 255, 255, .075 )

  .moba-border-top
    border-top 1px solid rgba( 255, 255, 255, .2 )

  .moba-diagram-bar
    fill rgba(255, 255, 255, .05)

  .moba-diagram-bar:hover
    fill rgba(255, 255, 255, .2)

  .moba-active-bar
    fill $primary!important
</style>
