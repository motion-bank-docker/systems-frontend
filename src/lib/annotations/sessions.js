import constants from '../constants'
import Sorting from './sorting'
import TimelineSelector from './selectors/timeline'
import { ObjectUtil } from 'mbjs-utils'

const groupBySessions = function (annotations, secondsDist = constants.SESSION_DISTANCE_SECONDS) {
  annotations = annotations.sort(Sorting.sortOnTarget)
  const videos = annotations.filter(anno => { return anno.body.type === 'Video' })
    .map(annotation => { return { meta: { seconds: 1800 }, annotation } })
  annotations = annotations.filter(anno => { return anno.body.type === 'TextualBody' })
  const sessions = []
  const defaultSession = { start: undefined, end: undefined, seconds: undefined, annotations: [] }
  let lastDatetime, session = ObjectUtil.merge({}, defaultSession)
  for (let i = 0; i < annotations.length; i++) {
    const a = annotations[i]
    if (!session.start) session.start = TimelineSelector.fromISOString(a.target.selector.value)
    if (lastDatetime) {
      const dist = TimelineSelector.timeBetween(lastDatetime, TimelineSelector.fromISOString(a.target.selector.value))
      const seconds = dist.values.milliseconds * 0.001
      if (seconds >= secondsDist || i === annotations.length - 1) {
        session.end = TimelineSelector.fromISOString(a.target.selector.value)
        session.seconds = TimelineSelector.timeBetween(session.start, session.end).values.milliseconds * 0.001
        session.annotations.push(a)
        sessions.push(session)
        session = ObjectUtil.merge({}, defaultSession)
      }
      else session.annotations.push(a)
    }
    else session.annotations.push(a)
    lastDatetime = TimelineSelector.fromISOString(a.target.selector.value)
  }
  return { sessions, videos }
}

export default groupBySessions
