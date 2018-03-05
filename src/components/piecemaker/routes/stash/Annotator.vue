<template lang="pug">

  div
    #video video

    #annotations
      div(v-for='item in items')
        annotation.anno
          div(slot="annotation-timestamp") {{ item.timestamp }}
          div(slot="annotation-text") {{ item.text }}
          div(slot="annotation-status") {{ item.status }}

    #new-annotation
      input(type="text" name="fname" autocomplete="off")#new-input

</template>

<script>
  import {
    QDataTable
  } from 'quasar-framework'
  import Annotation from '../../../shared/partials/annotation.vue'
  export default {
    components: {
      QDataTable,
      Annotation
    },
    created: function () {
      window.addEventListener('keydown', this.Annotate)
    },
    methods: {
      Annotate (e) {
        document.getElementById('new-annotation').style.display = 'block'
        document.getElementById('new-input').focus()

        // if (e.keyCode === 13 && document.getElementById('new-input').value !== '') {
        if (e.keyCode === 13) {
          document.getElementById('new-annotation').style.display = 'none'

          var newObj = [document.getElementById('new-input').value]

          // var Vue = require('vue')

          this.$set(this.items.lenght + 1, this.items.length + 1, newObj)
          console.log(this.items)

          document.getElementById('new-input').value = ''
        }

        if (e.keyCode === 27) {
          document.getElementById('new-annotation').style.display = 'none'
          document.getElementById('new-input').value = ''
        }
      }
    },
    data: () => ({
      columns: [
        {
          name: 'text',
          required: true,
          label: 'Group Title',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'status',
          required: true,
          label: 'Status',
          align: 'left',
          field: 'status',
          sortable: true
        },
        {
          name: 'timestamp',
          required: true,
          label: 'Timestamp',
          align: 'left',
          field: 'timestamp',
          sortable: true
        }
      ],
      items: [
        {
          text: 'Hier steht eine Anmerkung.',
          status: 'public',
          timestamp: 'today'
        }, {
          text: 'Noch eine Anmerkung.',
          status: 'private',
          timestamp: '2017-12-03'
        }, {
          text: 'Noch eine.',
          timestamp: '2017-12-03'
        }, {
          text: 'Es hört nicht auf.',
          status: 'public',
          timestamp: '2013-03-29'
        }
      ]
    })
    // name: "annotator"
  }
</script>

<style lang="styl" scoped>

  #annotations {
    width: 30vw;
    display: inline-block;
    height: 90vh;
    overflow-y: scroll;
  }

  #new-annotation {
     position: absolute;
     top: 1em;
     right: 1em;
     background-color: #eee;
     padding: 1em;
     display: none;
   }
  #new-input {
    outline: none;
    background-color: transparent;
    border: 0;
  }
  #video {
    /* background-color: rgba( 255, 0, 255, .1 ); */
    width: 70vw;
    min-height: 10em;
    display: inline-block;
    vertical-align: top;
  }
  .MyClass {
    background-color: red;
  }
  .democlass {
    background-color: green;
  }
</style>
