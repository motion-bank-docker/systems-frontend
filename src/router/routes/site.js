export default {
  path: '/',
  component: () => import('layouts/default'),
  children: [
    { path: '', name: 'site.welcome', component: () => import('pages/shared/site/welcome') }
  ]
}
