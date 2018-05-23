import rest from '../lib/clients/rest'

export default ({ Vue }) => {
  const client = rest(process.env.API_HOST)
  Vue.prototype.$feathers = client
}
