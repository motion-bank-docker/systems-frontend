import URL from 'url'

const parseURI = uri => {
  const
    parsed = URL.parse(uri),
    splitpath = parsed.pathname.split('/')
  return {
    host: parsed.host,
    protocol: parsed.protocol,
    path: parsed.pathname,
    uuid: splitpath[splitpath.length - 1]
  }
}

export default parseURI
