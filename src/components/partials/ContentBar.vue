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
  #content-bar {
    background-color: #eee;
    padding-bottom: 1em;
    margin-bottom: 1em;
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
