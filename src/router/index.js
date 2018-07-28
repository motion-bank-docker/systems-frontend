import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

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
    if (app.$store === undefined) setTimeout(() => waitForStore(app, cb), 0)
    else cb()
  }
  waitForStore(Router.app, () => {
    if (!Router.app.$store.state.user && to.meta.private) {
      Router.app.$auth.once('auth-state', user => {
        console.debug('Auth0 state change', Router.app.$auth.hasScope('openid'))
        Router.app.$store.dispatch('profiles/get', user.uuid).then(profile => {
          user.profile = profile
          Router.app.$store.commit('auth/setUser', user)
          next()
        }).catch(err => {
          console.debug('router: unable to fetch user profile', err.message)
          const profile = {
            user: user.uuid,
            name: user.name.indexOf('@') !== -1 ? user.nickname || '' : user.name
          }
          Router.app.$store.dispatch('profiles/post', profile).then(() => {
            next({ name: 'users.manage', params: { isFirst: true, redirect: to } })
          })
        })
      })
      Router.app.$auth.checkSession().catch(() => {
        Router.app.$store.commit('auth/setRedirect', to)
        Router.app.$auth.authenticate()
      })
    }
    else next()
  })
})

export default Router
