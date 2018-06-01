export default {
  path: '/piecemaker',
  component: () => import('layouts/default'),
  children: [
    {
      path: '/piecemaker',
      component: () => import('pages/piecemaker/dashboard'),
      name: 'piecemaker.dashboard',
      meta: {private: true}
    },

    {
      path: '/piecemaker/groups',
      component: () => import('pages/piecemaker/groups/list'),
      name: 'piecemaker.groups.list',
      meta: {private: true}
    },
    {
      path: '/piecemaker/groups/create',
      component: () => import('pages/piecemaker/groups/create'),
      name: 'piecemaker.groups.create',
      meta: {private: true}
    },
    {
      path: '/piecemaker/groups/user',
      component: () => import('pages/piecemaker/groups/user'),
      name: 'piecemaker.groups.user',
      meta: {private: true}
    },
    {
      path: '/piecemaker/groups/:id',
      component: () => import('pages/piecemaker/groups/show'),
      name: 'piecemaker.groups.show'
    },
    {
      path: '/piecemaker/groups/:id/annotate',
      component: () => import('pages/piecemaker/groups/annotate'),
      name: 'piecemaker.groups.annotate',
      meta: {private: true}
    },
    {
      path: '/piecemaker/groups/:groupId/videos',
      component: () => import('pages/piecemaker/videos/list'),
      name: 'piecemaker.videos.list',
      meta: {private: true}
    },
    {
      path: '/piecemaker/groups/:groupId/videos/create',
      component: () => import('pages/piecemaker/videos/create'),
      name: 'piecemaker.videos.create',
      meta: {private: true}
    },
    {
      path: '/piecemaker/groups/:id/edit',
      component: () => import('pages/piecemaker/groups/edit'),
      name: 'piecemaker.groups.edit',
      meta: {private: true}
    },

    {
      path: '/piecemaker/videos/:id/annotate',
      component: () => import('pages/piecemaker/videos/annotate'),
      name: 'piecemaker.videos.annotate',
      meta: {private: true}
    },
    {
      path: '/piecemaker/videos/:id/edit',
      component: () => import('pages/piecemaker/videos/edit'),
      name: 'piecemaker.videos.edit',
      meta: {private: true}
    },
    {
      path: '/piecemaker/videos/session',
      component: () => import('pages/piecemaker/videos/session'),
      name: 'piecemaker.videos.edit',
      meta: {private: true}
    }
  ]
}
