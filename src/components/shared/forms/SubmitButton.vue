<template lang="pug">
  q-btn(:dark="true", outline, icon-right="forward", :color="active ? 'primary' : 'light'",
    @click="clickHandler", type="submit", :disabled="!active")
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

<style></style>
