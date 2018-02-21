<template lang='pug'>
  div
    div.splitscreen
      h1 Piecemaker
      p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est fugit id libero minus molestiae molestias nesciunt nobis optio, quae quasi quibusdam, rem tempora unde veritatis. Animi exercitationem maxime possimus.
      q-btn(@click="openURL('http://www.motionbank.org')") motionbank
    div.splitscreen
      h1 Mosys
      p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda dicta minima non sit. Accusamus architecto asperiores, assumenda autem ea impedit nesciunt non repudiandae soluta. Cum mollitia officia sint vel?
      q-btn(outline, icon="map", size="big", color="green", glossy="true") btn2
</template>

<script>
  import {
    QLayout,
    QBtn,
    openURL
  } from 'quasar-framework'
  export default {
    components: {
      QLayout,
      QBtn
    },
    data: function () {
      return {
        openURL
      }
    }
  }
</script>

<style scoped>
  .splitscreen {
    width: 50vw;
    display: inline-block;
  }
</style>
