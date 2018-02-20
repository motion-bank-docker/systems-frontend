<template lang="pug">
  .row.justify-center.items-center.full-width
    .column.items-center.full-height
      video#main-video.video-js.vjs-default-skin
</template>

<script>
  // import vjs from 'video.js/dist/video.es'
  // import * as record from 'videojs-record'
  const videojs = require('video.js/dist/video.es').default
  global.MRecordRTC = require('recordrtc').MRecordRTC
  require('videojs-record')
  export default {
    mounted: function () {
      const player = videojs('main-video', {
        controls: true,
        width: 320,
        height: 240,
        plugins: {
          record: {
            audio: true,
            video: true,
            maxLength: 10,
            debug: true
          }
        }
      })
      // error handling
      player.on('deviceError', function () {
        console.log('device error:', player.deviceErrorCode)
      })
      player.on('error', function (error) {
        console.log('error:', error)
      })
      // user clicked the record button and started recording
      player.on('startRecord', function () {
        console.log('started recording!')
      })
      // user completed recording and stream is available
      player.on('finishRecord', function () {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        console.log('finished recording: ', player.recordedData)
      })
    }
  }
</script>

<style>
  @import "~video.js/dist/video-js.css";
  @import "~videojs-record/src/css/videojs.record.css";
</style>
