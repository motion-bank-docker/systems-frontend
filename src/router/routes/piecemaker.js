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
      path: '/piecemaker/timelines/user',
      component: () => import('pages/piecemaker/timelines/user'),
      name: 'piecemaker.timelines.user',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/timecode',
      component: () => import('pages/piecemaker/timelines/timecode'),
      name: 'piecemaker.timelines.timecode',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:id/sessions',
      component: () => import('pages/piecemaker/timelines/sessions'),
      name: 'piecemaker.timelines.sessions',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:id',
      component: () => import('pages/piecemaker/timelines/swimlanes'),
      name: 'piecemaker.timelines.show',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:id/annotate',
      component: () => import('pages/piecemaker/timelines/annotate'),
      name: 'piecemaker.timelines.annotate',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:id/search',
      component: () => import('pages/piecemaker/timelines/search'),
      name: 'piecemaker.timelines.search',
      meta: {private: true, feature: 'search'}
    },
    {
      path: '/piecemaker/timelines/:timelineId/videos',
      component: () => import('pages/piecemaker/videos/list'),
      name: 'piecemaker.videos.list',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:timelineId/videos/create',
      component: () => import('pages/piecemaker/videos/create'),
      name: 'piecemaker.videos.create',
      meta: {private: true}
    },
    {
      path: '/piecemaker/timelines/:id/edit',
      component: () => import('pages/piecemaker/timelines/edit'),
      name: 'piecemaker.timelines.edit',
      meta: {private: true}
    },

    {
      path: '/piecemaker/videos/ingest',
      component: () => import('pages/piecemaker/videos/ingest'),
      name: 'piecemaker.videos.ingest',
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
      path: '/piecemaker/videos/:id/sync',
      component: () => import('pages/piecemaker/videos/sync'),
      name: 'piecemaker.videos.sync',
      meta: {private: true}
    }
  ]
}
