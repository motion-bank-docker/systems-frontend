const
  frontendURL = require('./app').config.hosts.frontend,
  env = process.env

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
          domain: env.AUTH0_DOMAIN || 'motionbank.eu.auth0.com',
          clientID: env.AUTH0_CLIENT_ID || 'lyVRrHYxUCOosFip40Ws5BRJyfHWSWTi',
          clientSecret: env.AUTH0_CLIENT_SECRET || 'cTJ7wxsxzWC2lqZKcg5gv5Hng2DWvDf3e0txRUrLgp2GRxr2kiiCRgvhfq1kbEW8',
          audience: env.AUTH0_AUDIENCE || 'https://motionbank.eu.auth0.com/userinfo',
          redirectUri: !env.AUTH0_NO_REDIRECT ? (frontendURL + '/users/callback') : undefined,
          scope: env.AUTH0_INIT_SCOPE || 'offline_access openid profile email',
          responseType: env.AUTH0_RESPONSE_TYPE || 'token id_token'
        },
        /**
         * Feathers
         * */
        feathers: {
          storageKey: env.FEATHERS_STORAGE_KEY,
          jwtStrategy: env.FEATHERS_JWT_STRATEGY
        },
        /**
         * Local
         */
        local: {
          // TODO: storage should become configurable (nedb, memory, localforage, ...)
          storageKey: env.LOCAL_STORAGE_KEY,
          jwtStrategy: env.LOCAL_JWT_STRATEGY
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
          cache: !env.JWT_NO_CACHE,
          rateLimit: !env.JWT_NO_RATE_LIMIT,
          jwksRequestsPerMinute: parseInt(env.JWT_JWKS_PER_MIN || 5),
          jwksUri: env.JWT_JWKS_URI || 'https://motionbank.eu.auth0.com/.well-known/jwks.json'
        }
      }
    }
  }
}

const { config } = Auth()
module.exports = { config }
