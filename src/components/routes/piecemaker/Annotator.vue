<template lang="pug">
  div
    #video video

    #annotations
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
  #annotations {
    width: 30vw;
    display: inline-block;
    height: 80vh;
    overflow-y: scroll;
  }

  #video {
    background-color: rgba( 255, 0, 255, .1 );
    width: 70vw;
    min-height: 10em;
    display: inline-block;
    vertical-align: top;
  }
</style>
