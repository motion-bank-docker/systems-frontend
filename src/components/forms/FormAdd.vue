<template lang="pug">
  form
    q-input(type="text", value="1234")
    q-input(type="textfield")
</template>

<script>
  import {
    QInput
  } from 'quasar-framework'
  export default {
    components: {
      QInput
    }
    // name: "form-add"
  }
</script>

<style scoped>

</style>
