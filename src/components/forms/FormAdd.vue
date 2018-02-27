<template lang="pug">
  form.form-wrap
    div.form-top
      slot(name="form-top-item").item

    div.form-middle
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
    padding: 2em;
    background-color: beige;
    box-shadow: 0 0 20px 0 rgba( 0, 0, 0, .2 );
  }

  .form-bottom {
    background-color: #f9f9f9;
    margin: 2em;
    text-align: center;
  }

    .form-bottom > * {
      background-color: #555;
      color: white;
      padding: .2em .5em;
      margin: 1em;
      border-radius: .2em;
    }
</style>
