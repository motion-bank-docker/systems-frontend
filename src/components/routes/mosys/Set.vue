<template lang="pug">
  div
    nav
      div back
      .buttons
        div set cells
        div sources
        div preconfigured cells
        div settings
    .grid
</template>

<script>
  export default {
    // name: "set"
  }
</script>

<style scoped>
  nav {
    min-height: 2.5em;
    background-color: green;
  }
  nav > div {
    display: inline-block;
  }

  .buttons {
    float: right;
  }
  .buttons > div {
    display: inline-block;
    padding: .2em .5em;
    margin-right: .2em;
    background-color: grey;
  }
  .grid {
    height: 50vh;
    background-color: yellow;
  }
</style>
