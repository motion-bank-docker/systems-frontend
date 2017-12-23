import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import routes from './components/routes'

/*
function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}
*/

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    //
    // Site content
    //
    { path: '/', component: routes.site.welcome, name: 'site.welcome' },
    //
    // User management
    //
    { path: '/users/create', component: routes.users.create, name: 'users.create' },
    { path: '/users/login', component: routes.users.login, name: 'users.login' },
    { path: '/users/forgot', component: routes.users.forgot, name: 'users.forgot' },
    { path: '/users/manage', component: routes.users.manage, name: 'users.manage' },

    // Catchall
    { path: '*', component: routes.errors.notFound, name: 'errors.notFound' } // Not found
  ]
})
