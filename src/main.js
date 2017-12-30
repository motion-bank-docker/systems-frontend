require(`./themes/app.${__THEME}.styl`)

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar, {
  AddressbarColor
} from 'quasar-framework'

Vue.config.productionTip = false
Vue.use(Quasar)

AddressbarColor.set('#252324')

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/animate'

import router from './router'
import store from './lib/store'
import i18n from './lib/locales'
import services from './lib/services'

Vue.component('mb-notification-service', services.notification)

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    i18n,
    store,
    router,
    render: h => h(require('./App').default)
  })
})
