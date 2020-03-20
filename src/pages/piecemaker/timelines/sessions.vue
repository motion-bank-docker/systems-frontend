<template lang="pug">
  full-screen
    // headline
    //
    .row.q-mb-xl(v-if="map")
      .col-10.offset-1(slot="form-title")
        h5.no-margin.text-center
          div {{ map.title }}
          .text-grey-8 {{ map.creator.name }}

    // btn: back
    q-btn.absolute-top-left(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small, style="top: 66px; left: 16px;")

    // session-filter
    session-diagram(v-if="sessions", :sessions="sessions", @select-session="selectSession", :active-session-index="activeSessionIndex", ref="sessionDiagram")

    // ACTIVE SESSION IN DETAIL
    //
    .row.q-mt-xl(v-if="showSession")
      .col-10.offset-1.text-center
        q-btn.bg-grey-10(@click='setActiveSession(activeSessionIndex-1)', icon="keyboard_arrow_left", flat, round)
        span.q-mx-md.q-py-sm.q-px-md.shadow-6.text-primary.moba-border
          | {{ getTime(activeSession.start) }} – {{ getTime(activeSession.end) }}
        q-btn.bg-grey-10(@click="setActiveSession(activeSessionIndex+1)", icon="keyboard_arrow_right", flat, round)

      .col-1.text-right
        q-btn.shadow-6(@click="clearSession", icon="clear", size="small", flat, round)

      .col-12.q-mt-md
        session-stream(:session="activeSession")

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
  // import axios from 'axios'
  import {
    SessionDiagram,
    SessionFilter,
    SessionStream
  } from '../../../components/piecemaker/partials/sessions'
  // import constants from 'mbjs-data-models/src/constants'
  // import { ObjectUtil } from 'mbjs-utils'

  // const resurrectAnnotation = function (annotation) {
  //   if (typeof annotation.created === 'string') annotation.created = DateTime.fromISO(annotation.created)
  //   if (typeof annotation.updated === 'string') annotation.updated = DateTime.fromISO(annotation.updated)
  //   if (annotation.target && annotation.target.selector) {
  //     if (typeof annotation.target.selector.value === 'string') {
  //       annotation.target.selector.value = DateTime.fromISO(annotation.target.selector.value)
  //     }
  //   }
  //   return annotation
  // }
  //
  // const fetchMetaData = async (media) => {
  //   let mediaMeta = []
  //   const headers = {
  //     Authorization: `Bearer ${this.$auth.token}`
  //   }
  //   for (let v of media) {
  //     try {
  //       const meta = await axios.get(`${process.env.TRANSCODER_HOST}/metadata/${v.annotation._uuid}`, {headers})
  //       Object.assign(v.meta, meta.data)
  //       mediaMeta.push(v)
  //     }
  //     catch (e) { console.error(e) }
  //   }
  //   return mediaMeta
  // }

  export default {
    components: {
      SessionDiagram,
      SessionFilter,
      SessionStream
    },
    async mounted () {
      this.map = await this.$store.dispatch('maps/get', this.$route.params.uuid)
      this.sessions = await this.generateSessions(this.map.id)

      /*
      this.map = await this.$store.dispatch('maps/get', this.$route.params.uuid)
      // const grouped = await this.$store.dispatch('sessions/get', uuid)
      // grouped.sessions = grouped.sessions.map(session => {
      //   session.start = session.start
      //   session.end = session.end
      //   return session
      // })
      const result = await this.$store.dispatch('annotations/find', {
        'target.id': this.map.id
      })
      const annotations = result.items
      .filter(a => {
        return a.target.selector.value
      })
      .sort(this.$sort.onRef)
      .map(a => {
        return resurrectAnnotation(a)
      })
      const mediaBase = result.items.filter(a => { return a.body.type === 'Media' })
        .map(video => {
          return {
            meta: {},
            annotation: video
          }
        })
      const media = await fetchMetaData(mediaBase)

      const millisDist = (3600 || constants.config.SESSION_DISTANCE_SECONDS) * 1000
      const sessions = []
      const defaultSession = { start: undefined, end: undefined, duration: undefined, annotations: [], media: [] }
      let session = ObjectUtil.merge({}, defaultSession)

      for (let i = 0; i < annotations.length; i++) {
        const a = annotations[i]
        const annotationStart = a.target.selector.value
        let annotationEnd = annotationStart
        let video

        // TODO: handle other annotations with a duration here
        if (a.body.type === 'Media') {
          video = media.find(v => {
            return a._uuid === v.annotation._uuid
          })
          if (video) {
            if (video.meta && video.meta.duration) {
              annotationEnd = annotationStart.plus(video.meta.duration * 1000)
            }
          }
        }

        const annotationDuration = annotationEnd.toMillis() - annotationStart.toMillis()

        if (!session.start) {
          session.start = annotationStart
        }
        if (!session.end) {
          session.end = annotationEnd
        }

        // could be negative if first annotation is video, hence Math.max()
        const distToSessionEnd = Math.max(0, annotationStart.toMillis() - session.end.toMillis())

        const annotationInside = distToSessionEnd <= millisDist
        const isLastAnnotation = i === annotations.length - 1

        if (annotationInside) {
          // only set end if past current session.end
          if (annotationEnd > session.end) {
            session.end = annotationEnd
          }
          session.annotations.push({
            annotation: a,
            duration: annotationDuration,
            relativeTime: annotationStart - session.start,
            active: false
          })
          if (video) session.media.push(video)
        }
        if (!annotationInside || isLastAnnotation) {
          // store current annotation
          session.duration = session.end - session.start
          if (isNaN(session.duration)) {
            console.error('duration NaN', session)
            session.duration = 0
          }
          sessions.push(session)
          // start fresh session
          session = ObjectUtil.merge({}, defaultSession)
          // add current annotation
          session.start = annotationStart
          session.end = annotationEnd
          session.annotations.push({
            annotation: a,
            duration: annotationDuration,
            relativeTime: 0,
            active: false
          })
          if (video) session.media.push(video)
        }

        // console.debug(sessions.length, session.annotations.length, session.media.length)
      }
      this.grouped = {sessions, media}
      // console.debug(annotations, this.grouped)
      */
    },
    methods: {
      async generateSessions (timelineId) {
        const storeSession = function (sessions, session) {
          if (session) {
            sessions.push(session)
          }
          return {
            annotations: [],
            media: [],
            start: undefined,
            end: undefined
          }
        }
        const maxDist = 6 * 60 * 60 * 1000
        const sessions = []
        const result = await this.$store.dispatch('annotations/find', {
          'target.id': timelineId
        })
        const annotations = result.items.sort(this.$sort.onRef)
        let lastRef, session
        for (let annotation of annotations) {
          const ref = annotation.target.selector._valueMillis
          if (!lastRef || ref - lastRef >= maxDist) {
            session = storeSession(sessions, session)
            session.start = annotation.target.selector._valueMillis
            session.end = annotation.target.selector._valueMillis
          }
          let sessionEnd = session.end
          if (lastRef && lastRef > sessionEnd) {
            sessionEnd = lastRef
            session.end = sessionEnd
          }
          if (annotation.body.type === 'Media') {
            const metadata = await this.$store.dispatch('metadata/get', annotation)
            const video = {
              metadata,
              annotation
            }
            if (metadata && metadata.duration) {
              const videoEnd = annotation.target.selector._valueMillis + metadata.duration * 1000
              if (videoEnd > ref && videoEnd > sessionEnd) session.end = videoEnd
            }
            session.media.push(video)
          }
          else if (annotation.body.type === 'TextualBody') {
            session.annotations.push(annotation)
          }
          lastRef = ref
        }
        storeSession(sessions, session)
        return sessions
      },
      selectSession (data) {
        const { session, index } = data
        this.activeSessionIndex = Math.min(this.sessions.length - 1, Math.max(0, index))
        this.activeSession = session
        this.toggleShowSession()
      },
      clearSession () {
        this.showSession = false
        this.$refs.sessionDiagram.clearSession()
      },
      getTime (val) {
        return val.toLocaleString(this.timeFormat)
      },
      checkMediaVisibility (videoStart, videoEnd, sessionStart, sessionEnd) {
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
      toggleShowSession () {
        this.showSession = true
      },
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'annotate':
          return _this.$router.push(`/piecemaker/media/${data.row._uuid}/annotate`)
        }
      }
    },
    data () {
      return {
        activeSession: undefined,
        grouped: { annotations: [], media: [] },
        sessions: undefined,
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
