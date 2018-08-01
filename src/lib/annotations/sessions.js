import constants from '../constants'
import Sorting from './sorting'
import { DateTime } from 'luxon'
import { ObjectUtil } from 'mbjs-utils'
import { getMetaData } from './videos'
import SessionHelpers from './session-helpers'
import parseSelector from '../parse-selector'

const resurrectAnnotation = function (annotation) {
  if (typeof annotation.created === 'string') annotation.created = DateTime.fromISO(annotation.created)
  if (typeof annotation.updated === 'string') annotation.updated = DateTime.fromISO(annotation.updated)
  if (annotation.target && annotation.target.selector) {
    if (typeof annotation.target.selector.value === 'string') {
      const parsedSelector = parseSelector(annotation.target.selector.value)
      if (parsedSelector.end) {
        annotation.target.selector.value = {
          start: parsedSelector.start,
          end: parsedSelector.end
        }
      }
      else {
        annotation.target.selector.value = parsedSelector
      }
    }
  }
  return annotation
}

const fetchMetaData = async (store, videos) => {
  for (let v of videos) {
    try {
      const meta = await getMetaData(v.annotation, store)
      Object.assign(v.meta, meta)
    }
    catch (e) { console.error('fetchMetaData', e.message, e.stack) }
  }
  return videos
}

const groupBySessions = async function (store, annotations, secondsDist = constants.SESSION_DISTANCE_SECONDS) {
  let millisDist = secondsDist * 1000
  annotations = annotations.map(annotation => resurrectAnnotation(annotation)).sort(Sorting.sortOnTarget)
  const videos = annotations.filter(anno => { return anno.body.type === 'Video' })
    .map(annotation => {
      return {
        meta: {},
        annotation: annotation
      }
    })
  await fetchMetaData(store, videos)
  annotations = annotations.filter(anno => { return anno.body.type === 'TextualBody' })
  const sessions = []
  const defaultSession = { start: undefined, end: undefined, duration: undefined, annotations: [] }
  let lastDatetime, session = ObjectUtil.merge({}, defaultSession)
  for (let i = 0; i < annotations.length; i++) {
    const a = annotations[i]
    const select = a.target.selector.value.start
    if (!session.start) {
      session.start = select
    }
    let duration = select.toMillis() - session.start.toMillis()
    if (lastDatetime) {
      const dist = select.toMillis() - lastDatetime.toMillis()
      if (dist >= millisDist || i === annotations.length - 1) {
        session.end = select
        session.duration = (session.end.toMillis() - session.start.toMillis()) * 0.001 // TimelineSelector.timeBetween(, ).as('seconds')
        videos.forEach(video => {
          // FIXME: end value stays wrong
          const s = SessionHelpers.annotationToSessionTime(video.meta.duration, video.annotation, session)
          session.duration = Math.max(session.duration, s)
        })
        if (isNaN(session.duration)) {
          console.error('duration NaN', session)
          session.duration = 0
        }
        session.annotations.push({ annotation: a, duration, active: false })
        sessions.push(session)
        session = ObjectUtil.merge({}, defaultSession)
      }
      else {
        session.annotations.push({ annotation: a, duration, active: false })
      }
    }
    else session.annotations.push({ annotation: a, duration, active: false })
    lastDatetime = select
  }
  return { sessions, videos }
}

export default groupBySessions
