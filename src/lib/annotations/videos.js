import URL from 'url'
import path from 'path'
import { Assert } from 'mbjs-utils'
import axios from 'axios'
import { DateTime } from 'luxon'
import parseSelector from '../parse-selector'

const guessType = url => {
  url = URL.parse(url)
  const extname = path.extname(url.pathname)
  if (['youtube.com', 'www.youtube.com', 'youtu.be'].indexOf(url.hostname) > -1) {
    return 'video/youtube'
  }
  else if (['vimeo.com', 'www.vimeo.com'].indexOf(url.hostname) > -1) {
    return 'video/vimeo'
  }
  else if (extname === '.mp4') {
    return 'video/mp4'
  }
}

const getMetaData = async (annotation, store = undefined) => {
  const source = annotation.body.source
  Assert.isType(source.id, 'string', 'getMetaData: annotation.body.source.id must be string')
  Assert.isType(source.type, 'string', 'getMetaData: annotation.body.source.type must be string')

  let parsed, info
  const metadata = {
    duration: undefined,
    created: undefined,
    published: undefined,
    title: undefined
  }

  const fetchInfo = async url => {
    const data = await axios.get(url)
    console.debug('remote video metadata', data)
    return data
  }

  switch (source.type) {
  case 'video/youtube':
    Assert.isType(source.id, 'string', 'getMetaData: video/youtube needs API key')

    parsed = URL.parse(source.id)
    const params = parsed.query.split('&')
    let videoId = ''
    params.forEach(param => {
      const kv = param.split('=')
      if (kv[0] === 'v') videoId = kv[1]
    })
    info = fetchInfo(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,recordingDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`)
    if (info.data.items && info.data.items.length) {
      let d = info.data.items[0].contentDetails.duration
      d = d.replace('PT', '')
      d = d.split('M')
      d[1] = d[1].replace('S', '')
      d = d.map(val => parseInt(val))
      d = d[0] * 60.0 + d[1]
      metadata.duration = d
      metadata.title = info.data.items[0].snippet.title
      metadata.published = DateTime.fromISO(info.data.items[0].snippet.releasedAt)
      if (info.data.items[0].recordingDetails) metadata.created = DateTime.fromISO(info.data.items[0].recordingDetails.recordingDate)
    }
    break
  case 'video/vimeo':
    Assert.isType(source.id, 'string', 'getMetaData: video/vimeo needs API token')

    parsed = URL.parse(source.id)
    info = await axios.get(`https://api.vimeo.com/videos/${parsed.pathname.substr(1)}?access_token=${process.env.VIMEO_ACCESS_TOKEN}`)
    metadata.duration = info.data.duration
    metadata.title = info.data.name
    metadata.created = DateTime.fromISO(info.data.created_time)
    metadata.published = DateTime.fromISO(info.data.release_time)
    break
  case 'video/mp4':
    const p = URL.parse(source.id)
    if (p.host === 'assets.motionbank.org' && store) {
      if (annotation.target.selector.value && !annotation.target.selector.value.start) {
        annotation.target.selector.value = parseSelector(annotation.target.selector.value)
      }
      if (annotation.target.selector.value.start) {
        metadata.duration = (annotation.target.selector.value.end.toMillis() - annotation.target.selector.value.start.toMillis()) * 0.001
      }
      const annos = await store.dispatch('annotations/find', { 'target.id': source.id })
      metadata.title = ''
      for (let a of annos.items) {
        metadata.title += a.body.value
      }
    }
    else if (p.host === 'stream.motionbank.org') {
      info = await axios.get(source.id.replace('.mp4', '.json'))
      metadata.duration = info.data.meta.ffprobe.format.duration
    }
    break
  case 'video/panopto':
    break
  default:
    throw new Error('getMetaData: unknown source type')
  }

  return metadata
}

export {
  guessType,
  getMetaData
}
