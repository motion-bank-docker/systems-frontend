import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export default ({ Vue }) => {
  if (process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).addPlugin(RavenVue, Vue).install()
  }
}
