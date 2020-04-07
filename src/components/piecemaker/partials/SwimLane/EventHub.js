/* eslint-disable no-unused-vars */
// EventHub is now only used to track which key is pressed. Events are emitted by this.$root
import Vue from 'vue'
export const EventHub = new Vue({
  data: {
    currentKeyPressed: null
  },
  methods: {
    keyIsPressed (key) {
      return this.currentKeyPressed === key
    }
  }
})
/* eslint-enable no-unused-vars */
