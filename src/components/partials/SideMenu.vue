<template lang="pug">
  #sidemenu
    ul
      li private
      li public
      li group
      li private 123
</template>

<script>
  export default {
    // name: 'side-menu'
  }
</script>

<style scoped>
  #sidemenu {
    width: 10vw;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    padding: .5em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
    cursor: pointer;
    margin-bottom: 5px;
    padding: .5em;
    background-color: transparent;
  }

  li:hover {
    color: black;
    background-color: #eee;
    }
</style>
