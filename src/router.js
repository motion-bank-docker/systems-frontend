import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import * as pm from './components/piecemaker/routes'
import mosys from './components/mosys/routes'
import piecemaker from './components/piecemaker/routes/stash'
import administration from './components/administration/routes'
import {
  errors,
  site,
  users
} from './components/shared/routes'

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
    { path: '/', component: site.welcome, name: 'site.welcome' },
    { path: '/terms', component: site.terms, name: 'site.terms' },
    { path: '/apps', component: site.apps, name: 'site.apps', meta: { private: true } },
    //
    // User management
    //
    { path: '/users/callback', component: users.callback, name: 'users.callback' },
    { path: '/users/create', component: users.create, name: 'users.create', meta: { anonymous: true } },
    { path: '/users/login', component: users.login, name: 'users.login', meta: { anonymous: true } },
    { path: '/users/forgot', component: users.forgot, name: 'users.forgot', meta: { anonymous: true } },
    { path: '/users/:id/edit', component: users.manage, name: 'users.edit', meta: { private: true } },

    // { path: '/maps', component: maps.list, name: 'maps.list', meta: { private: true } },
    // { path: '/maps/create', component: maps.create, name: 'maps.create', meta: { private: true } },
    // { path: '/maps/:id/edit', component: maps.edit, name: 'maps.edit', meta: { private: true } },

    // { path: '/annotations/:mapId/video', component: annotations.annotateVideo, name: 'annotate.video', meta: { private: true } },
    // { path: '/annotations/:mapId/edit', component: annotations.edit, name: 'annotate.edit', meta: { private: true } },

    //
    // MoSys --------------------------------------------------------------
    //
    { path: '/mosys/grids', component: mosys.grids.list, name: 'mosys.grids.list', meta: { private: true } },
    { path: '/mosys/grids/create', component: mosys.grids.create, name: 'mosys.grids.create', meta: { private: true } },
    { path: '/mosys/grids/user', component: mosys.grids.user, name: 'mosys.grids.user', meta: { private: true } },
    { path: '/mosys/grids/:id', component: mosys.grids.show, name: 'mosys.grids.show' },
    { path: '/mosys/grids/:id/edit', component: mosys.grids.edit, name: 'mosys.grids.edit', meta: { private: true } },
    { path: '/mosys/grids/:id/annotate', component: mosys.grids.annotate, name: 'mosys.grids.annotate', meta: { private: true } },

    { path: '/mosys/dashboard', component: mosys.dashboard, name: 'mosys.dashboard', meta: { private: true } },
    { path: '/mosys/listAllPublic', component: mosys.listAllPublic, name: 'mosys.listAllPublic', meta: { private: true } },
    { path: '/mosys/listPrivate', component: mosys.listPrivate, name: 'mosys.listPrivate', meta: { private: true } },
    { path: '/mosys/listGroups', component: mosys.listGroups, name: 'mosys.listGroups', meta: { private: true } },
    { path: '/mosys/set', component: mosys.set, name: 'mosys.set', meta: { private: true } },
    { path: '/mosys/setPublic', component: mosys.setPublic, name: 'mosys.setPublic', meta: { private: true } },
    { path: '/mosys/setGridView', component: mosys.setGridView, name: 'mosys.setGridView', meta: { private: true } },
    { path: '/mosys/setListView', component: mosys.setListView, name: 'mosys.setListView', meta: { private: true } },

    // { path: '/mosys/codarts/tagging', component: mosys.codarts.tagging, name: 'mosys.codarts.tagging', meta: { private: true } },
    { path: '/mosys/codarts/sync/:groupId/:videoId', component: mosys.codarts.sync, name: 'mosys.codarts.sync', meta: { private: true } },

    //
    // Piecemaker ---------------------------------------------------------
    //
    { path: '/piecemaker', component: pm.dashboard, name: 'piecemaker.dashboard', meta: { private: true } },

    { path: '/piecemaker/groups', component: pm.groups.list, name: 'piecemaker.groups.list', meta: { private: true } },
    { path: '/piecemaker/groups/create', component: pm.groups.create, name: 'piecemaker.groups.create', meta: { private: true } },
    { path: '/piecemaker/groups/user', component: pm.groups.user, name: 'piecemaker.groups.user', meta: { private: true } },
    { path: '/piecemaker/groups/:id', component: pm.groups.show, name: 'piecemaker.groups.show' },
    { path: '/piecemaker/groups/:id/annotate', component: pm.groups.annotate, name: 'piecemaker.groups.annotate', meta: { private: true } },
    { path: '/piecemaker/groups/:groupId/videos', component: pm.videos.list, name: 'piecemaker.videos.list', meta: { private: true } },
    { path: '/piecemaker/groups/:groupId/videos/create', component: pm.videos.create, name: 'piecemaker.videos.create', meta: { private: true } },
    { path: '/piecemaker/groups/:id/edit', component: pm.groups.edit, name: 'piecemaker.groups.edit', meta: { private: true } },

    { path: '/piecemaker/videos/:id/annotate', component: pm.videos.annotate, name: 'piecemaker.videos.annotate', meta: { private: true } },
    { path: '/piecemaker/videos/:id/edit', component: pm.videos.edit, name: 'piecemaker.videos.edit', meta: { private: true } },

    // { path: '/piecemaker/users/edit', component: pm.users.edit, name: 'piecemaker.users.edit', meta: { private: false } },

    { path: '/piecemaker/annotator', component: piecemaker.annotator, name: 'piecemaker.annotator', meta: { private: true } },
    // { path: '/piecemaker/dashboard', component: piecemaker.dashboard, name: 'stash.dashboard', meta: { private: true } },
    { path: '/piecemaker/group', component: piecemaker.group, name: 'piecemaker.group', meta: { private: true } },
    { path: '/piecemaker/groupAllPublicDetail', component: piecemaker.groupAllPublicDetail, name: 'piecemaker.groupAllPublicDetail', meta: { private: true } },
    { path: '/piecemaker/groupAllPublicDetailEdit', component: piecemaker.groupAllPublicDetailEdit, name: 'piecemaker.groupAllPublicDetailEdit', meta: { private: true } },
    { path: '/piecemaker/groupGroupsDetail', component: piecemaker.groupGroupsDetail, name: 'piecemaker.groupGroupsDetail', meta: { private: true } },
    { path: '/piecemaker/list', component: piecemaker.list, name: 'piecemaker.list', meta: { private: true } },
    { path: '/piecemaker/listPrivate', component: piecemaker.listPrivate, name: 'piecemaker.listPrivate', meta: { private: true } },
    { path: '/piecemaker/listVideos', component: piecemaker.listVideos, name: 'piecemaker.listVideos', meta: { private: true } },
    { path: '/piecemaker/listGroups', component: piecemaker.listGroups, name: 'piecemaker.listGroups', meta: { private: true } },
    { path: '/piecemaker/listAllPublic', component: piecemaker.listAllPublic, name: 'piecemaker.listAllPublic', meta: { private: true } },
    { path: '/piecemaker/groupPrivateDetail', component: piecemaker.groupPrivateDetail, name: 'piecemaker.groupPrivateDetail', meta: { private: true } },
    { path: '/piecemaker/sourcebrowser', component: piecemaker.sourcebrowser, name: 'piecemaker.sourcebrowser', meta: { private: true } },
    { path: '/piecemaker/VideoDetail', component: piecemaker.VideoDetail, name: 'piecemaker.VideoDetail', meta: { private: true } },

    { path: '/piecemaker/codarts/:groupId/annotate', component: pm.codarts.liveAnnotation, name: 'piecemaker.codarts.live-annotation', meta: { private: true } },

    { path: '/administration/users', component: administration.users, name: 'administration.users', meta: { private: false } },

    // Catchall
    // { path: '*', component: errors.notFound, name: 'errors.notFound' }
    { path: '*', component: errors.notFound, name: 'site.welcome' }
  ]
})

router.beforeEach((to, from, next) => {
  let payload
  try { payload = router.app.$mbAuth().isAuthenticated(router.app.$store) }
  catch (e) { console.debug('Route auth fail:', e) }

  if (to.matched.some(route => route.meta.anonymous)) {
    if (payload) {
      return next({
        name: 'users.edit',
        params: {
          id: 'me'
        },
        replace: true
      })
    }
    next()
  }
  if (to.matched.some(route => route.meta.private)) {
    if (!payload) {
      return next({
        name: 'users.login',
        query: {redirect: to.fullPath},
        replace: true
      })
    }
    next()
  }
  else {
    next()
  }
})

export default router
