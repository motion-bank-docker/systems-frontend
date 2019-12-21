export default {
  path: '/piecemaker',
  component: () => import('layouts/default'),
  children: [
    {
      path: '/piecemaker',
      redirect: {name: 'piecemaker.timelines.list'}
    },

    {
      path: '/piecemaker/timelines',
      component: () => import('pages/piecemaker/timelines/list'),
      name: 'piecemaker.timelines.list',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/create',
      component: () => import('pages/piecemaker/timelines/create'),
      name: 'piecemaker.timelines.create',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:uuid/sessions',
      component: () => import('pages/piecemaker/timelines/sessions'),
      name: 'piecemaker.timelines.sessions',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:uuid/annotate',
      component: () => import('pages/piecemaker/timelines/annotate'),
      name: 'piecemaker.timelines.annotate',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:uuid/search',
      component: () => import('pages/piecemaker/timelines/search'),
      name: 'piecemaker.timelines.search',
      meta: {private: true, feature: 'search'}
    },
    {
      path: '/piecemaker/timelines/:timelineUuid',
      redirect: { name: 'piecemaker.media.list' }
    },
    {
      path: '/piecemaker/timelines/:timelineUuid/media',
      component: () => import('pages/piecemaker/media/list'),
      name: 'piecemaker.media.list',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:timelineUuid/media/create',
      component: () => import('pages/piecemaker/media/create'),
      name: 'piecemaker.media.create',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:uuid/edit',
      component: () => import('pages/piecemaker/timelines/edit'),
      name: 'piecemaker.timelines.edit',
      meta: {private: true}
    },

    {
      path: '/piecemaker/media/:uuid/annotate',
      component: () => import('pages/piecemaker/media/annotate'),
      name: 'piecemaker.media.annotate',
      meta: {private: true}
    },
    {
      path: '/piecemaker/media/:id/annotations-index',
      component: () => import('pages/piecemaker/media/annotations-index'),
      name: 'piecemaker.media.index',
      meta: {private: true}
    },
    {
      path: '/piecemaker/media/:uuid/edit',
      component: () => import('pages/piecemaker/media/edit'),
      name: 'piecemaker.media.edit',
      meta: {private: true}
    },
    {
      path: '/piecemaker/media/:uuid/sync',
      component: () => import('pages/piecemaker/media/sync'),
      name: 'piecemaker.media.sync',
      meta: {private: true}
    }
  ]
}
