const
  app = require('./app').config,
  auth = require('./auth').config,
  scopes = require('./scopes').config,
  webpack = require('./webpack').config

/**
 * Main Configuration Hub
 *
 * everything configurable should
 * eventually can go in here,
 * bundled in sub-files.
 */
const config = {
  app,
  auth,
  scopes,
  webpack
}
module.exports = config
