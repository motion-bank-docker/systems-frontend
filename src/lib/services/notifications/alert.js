import { Alert } from 'quasar-framework'
import assignDeep from 'assign-deep'

import 'quasar-extras/animate/bounceInDown.css'
import 'quasar-extras/animate/bounceOutUp.css'

function alert (msg, type = null, opts = {}) {
  const alert = assignDeep({
    enter: 'bounceInDown',
    leave: 'bounceOutUp',
    color: 'faded',
    html: msg,
    position: 'top-center'
  }, opts)
  switch (type) {
    case 'success':
      alert.icon = alert.icon || 'done'
      alert.color = 'positive'
      return Alert.create(alert)
    case 'error':
      alert.icon = alert.icon || 'error'
      alert.color = 'negative'
      return Alert.create(alert)
    case 'warn':
      alert.icon = alert.icon || 'warning'
      alert.color = 'warning'
      return Alert.create(alert)
    case 'info':
      alert.icon = alert.icon || 'info'
      alert.color = 'info'
      return Alert.create(alert)
    default:
      return Alert.create(alert)
  }
}

export default alert
