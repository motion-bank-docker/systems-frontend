<template lang="pug">
  div
    nav
      a(@click="$router.push({ name: 'mosys.dashboard' })") Back to dashboard
      .buttons
        div set cells
        div sources
        div preconfigured cells
        div settings
    .grid
      .row(v-for="n in 10")
        .cell(v-for="n in 50")
</template>

<script>
  export default {
    // name: "set"
    methods: {
      test () {
        alert('test')
      }
    }
  }
</script>

<style scoped>
  nav {
    min-height: 2.5em;
    border-bottom: 1px solid #ddd;
    background-color: white;
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
    height: 80vh;
    background-color: #eee;
    padding: 1em;
    width: 100vw;
    overflow-x: scroll;
  }
  .row {
    /* border: 1px solid blue; */
    height: 10%;
    position: relative;
    background-color: yellow;
    /* border: 1px solid black; */
    display: block;
    width: auto;
    white-space: nowrap;
  }
  .cell {
    width: 10%;
    height: 100%;
    background-color: white;
    display: inline-block;
    border-right: 1px solid #eee;
    border-top: 1px solid #eee;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
  }
  .cell:hover {
    background-color: #e3e3e3;
  }
  .cell:last-of-type {
    margin-right: 1em;
  }
</style>
