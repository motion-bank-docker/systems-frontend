<template lang="pug">

  card-full
    h4(slot="form-title") Live Annotation
    span(slot="form-logo")
    div.buttons
      template(v-for="group in buttons")
        div.button-group
          template(v-for="button in group")
            div.button
              q-btn(color="primary", outline, @click="event => {handleButtonClick(event, button)}") {{button.label}}

</template>

<script>
  import CardFull from 'mbjs-quasar/src/components/layouts/CardFull'
  import constants from 'mbjs-data-models/src/constants'
  import { DateTime } from 'luxon'

  export default {
    components: {
      CardFull
    },
    data () {
      return {
        buttons: [
          [
            {label: 'complex eclectic technique without “effort”'},
            {label: 'deep natural physicality'},
            {label: 'organic playful energy'}
          ],
          [
            {label: 'complex space patterns'},
            {label: 'multi levels in moving body and extremities'},
            {label: 'back space in fall actions'}
          ],
          [
            {label: 'rhythmical complexity'},
            {label: 'constant changing dynamic patterns'},
            {label: '“grooving” drive and energy'}
          ]
        ]
      }
    },
    methods: {
      handleButtonClick (event, button) {
        const timelineId = this.$route.params.timelineId
        let annotation = {
          body: {
            value: button.label,
            purpose: 'commenting',
            type: 'TextualBody'
          },
          target: {
            id: `${process.env.TIMELINE_BASE_URI}${timelineId}`,
            type: constants.MAP_TYPE_TIMELINE,
            selector: {
              type: 'Fragment',
              value: DateTime.local().toISO()
            }
          }
        }
        this.$store.dispatch('annotations/create', annotation)
      }
    }
  }
</script>

<style scoped lang="stylus">

  .buttons
    width 100%
    display flex

  .button-group
    width 80%
    margin 1em

  .button
    margin-bottom 1.5em

</style>
