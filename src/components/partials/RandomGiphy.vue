<template lang="pug">
  img.responsive(v-if="gifURL", :src="gifURL")
</template>

<script>
  import superagent from 'superagent'
  export default {
    props: ['tag', 'apiKey'],
    created: function () {
      this.fetchGIF(this.tag, this.apiKey)
    },
    data () {
      return {
        gifURL: undefined,
        retries: 0
      }
    },
    methods: {
      fetchGIF: function (tag, apiKey) {
        const _this = this
        _this.retries = 0
        function fetch () {
          if (_this.retries > 3) return
          superagent.get(`http://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}`)
            .then(res => {
              if (res.body && res.body.data) {
                _this.gifURL = res.body.data.fixed_height_downsampled_url
              }
            })
            .catch(() => {
              _this.retries += 1
              window.setTimeout(fetch, 200)
            })
        }
        fetch()
      }
    }
  }
</script>

<style></style>
