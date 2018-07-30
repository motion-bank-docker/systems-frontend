import notification from './notification'
import { mapGetters } from 'vuex'

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
    ...mapGetters({
      messages: 'notifications/getMessages'
    })
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
        notification(this.$t(msg.body), msg.type, {icon: msg.icon})
      }
    }
  },
  methods: {
    removeAlert () {
      if (this.alertInstance) {
        this.alertInstance.dismiss()
        this.alertInstance = undefined
      }
    }
  },
  render: h => h('div')
}

export default notifications
