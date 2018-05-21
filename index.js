const
  StaticServer = require('static-server'),
  pkg = require('./package.json')

const server = new StaticServer({
  rootPath: './dist/spa-mat',
  port: process.env.PORT || 9090,
  name: pkg.name,
  host: process.env.HOST,
  cors: '*',
  followSymlink: true, // optional, defaults to a 404 error
  templates: {
    index: 'index.html',
    notFound: 'index.html'
  }
})

server.start(() => {
  process.stdout.write(`${pkg.productName} listening on ${server.host || '*'}:${server.port}\n`)
})
