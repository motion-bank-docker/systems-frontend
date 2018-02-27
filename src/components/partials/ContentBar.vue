<template lang="pug">
  #content-bar
    slot(name="content-bar-item")
    div.search-bar
      q-search
</template>

<script>
  import {
    // QBtnDropdown,
    QSearch
  } from 'quasar-framework'
  export default {
    components: {
      // QBtnDropdown,
      QSearch
    }
    // name: "content-bar"
  }
</script>

<style scoped>
  .search-bar {
    width: 50%;
    background-color: antiquewhite;
  }
  .content-bar-item {
    color: black;
    padding: .2em .5em;
    border-radius: .2em;
    background-color: #eee;
    text-transform: uppercase;
    }

  #content-bar {
    /* background-color: #eee; */
    padding-bottom: .5em;
    /*border-bottom: 2px solid black; */
    /* margin: .5em 1em 1em; */
    /* background: rgba( 185, 165, 130, .2 ); */
    /* box-shadow: 0 0 10px 10px antiquewhite; */
  }
  #content-bar > * {
    display: inline-block;
    vertical-align: top;
    margin: .5em;
  }
  .search-bar {
    /*box-shadow: 0 0 20px 0 rgba( 0, 0, 0, .2 );
    margin: 1em;*/
  }
</style>
