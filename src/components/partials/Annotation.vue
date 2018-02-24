<template lang="pug">
  .annotation
    .annotation-top
      .annotation-top-item.annotation-timestamp timestamp
      .annotation-top-item.annotation-buttons
        a(@click="EditForm ($event.target)") edit
        a(@click="DeleteAnnotation ($event.target)") delete
    .annotation-form
      form-add
        q-field(slot="form-middle-item")
          q-input(value="value")
        // q-btn(slot="form-bottom-item" value="value") Save changes
        // q-btn(slot="form-bottom-item" value="value") Cancel
        a(slot="form-bottom-item" @click="SaveEdit ($event.target)") Save changes
        a(slot="form-bottom-item" @click="CancelEdit ($event.target)") Cancel
      a() copy-text

    .text hier steht eine beschreibung
</template>

<script>
  import {
    QBtn,
    QInput,
    QField
  } from 'quasar-framework'
  import FormAdd from '../forms/FormAdd'
  export default {
    components: {
      QBtn,
      QInput,
      QField,
      FormAdd
    },
    methods: {
      CancelEdit (target) {
        var el = target.parentNode.parentNode
        console.log(el)
        el[0].style.display = 'none'
      },
      DeleteAnnotation (target) {
      },
      EditForm (target) {
        var el = target.parentNode.parentNode.parentElement.getElementsByClassName('annotation-form')
        el[0].style.display = 'block'
      },
      SaveEdit (target) {
      }
    }
    // name: "annotation"
  }
</script>

<style scoped>
  .annotation {
    padding: 1em;
    border-bottom: 1px solid #eee;
  }
  .annotation-buttons,
  .annotation-timestamp {
    display: inline-block;
  }
  .annotation-top {
    display: inline-block;
    padding: .2em .5em;
    margin-right: .2em;
    cursor: pointer;
    width: 100%;
  }
  .annotation-form {
    display: none;
  }
</style>
