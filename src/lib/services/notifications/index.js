import alert from './alert'
import toast from './toast'

const notifications = {
  data () {
    return {
      alertInstance: undefined
    }
  },
  beforeDestroy: function () {
    this.removeAlert()
  },
  computed: {
    messages () {
      return this.$store.state.notifications.messages
    }
  },
  watch: {
    messages (val) {
      if (!Array.isArray(val) || val.length === 0) {
        return
      }
      const messages = [].concat(val)
      this.$store.commit('notifications/clearMessages')
      this.removeAlert()
      while (messages.length > 0) {
        const msg = messages.pop()
        if (msg.mode === 'alert') {
          /**
           * Show Alert
           */
          this.alertInstance = this.alert(this.$t(msg.body), msg.type, {icon: msg.icon})
        }
        else {
          /**
           * Show Toast (default)
           */
          this.toast(this.$t(msg.body), msg.type, {icon: msg.icon})
        }
      }
    }
  },
  methods: {
    removeAlert () {
      if (this.alertInstance) {
        this.alertInstance.dismiss()
        this.alertInstance = undefined
      }
    },
    /**
     * Registered Display Methods
     */
    alert,
    toast
  },
  render: h => h('div')
}

export default notifications
