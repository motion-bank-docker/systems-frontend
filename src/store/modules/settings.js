const settings = {
  namespaced: true,
  state: {
    apiHost: process.env.API_HOST || window.API_HOST
  }
}

export default settings
