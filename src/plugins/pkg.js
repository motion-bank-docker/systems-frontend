import * as pkg from '../../package.json'

export default ({ Vue }) => {
  Vue.prototype.$pkg = pkg
}
