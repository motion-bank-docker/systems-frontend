const getVideoMetadata = async function (context, annotation) {
  let videoMeta, videoTitle
  try {
    videoMeta = await context.$store.dispatch('metadata/get', annotation)
  }
  catch (e) {
    context.$captureException(e)
    videoMeta = {}
  }
  try {
    const results = await context.$store.dispatch('annotations/find', {
      'target.id': annotation.id,
      'body.purpose': 'describing',
      'body.type': 'TextualBody'
    })
    videoTitle = results && results.items && results.items.length ? results.items[0].body.value : undefined
  }
  catch (e) {
    context.$captureException(e)
  }
  videoMeta.title = videoTitle || videoMeta.title
  return videoMeta
}

export default getVideoMetadata
