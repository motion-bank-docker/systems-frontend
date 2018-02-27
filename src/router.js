import Vue from 'vue'
import VueRouter from 'vue-router'
import { Events } from 'quasar-framework'

Vue.use(VueRouter)

import store from './lib/store'
import {
  annotations,
  errors,
  maps,
  mosys,
  piecemaker,
  site,
  users
} from './components/routes'

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

  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    //
    // Site content
    //
    // { path: '/', component: site.welcome, name: 'site.welcome', meta: { animatedBackground: true } },
    { path: '/welcome', component: site.welcome, name: 'site.welcome', meta: { animatedBackground: true } },
    { path: '/terms', component: site.terms, name: 'site.terms', meta: { animatedBackground: true } },
    { path: '/apps', component: site.apps, name: 'site.apps', meta: { private: true } },
    //
    // User management
    //
    { path: '/users/create', component: users.create, name: 'users.create', meta: { anonymous: true } },
    { path: '/users/login', component: users.login, name: 'users.login', meta: { anonymous: true } },
    { path: '/users/forgot', component: users.forgot, name: 'users.forgot', meta: { anonymous: true } },
    { path: '/users/:id/edit', component: users.manage, name: 'users.edit', meta: { private: true } },

    { path: '/maps', component: maps.list, name: 'maps.list', meta: { private: true } },
    { path: '/maps/create', component: maps.create, name: 'maps.create', meta: { private: true } },
    { path: '/maps/:id/edit', component: maps.edit, name: 'maps.edit', meta: { private: true } },

    { path: '/annotations/:mapId/video', component: annotations.annotateVideo, name: 'annotate.video', meta: { private: true } },
    { path: '/annotations/:mapId/edit', component: annotations.edit, name: 'annotate.edit', meta: { private: true } },

    { path: '/mosys/dashboard', component: mosys.dashboard, name: 'mosys.dashboard', meta: { private: true } },
    { path: '/mosys/set', component: mosys.set, name: 'mosys.set', meta: { private: true } },

    { path: '/piecemaker/annotator', component: piecemaker.annotator, name: 'piecemaker.annotator', meta: { private: true } },
    { path: '/piecemaker/dashboard', component: piecemaker.dashboard, name: 'piecemaker.dashboard', meta: { private: true } },
    { path: '/piecemaker/group', component: piecemaker.group, name: 'piecemaker.group', meta: { private: true } },
    { path: '/piecemaker/list', component: piecemaker.list, name: 'piecemaker.list', meta: { private: true } },
    { path: '/piecemaker/sourcebrowser', component: piecemaker.sourcebrowser, name: 'piecemaker.sourcebrowser', meta: { private: true } },
    // Catchall
    { path: '*', component: errors.notFound, name: 'errors.notFound' }
  ]
})

router.beforeEach((to, from, next) => {
  Events.$emit('show-animated-background', to.matched.some(route => route.meta.animatedBackground))
  if (store.state.auth.payload) {
    if (to.matched.some(route => route.meta.anonymous)) {
      return next(`/users/${store.state.auth.payload.userId}/edit`)
    }
  }
  else {
    if (to.matched.some(route => route.meta.private)) {
      return next({ name: 'users.login', query: { redirect: to.fullPath } })
    }
  }
  next()
})

export default router
