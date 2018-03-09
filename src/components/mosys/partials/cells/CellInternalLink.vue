<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      router-link(:to="internalLink")
        div --> {{internalLink.path}}

    template(v-else)
      strong Link Cell

</template>

<script>
  export default {
    props: ['cell', 'display', 'preview'],
    data () {
      return {}
    },
    computed: {
      internalLink () {
        // TODO: only link to paths that are visible to public / user?
        return {
          path: this.cell.content
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  div
    padding 1em
    width 100%
    height 100%

  div.display-full
    background-color white

  div.display-preview
    color #666
</style>
