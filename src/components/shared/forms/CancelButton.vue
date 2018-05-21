<template lang="pug">
  q-btn(:dark="true", outline, icon-right="clear", :color="active ? 'primary' : 'light'",
    @click="clickHandler", type="submit")
    slot
</template>

<script>
  export default {
    props: ['active', 'click'],
    methods: {
      clickHandler (...args) {
        if (typeof this.click === 'function') {
          this.click(args)
        }
      }
    }
  }
</script>

<style scoped>

</style>
