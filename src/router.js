import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import routes from './components/routes'
import store from './lib/store'

/*
function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}
*/

const router = new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T work for Cordova builds,
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
    { path: '/users/create', component: routes.users.create, name: 'users.create', meta: { anonymous: true } },
    { path: '/users/login', component: routes.users.login, name: 'users.login', meta: { anonymous: true } },
    { path: '/users/forgot', component: routes.users.forgot, name: 'users.forgot', meta: { anonymous: true } },
    { path: '/users/manage', component: routes.users.manage, name: 'users.manage', meta: { private: true } },

    // Catchall
    { path: '*', component: routes.errors.notFound, name: 'errors.notFound' } // Not found
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.private && !store.state.auth.payload)) {
    return next({
      name: 'users.login',
      query: {
        redirect: to.fullPath
      }
    })
  }
  if (to.matched.some(record => record.meta.anonymous && store.state.auth.payload)) {
    return next({
      name: 'users.manage'
    })
  }
  next()
})

export default router
