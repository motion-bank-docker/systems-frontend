<template lang="pug">
  q-uploader(dark, auto-expand, clearable, :extensions="ext", :multiple="true", :url="url", :headers="headers",
    @add="onSelect", @uploaded="onUploaded", @fail="onFail", @start="onStart", @finish="onFinish")
</template>

<script>
  import { ObjectUtil, TimeUtil } from 'mbjs-utils'
  import { QUploader } from 'quasar-framework'
  export default {
    components: {
      QUploader
    },
    data () {
      return {
        ext: '.mp4',
        responses: {},
        headers: {}
      }
    },
    props: ['url'],
    methods: {
      onSelect (files) {
        this.$emit('select', files)
        console.log('sel', files)
        const _this = this
        files.forEach(file => {
          _this.headers['file-' + ObjectUtil.slug(file.name)] = TimeUtil.toDateTime(file.lastModified).toISO()
        })
      },
      onUploaded (file, xhr) {
        let response
        try {
          response = JSON.parse(xhr.responseText)
        }
        catch (e) { /* ignored */ }
        this.responses[ObjectUtil.slug(file.name)] = response
      },
      onFail (file, xhr) {
        let response
        console.debug('uploader failed file', file, xhr)
        try {
          response = JSON.parse(xhr.responseText)
        }
        catch (e) { /* ignored */ }
        this.responses[ObjectUtil.slug(file.name)] = response
      },
      onStart () {
        const _this = this
        this.responses = []
        console.log(_this.headers)
        this.$emit('start')
      },
      onFinish () {
        this.$emit('finish', this.responses)
      }
    }
  }
</script>
