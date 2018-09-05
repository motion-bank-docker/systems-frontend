export default {
  path: '/mocabulary',
  component: () => import('layouts/default'),
  children: [
    //
    //
    // Manage Mocabulary
    {
      path: '/',
      component: () => import('pages/mocabulary/trees/list'),
      name: 'mocabulary.trees.list',
      meta: {private: true}
    }
  ]
}
