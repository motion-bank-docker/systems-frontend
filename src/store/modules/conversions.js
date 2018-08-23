import axios from 'axios'

const conversions = {
  namespaced: true,
  state: {
    jobIds: localStorage.getItem('conversions_jobIds') ? JSON.parse(localStorage.getItem('conversions_jobIds')) : [],
    jobDetails: localStorage.getItem('conversions_jobDetails') ? JSON.parse(localStorage.getItem('conversions_jobDetails')) : {}
  },
  getters: {
    getJobIds: state => state.jobIds,
    getJobDetails: state => state.jobDetails
  },
  mutations: {
    addJobId: (state, data) => {
      state.jobIds.push(data)
      localStorage.setItem('conversions_jobIds', JSON.stringify(state.jobIds))
    },
    addJobDetail: (state, { jobId, detail }) => {
      state.jobDetails[jobId] = detail
      localStorage.setItem('conversions_jobDetails', JSON.stringify(state.jobDetails))
    },
    removeJobId: (state, jobId) => {
      state.jobIds.splice(state.jobIds.indexOf(jobId))
      localStorage.setItem('conversions_jobIds', JSON.stringify(state.jobIds))
    },
    removeJobDetail: (state, jobId) => {
      const details = {}
      const jobIds = Object.keys(state.jobDetails)
      for (let id of jobIds) {
        if (jobId !== id) details[id] = state.jobDetails[id]
      }
      state.jobDetails = details
      localStorage.setItem('conversions_jobDetails', JSON.stringify(state.jobDetails))
    }
  },
  actions: {
    async post ({ commit }, { conversion, detail }) {
      const result = await axios.post(`${process.env.TRANSCODER_HOST}/conversions`, conversion)
      console.debug('conversion job added', conversion, result)
      if (result.data.jobId) {
        commit('addJobDetail', { jobId: result.data.jobId, detail })
        commit('addJobId', result.data.jobId)
      }
      else throw new Error('Missing job id')
      return result.data.jobId
    },
    async get (context, jobId) {
      const result = await axios.get(`${process.env.TRANSCODER_HOST}/conversions/${jobId}`)
      return result.data
    }
  }
}

export default conversions
