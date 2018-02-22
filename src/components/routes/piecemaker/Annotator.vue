<template lang="pug">
  div
    .video video
    .annotations
      annotation
      annotation
      annotation
      annotation
      annotation
      annotation
      annotation
      annotation
      annotation

</template>

<script>
  import Annotation from '../../partials/annotation.vue'
  export default {
    components: {
      Annotation
    }
    // name: "annotator"
  }
</script>

<style scoped>
  .annotations {
    border: 1px solid blue;
    width: 30vw;
    display: inline-block;
    height: 50vh;
    overflow-y: scroll;
  }
  .annotations > div {
    background-color: red;
    margin-bottom: .2em;
  }
  .video {
    background-color: rgba( 255, 255, 255, .1 );
    width: 70vw;
    min-height: 10em;
    display: inline-block;
    vertical-align: top;
  }
</style>
