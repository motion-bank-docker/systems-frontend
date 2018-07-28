<template lang="pug">
  q-uploader(dark, auto-expand, clearable, :extensions="ext", :multiple="allowMultiple", :url="url", :headers="reqHeaders",
    :additional-fields="addFields", @add="onSelect", @uploaded="onUploaded", @fail="onFail", @start="onStart", @finish="onFinish")
</template>

<script>
  import { ObjectUtil } from 'mbjs-utils'
  export default {
    data () {
      return {
        ext: this.allowed || undefined,
        allowMultiple: this.multiple || false,
        addFields: this.fields || [],
        responses: {},
        reqHeaders: this.headers || {}
      }
    },
    props: ['url', 'allowed', 'headers', 'multiple', 'fields'],
    watch: {
      allowed () {
        this.ext = this.allowed
      },
      headers () {
        this.reqHeaders = this.headers
      },
      multiple () {
        this.allowMultiple = this.multiple
      },
      fields () {
        this.addFields = this.fields || []
      }
    },
    methods: {
      onSelect (files) {
        this.$emit('select', files)
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
        this.responses = []
        this.$emit('start')
      },
      onFinish () {
        this.$emit('finish', this.responses)
      }
    }
  }
</script>
