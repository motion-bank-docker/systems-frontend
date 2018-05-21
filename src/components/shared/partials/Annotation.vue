<template lang="pug">

  .annotation

    .annotation-top
      slot(name="annotation-timestamp").annotation-top-item.annotation-timestamp timestamp

      .annotation-top-item.annotation-buttons
        a(@click="EditForm ($event.target)") edit
        a(@click="DeleteAnnotation ($event.target)") delete

    .annotation-form
      form-add
        q-field(slot="form-middle-item")
          q-input(value="value")

        a(slot="form-bottom-item" @click="SaveEdit ($event.target)") Save changes
        a(slot="form-bottom-item" @click="CancelEdit ($event.target)") Cancel
      div copy-text

    slot(name="annotation-text").text
    slot(name="annotation-status").text

    .annotation-buttons
      slot(name="annotation-button")

</template>

<script>
  import FormAdd from '../forms/FormAdd'
  export default {
    components: {
      FormAdd
    },
    methods: {
      CancelEdit (target) {
        var el = target.parentElement.parentElement.parentElement.parentElement
        console.log(el)
        // el[0].style.display = 'none'
        el[0].style.backgroundColor = 'red'
      },
      DeleteAnnotation () {
      },
      EditForm (target) {
        var el = target.parentNode.parentNode.parentElement.getElementsByClassName('annotation-form')
        el[0].style.display = 'block'
      },
      SaveEdit () {
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
  .annotation-buttons * {
    display: inline-block;
    background-color: red;
    margin-right: .2em;
    padding: .2em .5em;
    cursor: pointer;
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
