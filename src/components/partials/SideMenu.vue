<template lang="pug">
  #sidemenu
    ul
      li private
      li public
      li private
      li private 123
</template>

<script>
  export default {
    // name: 'side-menu'
  }
</script>

<style scoped>
  #sidemenu {
    background-color: #fafafa;
    width: 20vw;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  ul {
    margin: 0;
    padding: 0;
/*    margin: 1em;
    padding: 1em;
    box-shadow: 0 0 20px 0 rgba( 0, 0, 0, .2 );*/
  }

  li {
    list-style: none;
    cursor: pointer;
    margin: 0 .5em;
    padding: .5em 0;
  }

  li:hover {
    color: black;
    }

  li:not(:last-of-type) {
    border-bottom: 1px solid #ddd;
    }
</style>
