export default {
  path: '/',
  component: () => import('layouts/default'),
  children: [
    {
      path: '',
      name: 'site.welcome',
      component: () => import('pages/shared/site/welcome')
    }, {
      path: '/account',
      component: () => import('pages/shared/site/account'),
      name: 'site.account',
      meta: {private: true}
    }, {
      path: '/help',
      component: () => import('pages/shared/site/help'),
      name: 'site.help',
      meta: {private: true}
    }, {
      path: '/imprint',
      component: () => import('pages/shared/site/imprint'),
      name: 'site.imprint'
    }
  ]
}
