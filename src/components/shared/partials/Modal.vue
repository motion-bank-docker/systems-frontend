<template lang="pug">
  q-modal(v-model="showModal", minimized)
    .bg-dark.position-relative.q-pa-xl
      slot(name="content")
      slot(name="buttons")
        q-btn.q-ml-lg(@click="close", :icon="closeIcon", round)
</template>

<script>
  export default {
    props: ['closeIcon'],
    data () {
      return {
        showModal: false
      }
    },
    methods: {
      show () {
        this.showModal = true
      },
      close () {
        this.showModal = false
      }
    }
  }
</script>
