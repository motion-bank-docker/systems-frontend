/* eslint-disable no-unused-vars */
import Vue from 'vue'
export const EventHub = new Vue({
  data: {
    currentKeyPressed: null
  },
  mounted () {
    console.log('event hub mounted')
  },
  methods: {
    keyIsPressed (key) {
      return this.currentKeyPressed === key
    }
  }
})
/* eslint-enable no-unused-vars */
