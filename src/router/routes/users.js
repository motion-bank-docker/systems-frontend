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
      path: 'manage',
      name: 'users.manage',
      component: () => import('pages/shared/users/manage'),
      meta: {private: true}
    },
    {
      path: 'groups/create',
      name: 'users.groups_create',
      component: () => import('pages/shared/users/group_edit'),
      meta: {private: true}
    },
    {
      path: 'groups/:uuid/edit',
      name: 'users.groups_edit',
      component: () => import('pages/shared/users/group_edit'),
      meta: {private: true}
    },
    {
      path: 'invite',
      name: 'users.invite',
      component: () => import('pages/shared/users/invite'),
      meta: {private: true}
    }
  ]
}
