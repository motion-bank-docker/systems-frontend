<template lang="pug">
  .wrap
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
  .wrap {
    background-color: #333;
    width: 20vw;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: .9;
  }

  ul {
  margin: 0;
    padding: 0;
  }

  li {
    background-color: blue;
    list-style: none;
    cursor: pointer;
  }

  li:hover {
    background-color: red;
    }
</style>
