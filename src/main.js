require(`./themes/app.${__THEME}.styl`)

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'

import primus from './lib/clients/primus'

import store from './lib/store'
import i18n from './lib/locales'

import { user, notification } from './lib/services'

Vue.component('mb-user-service', user)
Vue.component('mb-notification-service', notification)

Quasar.start(() => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(route => route.meta.auth)) {
      if (!store.state.auth.user) {
        store.commit('auth/redirect', to)
        return next({ name: 'users.login' })
      }
    }
    else if (to.matched.some(route => route.meta.noAuth)) {
      if (store.state.auth.user) {
        return next({ name: 'users.profile' })
      }
    }
    next()
  })
  /* eslint-disable no-new */
  const vm = new Vue({
    el: '#q-app',
    i18n,
    store,
    router,
    render: h => h(require('./App').default)
  })
  primus(vm)
})
