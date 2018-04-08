const
  StaticServer = require('static-server'),
  pkg = require('./package.json')

const server = new StaticServer({
  rootPath: './dist',
  port: process.env.PORT || 9080,
  name: pkg.name,
  host: process.env.HOST
  /*
  cors: '*',
  followSymlink: true, // optional, defaults to a 404 error
  templates: {
    index: 'index.html',
    notFound: '404.html'
  }
  */
})

server.start(() => {
  process.stdout.write(`${pkg.productName} listening on ${server.host || '*'}:${server.port}\n`)
})
