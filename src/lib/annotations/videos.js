import URL from 'url'
import path from 'path'

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

export {
  guessType
}
