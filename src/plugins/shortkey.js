import shortkey from 'vue-shortkey'

export default ({ Vue }) => {
  Vue.use(shortkey)
  Vue.use('vue-shortkey', { prevent: ['.no-shortkey'] })
}
