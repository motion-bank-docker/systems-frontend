const app = require('./app').config
/**
 * AUTHENTICATION
 * Configures client & server auth
 */
const Auth = function () {
  /** Config getter */
  return {
    config: {
      /**
       * Client-side
       * authentication
       */
      client: {
        /**
         *  Auth0
         */
        auth0: {
          domain: process.env.AUTH0_DOMAIN || 'motionbank.eu.auth0.com',
          clientID: process.env.AUTH0_CLIENT_ID || 'lyVRrHYxUCOosFip40Ws5BRJyfHWSWTi',
          audience: process.env.AUTH0_AUDIENCE || 'https://motionbank.eu.auth0.com/userinfo',
          redirectUri: !process.env.AUTH0_NO_REDIRECT ? (app.hosts.frontend + '/users/callback') : undefined,
          scope: process.env.AUTH0_INIT_SCOPE || 'openid profile email',
          responseType: process.env.AUTH0_RESPONSE_TYPE || 'token id_token'
        },
        /**
         * Feathers
         * */
        feathers: {
          storageKey: process.env.FEATHERS_STORAGE_KEY || 'id_token',
          jwtStrategy: process.env.FEATHERS_JWT_STRATEGY || 'jwt'
        },
        /**
         * Local
         */
        local: {
          // TODO: storage should become configurable (nedb, memory, localforage, ...)
          storageKey: process.env.LOCAL_STORAGE_KEY || 'motionbank-jwt',
          jwtStrategy: process.env.LOCAL_JWT_STRATEGY || 'jwt'
        }
      },
      /**
       * Server-side
       * authentication
       */
      server: {
        /**
         * JWT
         */
        jwt: {
          cache: !process.env.JWT_NO_CACHE,
          rateLimit: !process.env.JWT_NO_RATE_LIMIT,
          jwksRequestsPerMinute: parseInt(process.env.JWT_JWKS_PER_MIN || 5),
          jwksUri: process.env.JWT_JWKS_URI || 'https://motionbank.eu.auth0.com/.well-known/jwks.json'
        }
      }
    }
  }
}

const { config } = Auth()
module.exports = { config }
