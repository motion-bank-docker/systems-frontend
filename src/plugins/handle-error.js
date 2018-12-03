export default ({ Vue }) => {
  Vue.prototype.$handleError = function (context, err = {}, message = 'errors.unknown_error') {
    if (!context) {
      console.error('Unable to handle error, no vue context given', message, err)
      return
    }
    let errMessage
    if (err.response && err.response.status) {
      switch (err.response.status) {
      case 401:
        errMessage = context.$t('errors.unauthorized')
        break
      case 403:
        errMessage = context.$t('errors.forbidden')
        break
      default:
        errMessage = context.$t('errors.http_server_error', { code: err.response.status, message: err.response.data })
      }
    }
    context.$store.commit('notifications/addMessage', {
      body: message,
      params: { error: errMessage || err.message },
      mode: 'alert',
      type: 'error'
    })
    context.$captureException(err)
  }
}
