<template lang="pug">

  q-layout

    div#btn-back
      q-btn(@click="$router.push(`/piecemaker/groups/`)" color="grey") {{ $t('buttons.done') }}

    video-player(v-if="video", :src="video")


    #pop-up(v-bind:class="{ activeCondition: active }")
      div.text-right.outline(@click="aktivieren" v-if="!active" color="primary")
        | Start typing or click here

      div(v-if="active")
        q-input(@keyup.enter="deaktivieren" @keyup.esc="deaktivieren" v-model="area" type="textarea" float-label="Start typing")
        div.row
          .col-6
            q-btn(@click="deaktivieren" small) Esc
            // br
              span or [Esc]
          .col-6.text-right
            q-btn(@click="deaktivieren" small) Enter
            // br
              span or [Enter]


    // div(v-if="active" slot="right")
    div(slot="right")
      div
        .annotation(v-for="annotation in annotations")
          .row
            .col-6.timestamp
              q-btn(small) 0:21
            .col-6.text-right
              q-btn(small) {{ $t('buttons.delete') }}
              q-btn(small) {{ $t('buttons.save') }}
          q-input(type="textarea") {{ annotation.message }}
          // .row
            .col-12.text-right
              a(@click="") add comment
            .col-12
              q-input(type="textarea")

</template>

<script>
  import { QBtn, QLayout, QInput } from 'quasar-framework'
  import VideoPlayer from '../../../shared/media/VideoPlayer'
  export default {
    components: {
      QBtn,
      QLayout,
      QInput,
      VideoPlayer
    },
    mounted () {
      const context = this
      if (this.$route.params.id) {
        this.$store.dispatch('annotations/get', this.$route.params.id)
          .then(result => {
            if (result.body) {
              context.video = result.body
            }
          })
      }
    },
    data () {
      return {
        video: undefined,
        active: false,
        annotations: [{
          message: 'Animi atque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }, {
          message: 'Mimi atque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }, {
          message: 'Animi atque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }, {
          message: 'Animi atque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }, {
          message: 'Animi atque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }, {
          message: 'Ptque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }, {
          message: 'Animi atque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }, {
          message: 'Animi atque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }, {
          message: 'Animi atque dolor hic laudantium necessitatibus nisi, nulla quia quisquam repellendus!'
        }
        ]
      }
    },
    methods: {
      aktivieren: function () {
        this.active = true
      },
      deaktivieren: function () {
        this.active = false
      }
    }
  }
</script>

<style scoped>
  #btn-back {
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 9999;
  }
  #pop-up {
    position: absolute;
    top: 1em;
    right: 1em;
    width: 33%;
    cursor: pointer;
  }
  #pop-up > div {
    padding: 1em;
    background-color: white;
  }
  .annotation {
    padding: .5em;
    margin-bottom: 2em;
  }
  .annotation:not(:last-of-type) {
    margin-bottom: 2em;
  }
  .annotation > .row {
    margin-bottom: .25em;
  }
  .activeCondition {
    box-shadow: 0 0 10px -2px rgba( 0, 0, 0, .35 );
    background-color: rgba( 255, 255, 255, 1 );
  }
  .outline {
    border: 1px solid white;
    position: absolute;
    right: 0;
  }
</style>
