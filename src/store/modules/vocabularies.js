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
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      const result = await axios.get(`${process.env.API_HOST}/pba/pieces`, { headers })
      let pieces = result.data.sort((a, b) => a.label.replace(/\W/g, '').localeCompare(b.label.replace(/\W/g, '')))
      if (limit) pieces = pieces.splice(0, limit)
      for (let piece of pieces) {
        const result = await axios.get(`${process.env.API_HOST}/pba/pieces/${piece.piece_id}/titles`, {headers})
        context.commit('addTermsForScope', [piece.piece_id, result.data.map(title => {
          return {
            value: title.label,
            id: title.title,
            type: 'PBATitle'
          }
        })])
        // .sort((a, b) => a.value.localeCompare(b.value))
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
