export default ({ Vue }) => {
  Vue.config.errorHandler = (err, vm, info) => {
    // err: error trace
    // vm: component in which error occured
    // info: Vue specific error information such as lifecycle hooks, events etc.
    console.debug('errorHandler', err, vm, info)
  }
  Vue.prototype.$handleError = function (context, err = {}, message = 'errors.unknown_error') {
    if (!context) {
      console.error('Unable to handle error, no vue context given', message, err)
      return
    }
    let errMessage, captureError = true
    if (err.response && err.response.data && err.response.data.code >= 400) {
      errMessage = context.$t('errors.generic_error', { code: err.response.data.code, message: err.response.data.message })
    }
    if (err.response && err.response.status) {
      switch (err.response.status) {
      case 401:
        captureError = false
        errMessage = context.$t('errors.unauthorized')
        break
      case 403:
        captureError = false
        errMessage = context.$t('errors.forbidden')
        break
      case 404:
        captureError = false
        errMessage = context.$t('errors.not_found')
        break
      default:
        errMessage = context.$t('errors.http_server_error', { code: err.response.status, message: err.response.data })
      }
    }
    context.$store.commit('notifications/addMessage', {
      body: errMessage || message,
      params: { error: errMessage || err.message },
      mode: 'alert',
      type: 'error'
    })
    if (captureError) context.$captureException(err)
  }
}
