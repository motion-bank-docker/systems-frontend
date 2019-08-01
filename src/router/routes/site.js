export default {
  path: '/',
  component: () => import('layouts/default'),
  children: [
    {
      path: '',
      name: 'site.welcome',
      component: () => import('pages/shared/site/welcome')
    },
    {
      path: '/help',
      component: () => import('pages/shared/site/help'),
      name: 'site.help',
      meta: {private: true}
    },
    {
      path: '/imprint',
      component: () => import('pages/shared/site/imprint'),
      name: 'site.imprint'
    },
    {
      path: '/contact',
      component: () => import('pages/shared/site/contact'),
      name: 'site.contact'
    },
    {
      path: '/terms',
      component: () => import('pages/shared/site/terms'),
      name: 'site.terms'
    }
  ]
}
