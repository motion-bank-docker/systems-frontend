<template lang="pug">
  div
    side-menu

    .content-wrap
      content-bar
        a.content-bar-item(slot="content-bar-item") Filter

      data-table-test
        div.table-top-item(slot="table-top-item") My Videos
        div.table-top-item.table-top-button(slot="table-top-item")
          a(@click="action") Add new video
          a(@click="$router.push({ name: 'piecemaker.annotator' })") Annotator
        div(slot="table-form-item")#formular-test
          form-add


      data-table-test
        div.table-top-item(slot="table-top-item") Allgemein
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

  #formular-test {
    background-color: cadetblue;
    display: none;
  }
</style>
