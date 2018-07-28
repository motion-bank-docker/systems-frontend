export default {
  path: '/users',
  component: () => import('layouts/default'),
  children: [
    {
      path: 'callback',
      name: 'users.callback',
      component: () => import('pages/shared/users/callback')
    },
    {
      path: 'firstlogin',
      name: 'users.firstlogin',
      component: () => import('pages/shared/users/auth0-action')
    },
    {
      path: 'resetpass',
      name: 'users.resetpass',
      component: () => import('pages/shared/users/auth0-action')
    },
    {
      path: 'create',
      name: 'users.create',
      component: () => import('pages/shared/users/create')
    },
    {
      path: 'forgot',
      name: 'users.forgot',
      component: () => import('pages/shared/users/forgot')
    },
    {
      path: 'login',
      name: 'users.login',
      component: () => import('pages/shared/users/login')
    },
    {
      path: 'manage',
      name: 'users.manage',
      component: () => import('pages/shared/users/manage')
    }
  ]
}
