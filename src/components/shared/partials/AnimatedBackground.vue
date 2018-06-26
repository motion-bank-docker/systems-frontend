<template lang="pug">
  q-transition(appear, enter="fadeIn", leave="fadeOut")
    vue-particles.mobile-hide.fullscreen.no-pointer-events(
    v-if="show",
    color="#474C55",
    :particleOpacity="0.3",
    :particlesNumber="particlesNumber",
    shapeType="edge",
    :particleSize="particleSize",
    linesColor="#A3ADC2",
    :linesWidth="1",
    :lineLinked="true",
    :lineOpacity="0.1",
    :linesDistance="linesDistance",
    :moveSpeed="moveSpeed",
    :hoverEffect="false",
    hoverMode="push",
    :clickEffect="false",
    clickMode="grab")
</template>

<script>
  import { Events } from 'quasar'

  import 'quasar-extras/animate/fadeIn.css'
  import 'quasar-extras/animate/fadeOut.css'

  import Vue from 'vue'
  import VueParticles from 'vue-particles'
  import Chance from 'chance'

  const chance = new Chance()
  Vue.use(VueParticles)

  export default {
    data: function () {
      return {
        show: false
      }
    },
    created: function () {
      const ctx = this
      Events.$on('show-animated-background', (state) => {
        ctx.show = state
      })
    },
    mounted: function () {
      this.show = this.$route.meta && this.$route.meta.animatedBackground
    },
    computed: {
      linesDistance: function () {
        return Math.min(Math.max(window.innerWidth, 1024) * 0.2, 240)
      },
      particlesNumber: function () {
        return Math.min(Math.max(Math.round(window.innerWidth * 0.1), 10), 72) // chance.integer({ min: 48, max: 64 })
      },
      moveSpeed: function () {
        return chance.floating({ min: 0.8, max: 1.2 })
      },
      particleSize: function () {
        return chance.integer({ min: 7, max: 14 })
      }
    }
  }
</script>

<style></style>
