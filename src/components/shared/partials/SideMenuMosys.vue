<template lang="pug">
  #sidemenu
    ul
      li.root
        a(@click="$router.push({ name: 'mosys.listPrivate' })") Alle eigenen Sets
        ul
          li.sub (hidden) Nur für mich sichtbar
            ul
              li
                a(@click="$router.push({ name: 'mosys.set' })") (hidden) Set 1
              li
                a(@click="$router.push({ name: 'mosys.set' })") (hidden) Set 2
          li.sub (closed) Von mir zur Gruppenbearbeitung freigegebene Sets (invitation only)
            ul
              li
                a(@click="$router.push({ name: 'mosys.set' })") (closed) Set a
              li
                a(@click="$router.push({ name: 'mosys.set' })") (closed) Set b
          li.sub (public/shared) Von mir veröffentlichte Sets (für jeden zugänglich, bearbeitbar)
            ul
              li
                a(@click="$router.push({ name: 'mosys.set' })") (public) Set *
              li
                a(@click="$router.push({ name: 'mosys.set' })") (public) Set **
          li.sub (public/shared) Von mir veröffentlichte Sets (für jeden zugänglich, nicht bearbeitbar)
            ul
              li
                a(@click="$router.push({ name: 'mosys.set' })") (public) Set #
              li
                a(@click="$router.push({ name: 'mosys.set' })") (public) Set ##
      li.root
        a(@click="$router.push({ name: 'mosys.listGroups' })") Alle fremden Sets, an denen ich beteiligt bin
        ul
          li.sub
            a(@click="$router.push({ name: 'mosys.set' })") (public) Set a
          li.sub
            a(@click="$router.push({ name: 'mosys.set' })") (closed & visible) Set b
          li.sub
            a(@click="$router.push({ name: 'mosys.set' })") (closed & hidden) Set c
      li.root
        a(@click="$router.push({ name: 'mosys.listAllPublic' })") Alle anderen öffentlichen Sets
        ul
          li.sub (read only) nur lesbar
            ul
              li
                a(@click="$router.push({ name: 'mosys.setPublic' })") (read only) Set AAA
              li
                a(@click="$router.push({ name: 'mosys.setPublic' })") (read only) Set BBB
          li.sub (read & edit) les- und editierbar
            ul
              li
                a(@click="$router.push({ name: 'mosys.set' })") (read & edit) Set ---
              li
                a(@click="$router.push({ name: 'mosys.set' })") (read & edit) Set ...
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

  li.root:not(:last-of-type) {
    border-bottom: 1px solid white;
  }
</style>
