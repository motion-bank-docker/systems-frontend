<template lang="pug">
  span {{ videoTitle }}
</template>

<script>
  import path from 'path'
  import url from 'url'
  import he from 'he'

  const fetchTitle = function (source) {
    const _this = this
    return Promise.resolve()
      .then(() => {
        if (source.indexOf('http') !== 0) return
        if (path.extname(url.parse(source).path) === '.mp4') {
          source = source.replace(/\.mp4/i, '.html')
        }
        return this.$axios.get(`${_this.$globalConfig.app.hosts.api}/proxy?url=${encodeURIComponent(source)}`)
          .then(result => {
            let title = result.text.match(/<title[^>]*>([^<]+)<\/title>/)[1]
            return he.decode(title)
          })
          .catch(err => {
            console.warn(`Error getting title for ${source}: ${err.message}`)
            return source
          })
      })
  }

  export {
    fetchTitle
  }

  export default {
    props: ['source'],
    asyncComputed: {
      async videoTitle () {
        const title = await fetchTitle(this.source)
        return title
      }
    }
  }
</script>
