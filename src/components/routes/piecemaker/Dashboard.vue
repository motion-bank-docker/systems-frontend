<template lang="pug">
  div
    side-menu
      p(slot="blah") slottest

    .wrap
      content-bar
        q-btn(slot="btn-filter") Filter
        q-btn(slot="btn-search") Search


      data-table-test
        div(slot="table-title") My Videos
        div(slot="table-button")
          q-btn(icon="create") Add Video
        div(slot="table-formular")
          form-add


      data-table-test
        div(slot="table-title") Allgemein
</template>

<script>
  import {
    QBtn
  } from 'quasar-framework'
  import ContentBar from '../../partials/ContentBar'
  import DataTableTest from '../../partials/DataTableTest'
  import FormAdd from '../../forms/FormAdd'
  import SideMenu from '../../partials/Sidemenu'
  export default {
    components: {
      QBtn,
      ContentBar,
      DataTableTest,
      FormAdd,
      SideMenu
    }
    // name: 'dashboard'
  }
</script>

<style scoped>
  p {
    margin: 0;
  }
  .wrap {
    background-color: #444;
    width: 80vw;
    float: right;
  }
</style>
