<template lang="pug">
  .annotation
    .top
      .timestamp timestamp
      .buttons
        q-btn() edit
        q-btn() delete
      .form
        q-btn() copy-text

    .text hier steht eine beschreibung
</template>

<script>
  import {
    QBtn
  } from 'quasar-framework'
  export default {
    components: {
      QBtn
    }
    // name: "annotation"
  }
</script>

<style scoped>
  .buttons,
  .timestamp {
    display: inline-block;
  }
  .top {
    display: inline-block;
    padding: .2em .5em;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-right: .2em;
    cursor: pointer;
    width: 100%;
  }
</style>
