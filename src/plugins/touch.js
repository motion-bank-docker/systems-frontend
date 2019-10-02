import VueZingTouch from 'vuezingtouch'

export default ({ Vue }) => {
  Vue.directive(VueZingTouch.name, VueZingTouch)
}
