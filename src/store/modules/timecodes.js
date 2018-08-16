import axios from 'axios'

const timecodes = {
  namespaced: true,
  state: {
    jobIds: localStorage.getItem('timecodes_jobIds') ? JSON.parse(localStorage.getItem('timecodes_jobIds')) : [],
    jobDetails: localStorage.getItem('timecodes_jobDetails') ? JSON.parse(localStorage.getItem('timecodes_jobDetails')) : {}
  },
  getters: {
    getJobIds: state => state.jobIds,
    getJobDetails: state => state.jobDetails
  },
  mutations: {
    addJobId: (state, data) => {
      state.jobIds.push(data)
      localStorage.setItem('timecodes_jobIds', JSON.stringify(state.jobIds))
    },
    addJobDetail: (state, { jobId, detail }) => {
      state.jobDetails[jobId] = detail
      localStorage.setItem('timecodes_jobDetails', JSON.stringify(state.jobDetails))
    },
    removeJobId: (state, jobId) => {
      state.jobIds.splice(state.jobIds.indexOf(jobId))
      localStorage.setItem('timecodes_jobIds', JSON.stringify(state.jobIds))
    },
    removeJobDetail: (state, jobId) => {
      const details = {}
      const jobIds = Object.keys(state.jobDetails)
      for (let id of jobIds) {
        if (jobId !== id) details[id] = state.jobDetails[id]
      }
      state.jobDetails = details
      localStorage.setItem('timecodes_jobDetails', JSON.stringify(state.jobDetails))
    }
  },
  actions: {
    async listSignals () {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      const result = await axios.get(`${process.env.TRANSCODER_HOST}/timecodes/signals/ltc`, {headers})
      return result.data
    }
  }
}

export default timecodes
