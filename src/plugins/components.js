import {
  BackButton,
  ConfirmModal,
  DataTable,
  FullScreen,
  Uploader,
  Username,
  VideoPlayer,
  VideoTitle
} from 'mbjs-quasar/src/components'

export default ({ Vue }) => {
  Vue.component('back-button', BackButton)
  Vue.component('confirm-modal', ConfirmModal)
  Vue.component('data-table', DataTable)
  Vue.component('full-screen', FullScreen)
  Vue.component('uploader', Uploader)
  Vue.component('username', Username)
  Vue.component('video-player', VideoPlayer)
  Vue.component('video-title', VideoTitle)
}
