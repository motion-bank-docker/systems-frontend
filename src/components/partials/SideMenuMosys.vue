<template lang="pug">
  #sidemenu
    ul
      li Von mir erstellte Sets
        ul
          li Nur für mich sichtbar
          li Öffentlich
          li Für Gemeinschaftsbearbeitung freigegeben
      li Andere Sets, an denen ich beteiligt bin
      li Alle anderen öffentlichen Sets
</template>

<script>
  export default {
    // name: 'side-menu'
  }
</script>

<style scoped>
  #sidemenu {
    width: 20vw;
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
