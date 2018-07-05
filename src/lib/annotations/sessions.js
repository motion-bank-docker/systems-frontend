import constants from '../constants'
import Sorting from './sorting'
import { DateTime } from 'luxon'
import TimelineSelector from './selectors/timeline'
import { ObjectUtil } from 'mbjs-utils'
import axios from 'axios'

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

const groupBySessions = async function (annotations, secondsDist = constants.SESSION_DISTANCE_SECONDS) {
  annotations = annotations.sort(Sorting.sortOnTarget).map(annotation => resurrectAnnotation(annotation))
  const videos = annotations.filter(anno => { return anno.body.type === 'Video' })
    .map(annotation => {
      return {
        meta: { seconds: undefined },
        annotation: resurrectAnnotation(annotation)
      }
    })
  for (let v of videos) {
    const info = await axios.get(v.annotation.body.source.id.replace('.mp4', '.json'))
    let duration
    try {
      duration = info.data.meta.ffprobe.format.duration
    }
    catch (e) { /* ignored */ }
    if (duration) v.meta.seconds = duration
  }
  annotations = annotations.filter(anno => { return anno.body.type === 'TextualBody' })
  const sessions = []
  const defaultSession = { start: undefined, end: undefined, seconds: undefined, annotations: [] }
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
        session.seconds = TimelineSelector.timeBetween(session.start, session.end).as('seconds')
        session.annotations.push({ annotation: a, seconds })
        sessions.push(session)
        session = ObjectUtil.merge({}, defaultSession)
      }
      else {
        session.annotations.push({ annotation: a, seconds })
      }
    }
    else session.annotations.push({ annotation: a, seconds })
    lastDatetime = TimelineSelector.fromDateTime(a.target.selector.value)
  }
  return { sessions, videos }
}

export default groupBySessions
