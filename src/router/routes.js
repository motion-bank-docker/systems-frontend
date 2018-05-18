import site from './routes/site'
import users from './routes/users'

export default [
  site,
  users,

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/shared/errors/not-found')
  }
]
