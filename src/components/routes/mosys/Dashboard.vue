<template lang="pug">
  div
    side-menu
    .wrap
      content-bar
        q-btn(slot="btn-filter") Filter
        q-btn(slot="btn-search") Search
      form-add
      data-table-test
        div(slot="table-title") My Sets
        div(slot="table-button")
          q-btn(icon="create") Add Set
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
    // name: "dashboard"
  }
</script>

<style scoped>
  .wrap {
    width: 80vw;
    background-color: purple;
    float: right;
  }
</style>
