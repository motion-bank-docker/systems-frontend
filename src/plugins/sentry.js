import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

export default ({ Vue }) => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [new Integrations.Vue({Vue, attachProps: true})]
    })
  }
  Vue.prototype.$captureException = function (err) {
    if (process.env.SENTRY_DSN) Sentry.captureException(err)
    else {
      console.error(`Exception: ${err.message}`)
      console.debug('Stack:', err.stack)
    }
  }
}
