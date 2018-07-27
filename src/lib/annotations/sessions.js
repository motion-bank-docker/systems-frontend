import constants from '../constants'
import Sorting from './sorting'
import { DateTime } from 'luxon'
import TimelineSelector from './selectors/timeline'
import { ObjectUtil } from 'mbjs-utils'
import { guessType, getMetaData } from './videos'
import SessionHelpers from './session-helpers'

const resurrectAnnotation = function (annotation) {
  if (typeof annotation.created === 'string') annotation.created = DateTime.fromISO(annotation.created)
  if (typeof annotation.updated === 'string') annotation.updated = DateTime.fromISO(annotation.updated)
  if (annotation.target && annotation.target.selector) {
    if (typeof annotation.target.selector.value === 'string') {
      annotation.target.selector.value = DateTime.fromISO(annotation.target.selector.value)
    }
  }
  return annotation
}

const fetchMetaData = async videos => {
  for (let v of videos) {
    const type = guessType(v.annotation.body.source.id)
    let key
    if (type === 'video/youtube') key = process.env.YOUTUBE_API_KEY
    else if (type === 'video/vimeo') key = process.env.VIMEO_ACCESS_TOKEN
    try {
      const meta = await getMetaData(v.annotation.body.source, key)
      v.meta = meta
    }
    catch (e) { /* ignored */ }
  }
}

const groupBySessions = async function (annotations, secondsDist = constants.SESSION_DISTANCE_SECONDS) {
  annotations = annotations.sort(Sorting.sortOnTarget).map(annotation => resurrectAnnotation(annotation))
  const videos = annotations.filter(anno => { return anno.body.type === 'Video' })
    .map(annotation => {
      return {
        meta: {},
        annotation: resurrectAnnotation(annotation)
      }
    })
  await fetchMetaData(videos)
  annotations = annotations.filter(anno => { return anno.body.type === 'TextualBody' })
  const sessions = []
  const defaultSession = { start: undefined, end: undefined, duration: undefined, annotations: [] }
  let lastDatetime, session = ObjectUtil.merge({}, defaultSession)
  for (let i = 0; i < annotations.length; i++) {
    const a = annotations[i]
    if (!session.start) {
      session.start = TimelineSelector.fromDateTime(a.target.selector.value)
    }
    let seconds = TimelineSelector.timeBetween(session.start, TimelineSelector.fromDateTime(a.target.selector.value))
    seconds = seconds ? seconds.as('seconds') : 0.0
    if (lastDatetime) {
      const dist = TimelineSelector.timeBetween(lastDatetime, TimelineSelector.fromDateTime(a.target.selector.value))
      if (dist.as('seconds') >= secondsDist || i === annotations.length - 1) {
        session.end = TimelineSelector.fromDateTime(a.target.selector.value)
        session.duration = TimelineSelector.timeBetween(session.start, session.end).as('seconds')
        videos.forEach(video => {
          // FIXME: end value stays wrong
          const s = SessionHelpers.annotationToSessionTime(video.meta.duration, video.annotation, session)
          session.duration = Math.max(session.duration, s)
        })
        session.annotations.push({ annotation: a, seconds, active: false })
        sessions.push(session)
        session = ObjectUtil.merge({}, defaultSession)
      }
      else {
        session.annotations.push({ annotation: a, seconds, active: false })
      }
    }
    else session.annotations.push({ annotation: a, seconds, active: false })
    lastDatetime = TimelineSelector.fromDateTime(a.target.selector.value)
  }
  return { sessions, videos }
}

export default groupBySessions
