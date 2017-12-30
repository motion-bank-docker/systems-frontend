require(`./themes/app.${__THEME}.styl`)

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar-framework'
import router from './router'

Vue.config.productionTip = false
Vue.use(Quasar)

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/animate'

import store from './lib/store'
import i18n from './lib/locales'

import services from './lib/services'
const logger = new services.logging.Logger(services.logging.levels.DEBUG)

Vue.component('mb-notification-service', services.notification)

Quasar.start(() => {
  router.beforeEach((to, from, next) => {
    if (store.state.auth.user) {
      logger.debug(`Current user ID: ${store.state.auth.user.userId}`, 'router.beforeEach')
    }
    if (to.matched.some(route => route.meta.auth)) {
      logger.debug(`Need auth at ${to.fullPath}`, 'router.beforeEach')
      if (!store.state.auth.user) {
        logger.debug(`Redirect to users.login`, 'router.beforeEach')
        store.commit('auth/redirect', to)
        return next({ name: 'users.login' })
      }
    }
    else if (to.matched.some(route => route.meta.noAuth)) {
      logger.debug(`Need anon at ${to.fullPath}`, 'router.beforeEach')
      if (store.state.auth.user) {
        logger.debug(`Redirect to users.manage`, 'router.beforeEach')
        return next({ name: 'users.manage' })
      }
    }
    next()
  })
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    i18n,
    store,
    router,
    render: h => h(require('./App').default)
  })
})
