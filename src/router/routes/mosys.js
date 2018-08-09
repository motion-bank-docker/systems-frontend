export default {
  path: '/mosys',
  component: () => import('layouts/default'),
  children: [
    //
    //
    // Manage Grids
    {
      path: 'grids',
      component: () => import('pages/mosys/grids/list'),
      name: 'mosys.grids.list',
      meta: {private: true}
    },
    {
      path: 'grids/create',
      component: () => import('pages/mosys/grids/create'),
      name: 'mosys.grids.create',
      meta: {private: true}
    },
    {
      path: 'grids/:id',
      component: () => import('pages/mosys/grids/show'),
      name: 'mosys.grids.show'
    },
    {
      path: 'grids/:id/edit',
      component: () => import('pages/mosys/grids/edit'),
      name: 'mosys.grids.edit',
      meta: {private: true}
    },
    {
      path: 'grids/:id/annotate',
      component: () => import('pages/mosys/grids/annotate'),
      name: 'mosys.grids.annotate',
      meta: {private: true}
    }

    //
    //
    // Codarts
    /*
    {
      path: '/mosys/codarts/tagging',
      component: () => import('pages/mosys/codarts/tagging'),
      name: 'mosys.codarts.tagging',
      meta: {private: true}
    },
    */
  ]
}
