import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { userHasFeature } from 'mbjs-quasar/src/lib'

import * as Sentry from '@sentry/browser'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

Router.beforeEach((to, from, next) => {
  const waitForStore = (app, cb) => {
    if (typeof app.$store === 'undefined') setTimeout(() => waitForStore(app, cb), 0)
    else cb()
  }
  waitForStore(Router.app, () => {
    if (to.name === 'users.callback') return next()
    const redirectPath = Router.app.$store.state.auth.redirectTo
    if (redirectPath) Router.app.$store.commit('auth/clearRedirect')
    Router.app.$auth.checkSession(Router.app.$store).catch(() => {
      if (to.meta.private) {
        Router.app.$store.commit('auth/setRedirect', to.fullPath)
        Router.app.$auth.authenticate()
      }
    }).then(result => {
      if (result) {
        const { user, first } = result
        if (process.env.SENTRY_DSN) {
          Sentry.setUser({ id: user.id, username: user.profile ? user.profile.name : undefined })
        }
        if (first) {
          console.debug('Auth0 first login', user)
          next({ name: 'users.manage', params: { isFirst: true, redirect: redirectPath || to } })
        }
        else {
          if (to.meta.feature) {
            if (userHasFeature(Router.app.$store.state.auth.user, to.meta.feature)) next(redirectPath)
            else next({ name: 'site.welcome' })
          }
          next(redirectPath)
        }
      }
      else if (to.meta.private) {
        if (process.env.IS_ELECTRON) next()
        else {
          Router.app.$store.commit('auth/setRedirect', to.fullPath)
          Router.app.$auth.authenticate()
        }
      }
      else next(redirectPath)
    }).catch(err => {
      Router.app.$captureException(err)
      Router.app.$auth.logout()
    })
  })
})

export default Router
