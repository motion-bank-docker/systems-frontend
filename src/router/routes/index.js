import mosys from './mosys'
import site from './site'
import users from './users'

export default [
  mosys,
  site,
  users,

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/shared/errors/not-found')
  }
]
