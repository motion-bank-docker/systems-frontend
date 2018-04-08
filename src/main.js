require(`./themes/app.${__THEME}.styl`)

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar, {
  AddressbarColor
} from 'quasar-framework'

import 'quasar-extras/material-icons'
import AsyncComputed from 'vue-async-computed'

import MBConf from './mb-conf'
import MBAuth from './lib/services/mb-auth'
import { setupStore } from './lib/store'

import router from './router'
import i18n from './lib/locales'
import services from './lib/services'

import AirbrakeClient from 'airbrake-js'

/** Airbrake for detecting exceptions and errors **/
if (process.env.USE_AIRBRAKE) {
  const airbrake = new AirbrakeClient({
    projectId: process.env.AIRBRAKE_PROJECT_ID,
    projectKey: process.env.AIRBRAKE_API_KEY
  })
  console.debug('Airbrake has been set up.', (airbrake))
}

Vue.config.productionTip = false
AddressbarColor.set('#252324')

Vue.use(Quasar)
Vue.use(AsyncComputed)
Vue.use(MBConf)
Vue.use(MBAuth)

Vue.component('mb-notification-service', services.notifications)

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}

const store = setupStore(Vue)

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
