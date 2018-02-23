<template lang="pug">
  div
    side-menu

    .wrap
      content-bar
        q-btn(slot="content-bar-item") Filter

      data-table-test
        div(slot="table-title") My Videos
        div(slot="table-button")
          q-btn(icon="create" @click="action") Add Video
        div(slot="table-formular")#formular-test
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
    },
    methods: {
      action: function () {
        console.log('click geht')
        // document.getElementById('formulat-test').removeAttribute('hidden')
      }
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
  #formular-test {
    background-color: cadetblue;
  }
</style>
