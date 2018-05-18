<template lang="pug">
  div
    side-menu
    .wrap
      content-bar
        q-btn(slot="btn-sources") Sources &darr;
      div
        | bhucbdshjkvcabsdljcd

</template>

<script>
  import {
    QBtn
  } from 'quasar-framework'
  import ContentBar from '../../../shared/partials/ContentBar'
  import SideMenu from '../../../shared/partials/Sidemenu'
  export default {
    components: {
      QBtn,
      ContentBar,
      SideMenu
    }
    // name: "source-browser"
  }
</script>

<style scoped>
  .wrap {
    background-color: red;
    width: 80vw;
    float: right;
  }
</style>
