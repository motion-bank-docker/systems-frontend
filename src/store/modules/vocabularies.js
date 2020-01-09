import axios from 'axios'
import { ObjectUtil } from 'mbjs-utils'

const vocabularies = {
  namespaced: true,
  state: {
    scopes: [],
    scopedLabels: {},
    scopedTerms: {}
  },
  getters: {
    getLabels: state => {
      return state.scopes
        .filter(scope => state.scopedTerms[scope] && state.scopedTerms[scope].length)
        .map(scope => {
          return {
            id: scope,
            label: state.scopedLabels[scope]
          }
        })
    }
  },
  actions: {
    async loadTitles (context, [video, metadata]) {
      const response = await axios.get(`${process.env.PBA_API_HOST}videos/titles/`, {
        headers: { Accept: 'application/json' },
        params: { media_url: video.body.source.id },
        auth: context.rootState.auth.pba
      })
      console.log('titles response', response)
      const scope = ObjectUtil.slug(video.body.source.id, true)
      context.commit('addTermsForScope', [scope, response.data.map(title => {
        return {
          value: title.label,
          id: `https://dams-staging.pinabausch.org/resource/${title.identifier}`
        }
      })])
      context.commit('setScopeLabel', [scope, (metadata.title || 'Unknown')])
    },
    get (context, id) {
      return context.state.scopedTerms[id]
    }
  },
  mutations: {
    addTermsForScope (state, [scope, terms]) {
      if (!Array.isArray(terms)) throw new Error('terms must be type array')

      if (state.scopes.indexOf(scope) === -1) state.scopes.push(scope)
      if (!Array.isArray(state.scopedTerms[scope])) state.scopedTerms[scope] = terms
      else {
        terms = terms.filter(term => {
          let exists = false
          for (let existing of state.scopedTerms[scope]) {
            if (term.value === existing.value) exists = true
          }
          return !!exists
        })
        state.scopedTerms[scope] = state.scopedTerms[scope]
          .concat(terms)
          // .sort((a, b) => a.value.localeCompare(b.value))
      }
    },
    setScopeLabel (state, [scope, label]) {
      state.scopedLabels[scope] = label
    }
  }
}

export default vocabularies
