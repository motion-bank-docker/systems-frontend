import axios from 'axios'

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
    async loadPBATitles (context, limit = 0) {
      console.log(limit)
      // let count = 0
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      const result = await axios.get(`${process.env.API_HOST}/pba/pieces`, { headers })
      const pieces = result.data.sort((a, b) => a.label.localeCompare(b.label))
      for (let piece of pieces) {
        const result = await axios.get(`${process.env.API_HOST}/pba/pieces/${piece.piece_id}/titles`, {headers})
        context.commit('addTermsForScope', [piece.piece_id, result.data.map(title => {
          return {
            value: title.label,
            id: title.title,
            type: 'PBATitle'
          }
        }).sort((a, b) => a.value.localeCompare(b.value))])
        context.commit('setScopeLabel', [piece.piece_id, piece.label])
      }
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
      else state.scopedTerms[scope] = state.scopedTerms[scope].concat(terms)
    },
    setScopeLabel (state, [scope, label]) {
      state.scopedLabels[scope] = label
    }
  }
}

export default vocabularies
