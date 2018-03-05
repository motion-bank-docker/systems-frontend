<template lang="pug">
  .wrap
    content-bar
      q-btn(slot="btn-filter") Filter
      q-btn(slot="btn-search") Search
    h1 group
    side-menu

    data-table-test
    div(slot="table-title") My Videos
    div(slot="table-button")
      q-btn(icon="create") Add Video


</template>

<script>
  import {
    QBtn
  } from 'quasar-framework'
  import ContentBar from '../../../shared/partials/ContentBar'
  import DataTableTest from '../../../shared/partials/_DataTableTest'
  import SideMenu from '../../../shared/partials/Sidemenu'
  export default {
    components: {
      QBtn,
      ContentBar,
      DataTableTest,
      SideMenu
    }
    // name: 'group'
  }
</script>

<style scoped>
  .wrap {
    background-color: rgba( 0, 0, 255, .2 );
    width: 80vw;
    float: right;
  }
</style>
