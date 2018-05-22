import notifications from '../lib/services/notifications'

export default ({ Vue }) => {
  Vue.component('mb-notification-service', notifications)
}
