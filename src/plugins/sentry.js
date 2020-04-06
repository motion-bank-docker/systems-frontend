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
    if (process.env.SENTRY_DSN) {
      // Ignore ResizeObserver-related errors
      // see: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
      if (err.message && err.message.indexOf('ResizeObserver') > -1) return
      Sentry.captureException(err)
    }
    else {
      console.error(`Exception: ${err.message}`)
      console.debug('Stack:', err.stack)
    }
  }
}
