import constants from '../constants'
import Sorting from './sorting'
import { DateTime } from 'luxon'
import TimelineSelector from './selectors/timeline'
import { ObjectUtil } from 'mbjs-utils'
import { guessType } from './videos'
import SessionHelpers from './session-helpers'
import URL from 'url'
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
    const type = guessType(v.annotation.body.source.id)
    let infoUrl
    if (type === 'video/mp4') {
      infoUrl = v.annotation.body.source.id.replace('.mp4', '.json')
    }
    else if (type === 'video/youtube') {
      const parsed = URL.parse(v.annotation.body.source.id)
      const params = parsed.query.split('&')
      let videoId = ''
      params.forEach(param => {
        const kv = param.split('=')
        if (kv[0] === 'v') videoId = kv[1]
      })
      infoUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    }
    else if (type === 'video/vimeo') {
      const parsed = URL.parse(v.annotation.body.source.id)
      infoUrl = `https://api.vimeo.com/videos/${parsed.pathname.substr(1)}?access_token=${process.env.VIMEO_ACCESS_TOKEN}`
    }
    const info = await axios.get(infoUrl)
    let duration
    try {
      if (type === 'video/mp4') duration = info.data.meta.ffprobe.format.duration
      else if (type === 'video/youtube') {
        if (info.data.items && info.data.items.length) {
          duration = info.data.items[0].contentDetails.duration
          duration = duration.replace('PT', '')
          duration = duration.split('M')
          duration[1] = duration[1].replace('S', '')
          duration = duration.map(val => parseInt(val))
          duration = duration[0] * 60.0 + duration[1]
        }
      }
      else if (type === 'video/vimeo') {
        duration = info.data.duration
      }
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
        videos.forEach(video => {
          // FIXME: end value stays wrong
          const s = SessionHelpers.annotationToSessionTime(video.meta.seconds, video.annotation, session)
          session.seconds = Math.max(session.seconds, s)
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
