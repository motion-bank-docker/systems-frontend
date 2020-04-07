import documents from './documents'
import vocabularies from './vocabularies'
import mosys from './mosys'
import piecemaker from './piecemaker'
import site from './site'
import users from './users'

export default [
  documents,
  vocabularies,
  mosys,
  piecemaker,
  site,
  users,

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/shared/errors/not-found')
  }
]
