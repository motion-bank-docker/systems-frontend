export default {
  path: '/assets',
  component: () => import('layouts/default'),
  children: [
    {
      path: '/list',
      component: () => import('pages/assets/list'),
      name: 'assets.list',
      meta: {private: true, feature: 'assets'}
    },
    {
      path: '/create',
      component: () => import('pages/assets/create'),
      name: 'assets.create',
      meta: {private: true, feature: 'assets'}
    },
    {
      path: '/edit',
      component: () => import('pages/assets/edit'),
      name: 'assets.edit',
      meta: {private: true, feature: 'assets'}
    }
  ]
}
