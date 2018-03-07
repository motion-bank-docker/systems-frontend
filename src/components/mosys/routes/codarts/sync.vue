<template lang="pug">

  center-card-full
    div(slot="form-logo")
    div(slot="form-title")
      // h4
        q-btn back
        | Video synchronisation

    div.row


      // zu synchronisierende Videos
      div.col-6.row
        p.col-12
          | Video to be synchronized:
          br
          | Modern Class Codarts 2017
        div.video.col-12
          iframe(width="100%" height="100%" src="https://www.youtube.com/embed/rCCHpbJ_IUc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen)
        div.col-12
          q-btn {{ $t('buttons.arrow_prev') }}
          q-btn() {{ $t('buttons.set_marker') }}
          q-btn {{ $t('buttons.arrow_next') }}
          br
          q-btn 0:42.559723



      // Referenz-Video
      div.col-6.row
        p.col-12.text-right
          | Synchronize with:
          br
          q-btn(@click="aktivieren" small) {{ $t('buttons.change') }}
          // | Modern Class Codarts 2017

        div.video.col-12
          iframe(v-if="video" width="100%" height="100%" src="https://www.youtube.com/embed/rCCHpbJ_IUc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen)
          q-list(v-if="!video").no-border
            q-item(v-for="n in 4" @click="aktivieren" highlight :key="n") Modern Class Codarts 201{{ n }}

        div.col-12.text-right
          q-btn {{ $t('buttons.arrow_prev') }}
          q-btn() {{ $t('buttons.set_marker') }}
          q-btn {{ $t('buttons.arrow_next') }}
          br
          q-btn 0:44.72



    div.text-center
      q-btn(color="primary") {{ $t('buttons.apply_synchronisation') }}
      br
      q-btn(@click="$router.push(`/piecemaker/groups/`)") {{ $t('buttons.done') }}

</template>

<script>
  import { QBtn, QList, QItem } from 'quasar-framework'
  import CenterCardFull from '../../../shared/layouts/CenterCardFull'

  export default {
    components: {
      QBtn,
      QList,
      QItem,
      CenterCardFull
    },
    data () {
      return {
        video: false
      }
    },
    methods: {
      aktivieren: function () {
        this.video = !this.video
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
    background-color: #111;
    overflow-y: scroll;
  }
</style>
