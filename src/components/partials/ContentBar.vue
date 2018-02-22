<template lang="pug">
  .wrap
    slot(name="btn-filter")
    slot(name="btn-search")
    slot(name="btn-sources")
</template>

<script>
    export default {
      // name: "content-bar"
    }
</script>

<style scoped>
  .wrap {
    background-color: black;
  }
</style>
