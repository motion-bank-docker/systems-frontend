import Vue from 'vue'
import VueRouter from 'vue-router'
import { Events } from 'quasar-framework'

Vue.use(VueRouter)

import store from './lib/store'
import * as pm from './components/piecemaker/routes'
import mosys from './components/mosys/routes'
import piecemaker from './components/piecemaker/routes/stash'
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
    { path: '/', component: site.welcome, name: 'site.welcome', meta: { animatedBackground: false } },
    { path: '/terms', component: site.terms, name: 'site.terms', meta: { animatedBackground: true } },
    { path: '/apps', component: site.apps, name: 'site.apps', meta: { private: true } },
    //
    // User management
    //
    { path: '/users/create', component: users.create, name: 'users.create', meta: { anonymous: true } },
    { path: '/users/login', component: users.login, name: 'users.login', meta: { anonymous: true } },
    { path: '/users/forgot', component: users.forgot, name: 'users.forgot', meta: { anonymous: true } },
    { path: '/users/:id/edit', component: users.manage, name: 'users.edit', meta: { private: true } },

    // { path: '/maps', component: maps.list, name: 'maps.list', meta: { private: true } },
    // { path: '/maps/create', component: maps.create, name: 'maps.create', meta: { private: true } },
    // { path: '/maps/:id/edit', component: maps.edit, name: 'maps.edit', meta: { private: true } },

    // { path: '/annotations/:mapId/video', component: annotations.annotateVideo, name: 'annotate.video', meta: { private: true } },
    // { path: '/annotations/:mapId/edit', component: annotations.edit, name: 'annotate.edit', meta: { private: true } },

    { path: '/mosys/dashboard', component: mosys.dashboard, name: 'mosys.dashboard', meta: { private: true } },
    { path: '/mosys/listAllPublic', component: mosys.listAllPublic, name: 'mosys.listAllPublic', meta: { private: true } },
    { path: '/mosys/listPrivate', component: mosys.listPrivate, name: 'mosys.listPrivate', meta: { private: true } },
    { path: '/mosys/listGroups', component: mosys.listGroups, name: 'mosys.listGroups', meta: { private: true } },
    { path: '/mosys/set', component: mosys.set, name: 'mosys.set', meta: { private: true } },
    { path: '/mosys/setPublic', component: mosys.setPublic, name: 'mosys.setPublic', meta: { private: true } },
    { path: '/mosys/setGridView', component: mosys.setGridView, name: 'mosys.setGridView', meta: { private: true } },
    { path: '/mosys/setListView', component: mosys.setListView, name: 'mosys.setListView', meta: { private: true } },

    //
    // Piecemaker
    //
    { path: '/piecemaker', component: pm.dashboard, name: 'piecemaker.dashboard', meta: { private: true } },

    { path: '/piecemaker/groups', component: pm.groups.list, name: 'piecemaker.groups.list', meta: { private: true } },
    { path: '/piecemaker/groups/create', component: pm.groups.create, name: 'piecemaker.groups.create', meta: { private: true } },
    { path: '/piecemaker/groups/:id', component: pm.groups.show, name: 'piecemaker.groups.show' },
    { path: '/piecemaker/groups/:groupId/videos', component: pm.videos.list, name: 'piecemaker.videos.list', meta: { private: true } },
    { path: '/piecemaker/groups/:groupId/videos/create', component: pm.videos.create, name: 'piecemaker.videos.create', meta: { private: true } },
    { path: '/piecemaker/groups/:id/edit', component: pm.groups.edit, name: 'piecemaker.groups.edit', meta: { private: true } },

    { path: '/piecemaker/videos/:id/annotate', component: pm.videos.annotate, name: 'piecemaker.videos.annotate', meta: { private: true } },
    { path: '/piecemaker/videos/:id/edit', component: pm.videos.edit, name: 'piecemaker.videos.edit', meta: { private: true } },

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
