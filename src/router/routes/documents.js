export default {
  path: '/documents',
  component: () => import('layouts/default'),
  children: [
    {
      path: 'list',
      component: () => import('pages/documents/list'),
      name: 'documents.list',
      meta: {private: true, feature: 'documents'}
    },
    {
      path: 'create',
      component: () => import('pages/documents/create'),
      name: 'documents.create',
      meta: {private: true, feature: 'documents'}
    },
    {
      path: 'edit',
      component: () => import('pages/documents/edit'),
      name: 'documents.edit',
      meta: {private: true, feature: 'documents'}
    }
  ]
}
