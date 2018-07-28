import { Notify } from 'quasar'
import { ObjectUtil } from 'mbjs-utils'

function notification (msg, type = null, opts = {}) {
  const notify = ObjectUtil.merge({
    message: msg,
    timeout: 5000
  }, opts)
  switch (type) {
  case 'success':
    notify.icon = notify.icon || 'done'
    notify.type = 'positive'
    Notify.create(notify)
    break
  case 'error':
    notify.icon = notify.icon || 'error'
    notify.type = 'negative'
    Notify.create(notify)
    break
  case 'warn':
    notify.icon = notify.icon || 'warning'
    notify.type = 'warning'
    Notify.create(notify)
    break
  case 'info':
    notify.icon = notify.icon || 'info'
    notify.type = 'info'
    Notify.create(notify)
    break
  default:
    Notify.create(notify)
    break
  }
}

export default notification
