<template lang="pug">
  div
    side-menu

    .content-wrap
      content-bar
        a.content-bar-item(slot="content-bar-item", @click="ch1") Filter 1
        a.content-bar-item(slot="content-bar-item", @click="ch1") Filter 2

      data-table-test
        div.table-top-item(slot="table-top-item") My Sets
        div.table-top-item.table-top-button(slot="table-top-item")
          a(@click="open_form") Add new set

        div(slot="table-form-item")
          form-add#mosys-add-form
            h3(slot="form-top-item") New set: set details

            q-field(slot="form-middle-item")
              q-input(v-model="text" float-label="Title" value="11111111" name="set-title")

            q-field(slot="form-middle-item")
              q-input(v-model="text" float-label="Description" value="222" name="set-desc")

            q-field(slot="form-middle-item")
              q-input(v-model="message" float-label="Float Label" value="222" name="set-status")
              div message is {{ message }}

            q-radio(slot="form-middle-item" v-model="option" val="opt1" label="private")
            q-radio(slot="form-middle-item" v-model="option" val="opt2" label="public")
            q-radio(slot="form-middle-item" v-model="option" val="opt3" label="shared")

            a(slot="form-bottom-item", @click="$router.push({ name: 'mosys.set' })") add & go
            a(slot="form-bottom-item", @click="AddNew") add & stay
            a(slot="form-bottom-item", @click="HideForm") cancel



      data-table-test
        div.table-top-item(slot="table-top-item") Other Sets
</template>

<script>
  import {
    QBtn,
    QField,
    QInput,
    QRadio
  } from 'quasar-framework'
  import ContentBar from '../../partials/ContentBar'
  import DataTableTest from '../../partials/DataTableTest'
  import FormAdd from '../../forms/FormAdd'
  import SideMenu from '../../partials/Sidemenu'
  export default {
    components: {
      QBtn,
      QField,
      QInput,
      QRadio,
      ContentBar,
      DataTableTest,
      FormAdd,
      SideMenu
    },
    methods: {
      open_form: function () {
        // alert('geht')
        // document.getElementById('test123').style.backgroundColor = 'blue'
        document.getElementById('mosys-add-form').style.display = 'block'
      },
      ch1: function () {
        alert('111')
      },
      AddNew: function () {
        document.getElementById('mosys-add-form').style.display = 'none'
      },
      HideForm: function () {
        document.getElementById('mosys-add-form').style.display = 'none'
      }
    }
    // name: "dashboard"
  }
</script>

<style scoped>
  .right {
    background-color: aqua;
  }
  #mosys-add-form {
    display: none;
  }
</style>
