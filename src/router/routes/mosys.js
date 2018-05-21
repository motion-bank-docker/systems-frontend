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
      path: 'grids/user',
      component: () => import('pages/mosys/grids/user'),
      name: 'mosys.grids.user',
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
    },
    //
    //
    // Overview
    {
      path: 'dashboard',
      component: () => import('pages/mosys/dashboard'),
      name: 'mosys.dashboard',
      meta: {private: true}
    },
    {
      path: 'listAllPublic',
      component: () => import('pages/mosys/listAllPublic'),
      name: 'mosys.listAllPublic',
      meta: {private: true}
    },
    {
      path: 'listPrivate',
      component: () => import('pages/mosys/listPrivate'),
      name: 'mosys.listPrivate',
      meta: {private: true}
    },
    {
      path: 'listGroups',
      component: () => import('pages/mosys/listGroups'),
      name: 'mosys.listGroups',
      meta: {private: true}
    },
    //
    //
    // Set
    {
      path: 'set',
      component: () => import('pages/mosys/Set'),
      name: 'mosys.set',
      meta: {private: true}
    },
    {
      path: 'setPublic',
      component: () => import('pages/mosys/setPublic'),
      name: 'mosys.setPublic',
      meta: {private: true}
    },
    {
      path: 'setGridView',
      component: () => import('pages/mosys/setGridView'),
      name: 'mosys.setGridView',
      meta: {private: true}
    },
    {
      path: 'setListView',
      component: () => import('pages/mosys/setListView'),
      name: 'mosys.setListView',
      meta: {private: true}
    },

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
    {
      path: '/mosys/codarts/sync/:groupId/:videoId',
      component: () => import('pages/mosys/codarts/sync'),
      name: 'mosys.codarts.sync',
      meta: {private: true}
    }
  ]
}
