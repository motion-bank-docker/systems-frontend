import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export default ({ Vue }) => {
  if (process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).addPlugin(RavenVue, Vue).install()
  }
  Vue.prototype.$captureException = function (err) {
    if (process.env.SENTRY_DSN) Raven.captureException(err)
    else {
      console.error(`Exception: ${err.message}`)
      console.debug('Stack:', err.stack)
    }
  }
}
