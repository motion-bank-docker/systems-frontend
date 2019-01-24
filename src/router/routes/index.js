import assets from './assets'
import mocabulary from './mocabulary'
import mosys from './mosys'
import piecemaker from './piecemaker'
import site from './site'
import users from './users'

export default [
  assets,
  mocabulary,
  mosys,
  piecemaker,
  site,
  users,

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/shared/errors/not-found')
  }
]
