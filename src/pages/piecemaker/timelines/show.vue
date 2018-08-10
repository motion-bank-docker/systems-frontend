<template lang="pug">
  full-screen
    // headline
    //
    .row.q-mb-xl(v-if="map")
      .col-10.offset-1(slot="form-title")
        h5.no-margin.text-center
          div {{ map.title }}
          .text-grey-8 {{ map.author.name }}

    // btn: back
    q-btn.absolute-top-left(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small, style="top: 66px; left: 16px;")

    session-filter
    session-diagram(:grouped="grouped", @select-session="selectSession", ref="sessionDiagram")

    // ACTIVE SESSION IN DETAIL
    //
    .row.q-mt-xl(v-if="showSession")
      .col-10.offset-1.text-center
        q-btn.bg-grey-10(@click='jumpBetweenSessions(false)', icon="keyboard_arrow_left", flat, round)
        span.q-mx-md.q-py-sm.q-px-md.shadow-6.text-primary.moba-border
          | {{ getTime(activeSession.start) }} – {{ getTime(activeSession.end) }}
        q-btn.bg-grey-10(@click="jumpBetweenSessions(true)", icon="keyboard_arrow_right", flat, round)

      .col-1.text-right
        q-btn.shadow-6(@click="clearSession", icon="clear", size="small", flat, round)

      .col-12.q-mt-md
        session-stream(:videos="grouped.videos", :session="activeSession")

    // BUTTON: LIVE ANNOTATE
    // appears when no session active
    //
    .row.q-my-md(v-else)
      .col-12.row
        .col-10.offset-1
          q-btn.full-width.q-py-xl.bg-transparent.shadow-6.live-button(
            @click="$router.push({ name: 'piecemaker.timelines.annotate' })") {{ $t('buttons.live_annotate_timeline') }}
</template>

<script>
  import { FullScreen } from 'mbjs-quasar/src/components'
  import { DateTime } from 'luxon'
  import {
    SessionDiagram,
    SessionFilter,
    SessionStream
  } from '../../../components/piecemaker/partials/sessions'

  export default {
    components: {
      FullScreen,
      SessionDiagram,
      SessionFilter,
      SessionStream
    },
    async mounted () {
      const
        uuid = this.$route.params.id,
        map = await this.$store.dispatch('maps/get', uuid)
      this.map = map
      const grouped = await this.$store.dispatch('sessions/get', uuid)
      grouped.sessions = grouped.sessions.map(session => {
        session.start = DateTime.fromISO(session.start)
        session.end = DateTime.fromISO(session.end)
        return session
      })
      this.grouped = grouped
      console.log(map, this.grouped)
    },
    methods: {
      selectSession (data) {
        this.setActiveSession(data.index)
        this.toggleShowSession()
      },
      clearSession () {
        this.showSession = false
        this.$refs.sessionDiagram.clearSession()
      },
      getTime (val) {
        return val.toLocaleString(this.timeFormat)
      },
      checkVideoVisibility (videoStart, videoEnd, sessionStart, sessionEnd) {
        return (videoStart <= sessionStart && videoEnd >= sessionEnd) ||
          (videoStart >= sessionStart && videoEnd <= sessionEnd) ||
          (videoStart > sessionStart && videoStart < sessionEnd && videoEnd > sessionEnd)
      },
      getActiveSessionDuration (start, end) {
        let difference = (end - start),
          barMinHeight = this.diagramDimensions.barMinHeight,
          milliHeight = (this.diagramDimensions.height / this.diagramDimensions.distances.length / 60 / 60 / 1000),
          minVal = barMinHeight / milliHeight
        if (difference <= minVal) difference = minVal
        return difference
      },
      jumpBetweenSessions (val) {
        if (!val && this.activeBar > 0) this.activeBar -= 1
        else if (val && this.activeBar < this.grouped.sessions.length - 1) this.activeBar += 1
        this.setActiveSession(this.activeBar)
        if (val) this.getActiveSessionDuration(this.activeSession.start.millis, this.activeSession.end.millis)
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
      }
    },
    data () {
      return {
        activeSession: [],
        grouped: { annotations: [], videos: [] },
        map: undefined,
        previewLine: {
          visibility: false,
          positionY: ''
        },
        showSession: false
      }
    }
  }
</script>

<style lang="stylus">
  .moba-border
    border 1px solid rgba( 255, 255, 255, .075 )

  .moba-border-top
    border-top 1px solid rgba( 255, 255, 255, .2 )

  .live-button
    border: 1px solid rgba( 255, 255, 255, .1 )
    border-radius: .75rem
    letter-spacing: .005rem
</style>
