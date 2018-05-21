export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', name: 'site.welcome', component: () => import('pages/shared/site/welcome') }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/default'),
    children: [
      { path: 'callback', name: 'users.callback', component: () => import('pages/shared/users/callback') },
      { path: 'create', name: 'users.create', component: () => import('pages/shared/users/create') },
      { path: 'forgot', name: 'users.forgot', component: () => import('pages/shared/users/forgot') },
      { path: 'login', name: 'users.login', component: () => import('pages/shared/users/login') },
      { path: 'manage', name: 'users.manage', component: () => import('pages/shared/users/manage') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/shared/errors/not-found')
  }
]
