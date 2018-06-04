export default {
  path: '/',
  component: () => import('layouts/default'),
  children: [
    {
      path: '',
      name: 'site.welcome',
      component: () => import('pages/shared/site/welcome')
    }, {
      path: '/help',
      component: () => import('pages/shared/site/help'),
      name: 'site.help',
      meta: {private: true}
    }
  ]
}
