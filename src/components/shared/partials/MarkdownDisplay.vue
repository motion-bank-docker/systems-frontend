<template lang="pug">
  div.md-content(ref="content")
</template>

<script>
  import marked from 'marked'
  import sanitizeHtml from 'sanitize-html'

  marked.setOptions({
    sanitize: true,
    sanitizer: data => {
      return sanitizeHtml(data, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
        allowedAttributes: {
          'a': ['href']
        }
      })
    }
  })

  export default {
    props: {
      content: { type: String, default: '' }
    },
    name: 'MarkdownDisplay',
    mounted () {
      this.$refs.content.innerHTML = this.transformContent(this.content)
    },
    watch: {
      content (val) {
        this.$refs.content.innerHTML = this.transformContent(val)
      }
    },
    methods: {
      transformContent (val) {
        val = this.parseLinks(val)
        return marked(val)
      },
      parseLinks (val) {
        return val.replace(/(\w(https?|http|ftp|file|mailto):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig, str => {
          return ` [${str.trim()}](${str.trim()})`
        })
      }
    }
  }
</script>

<style lang="stylus">
  .md-content
    font-size: 1rem
</style>
