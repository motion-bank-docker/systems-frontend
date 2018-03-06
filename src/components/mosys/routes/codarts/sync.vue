<template lang="pug">

  center-card-full
    div(slot="form-logo")
    div(slot="form-title")
      // h4
        q-btn back
        | Video synchronisation

    div.row
      // Referenz-Video
      div.col-6.row
        p
          | Reference video:
          br
          | Modern Class Codarts 2017
          q-btn(small) change
        div.video.col-12
          iframe(v-if="video" width="100%" height="100%" src="https://www.youtube.com/embed/rCCHpbJ_IUc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen)
          div(v-if="change")
            p(v-for="n in 4") Modern Class Codarts 201{{ n }}
        div
          q-btn <
          q-btn() set marker
          q-btn >
          br
          q-btn 0:44.72

      // zu synchronisierende Videos
      div.col-6.row
        p.col-12.text-right
          | Video to be synchronized:
          br
          q-btn(small) change
          | Modern Class Codarts 2017
        div.video.col-12
          iframe(width="100%" height="100%" src="https://www.youtube.com/embed/rCCHpbJ_IUc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen)
        div.text-right.col-12
          q-btn <
          q-btn() set marker
          q-btn >
          br
          q-btn 0:42.559723

    div.text-center
      q-btn(disable color="green") Apply synchronisation
      br
      q-btn(disable) Done
      // q-btn(@click="") Cancel

</template>

<script>
  import { QBtn } from 'quasar-framework'
  import CenterCardFull from '../../../shared/layouts/CenterCardFull'

  export default {
    components: {
      QBtn,
      CenterCardFull
    },
    data () {
      return {
        video: true,
        change: false
      }
    }
  }
</script>

<style scoped>
  iframe {
    margin-bottom: .5em;
  }
  .video {
    height: 315px;
    background-color: #333;
    overflow-y: scroll;
  }
</style>
