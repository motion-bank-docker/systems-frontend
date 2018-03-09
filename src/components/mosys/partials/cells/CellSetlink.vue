<template lang="pug">

  div(:class="{'display-preview': preview, 'display-full': display}")
    template(v-if="display")
      router-link(:to="setLink")
        div(:style="{'background-color': 'green'}")

    template(v-else)
      strong 'Link Cell'

</template>

<script>
  export default {
    props: ['cell', 'display', 'preview'],
    data () {
      return {}
    },
    computed: {
      setLink () {
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
    background-color white
    background-size contain
    background-repeat no-repeat
    background-position center
</style>
