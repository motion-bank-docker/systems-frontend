<template lang="pug">
  div
    side-menu

    .wrap
      content-bar
        a(slot="content-bar-item", @click="ch1") Filter 1
        a(slot="content-bar-item", @click="ch2") Filter 2

      data-table-test
        div(slot="table-top-item") My Sets
        div(slot="table-top-item")
          a(@click="open_form") Add new set

        div(slot="table-form-item")
          form-add#add-form
            h3(slot="form-top-item") New set: set details

            q-field(slot="form-middle-item" label="Title" icon="cloud")
              q-input(v-model="text" label="title" value="11111111" name="set-title")
            q-field(slot="form-middle-item" label="Description" icon="cloud")
              q-input(v-model="text" value="222" name="set-desc")
            q-field(slot="form-middle-item" label="Status" icon="cloud")
              q-input(v-model="message" value="222" name="set-status")
              div message is {{ message }}
            q-radio(slot="form-middle-item" v-model="option" val="opt1" label="private")
            q-radio(slot="form-middle-item" v-model="option" val="opt2" label="public")
            q-radio(slot="form-middle-item" v-model="option" val="opt3" label="shared")

            a(slot="form-bottom-item", @click="$router.push({ name: 'mosys.set' })") add & go
            a(slot="form-bottom-item", @click="ch1") add & stay
            a(slot="form-bottom-item", @click="HideForm") cancel



      data-table-test
        div(slot="table-top-item") Other Sets
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
        document.getElementById('add-form').style.display = 'block'
      },
      ch1: function () {
        alert('111')
      },
      ch2: function () {
        alert('2 geht auch')
      },
      HideForm: function () {
        document.getElementById('add-form').style.display = 'none'
      }
    }
    // name: "dashboard"
  }
</script>

<style scoped>
  .wrap {
    width: 80vw;
    background-color: white;
    float: right;
  }
  .right {
    background-color: aqua;
  }
  #add-form {
    display: none;
    border: 1px solid black;
    border-radius: 1em;
    padding: 2em;
  }
</style>
