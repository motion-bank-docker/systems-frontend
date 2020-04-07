import getMetaData from 'mbjs-media/src/util/get-metadata'

const ffprobeHandler = async (event, payload) => {
  let metadata
  try {
    metadata = await getMetaData(payload, undefined, {
      youtube: process.env.YOUTUBE_API_KEY,
      vimeo: process.env.VIMEO_ACCESS_TOKEN
    }, {
      ffprobePath: global.FFPROBE_PATH
    })
  }
  catch (err) {
    if (err.message.indexOf('ffprobe') > -1) {
      throw new Error(`${global.FFPROBE_PATH}: ${err.message}`)
    }
    else throw err
  }
  event.returnValue = metadata
}

export default ffprobeHandler
