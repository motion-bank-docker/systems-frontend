<template lang="pug">
  form.form-wrap
    div.form-top
      slot(name="form-top-item").item

    div.form-body
      slot(name="form-middle-item")

    div.form-bottom
      slot(name="form-bottom-item")
</template>

<script>
  import {
    QField,
    QBtn,
    QInput
  } from 'quasar-framework'
  export default {
    components: {
      QField,
      QBtn,
      QInput
    }
    // name: "form-add"
  }
</script>

<style scoped>
  .form-wrap {
    margin: 2em 0;
  }
  .form-bottom {
    background-color: #f9f9f9;
    margin: 2em;
    text-align: center;
  }

  .form-bottom > * {
    background-color: #555;
    color: white;
    padding: 1em;
    margin: 1em;
    border-radius: .2em;
  }
</style>
