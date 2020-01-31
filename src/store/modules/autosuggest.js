import axios from 'axios'
// import { Annotation } from 'mbjs-data-models'
//
// const jsonld = require('jsonld')

const factory = function (auth) {
  const getRequestConfig = auth => {
    return {
      headers: {
        Authorization: `${auth.tokenType} ${auth.token}`
      }
    }
  }
  const autosuggest = {
    namespaced: true,
    state: {
      entries: []
    },
    actions: {
      async find (context, [id, query]) {
        console.log('RTRRRRRRTRT')
        const config = getRequestConfig(auth)
        config.params = { media_url: id, query }
        config.headers['Accept'] = 'application/ld+json'
        console.log(config)
        const data = await axios.get(`${process.env.API_HOST}autosuggest/annotations/`, config)
        // for (let item of data) {
        //   const ld = await jsonld.compact(item, 'http://www.w3.org/ns/anno.jsonld')
        //   console.debug('ld', item, ld)
        // }
        // const items = Array.isArray(data) ? data.map(item => {
        //   const annotation = new Annotation({
        //     id: `${process.env.API_HOST}videos/annotations/${item.identifier}`
        //   })
        //   return annotation
        // }) : []
        // context.commit('setEntries', items)
        // return items
        return data
      }
    }
  }
  return autosuggest
}

export default factory
