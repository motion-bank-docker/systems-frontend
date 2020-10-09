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
      path: 'manage/create',
      name: 'users.create',
      component: () => import('pages/shared/users/admin'),
      meta: {private: true}
    },
    {
      path: 'manage/:id',
      name: 'users.admin',
      component: () => import('pages/shared/users/admin'),
      meta: {private: true}
    },
    {
      path: 'list',
      name: 'users.list',
      component: () => import('pages/shared/users/list'),
      meta: {private: true}
    },
    {
      path: 'groups',
      name: 'users.groups',
      component: () => import('pages/shared/users/groups_list'),
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
      path: 'invite/:code',
      name: 'users.invite',
      component: () => import('pages/shared/users/invite'),
      meta: {private: true}
    },
    {
      path: 'assets',
      name: 'users.assets',
      component: () => import('pages/shared/users/assets'),
      meta: {private: true}
    },
    {
      path: 'assets/upload',
      name: 'users.assets_upload',
      component: () => import('pages/shared/users/assets_upload'),
      meta: {private: true}
    }
  ]
}
