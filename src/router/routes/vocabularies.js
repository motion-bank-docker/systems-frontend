export default {
  path: '/vocabularies',
  component: () => import('layouts/default'),
  children: [
    //
    //
    // Manage Vocabularies
    {
      path: '/',
      component: () => import('pages/vocabularies/trees/list'),
      name: 'vocabularies.trees.list',
      meta: {private: true}
    }
  ]
}
