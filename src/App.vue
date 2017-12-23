<template lang="pug">
  #q-app
    vue-particles.mobile-hide.fullscreen.no-pointer-events(
    color="#e6e6e6",
    :particleOpacity="0.3",
    :particlesNumber="120",
    shapeType="edge",
    :particleSize="2",
    linesColor="#989898",
    :linesWidth="1",
    :lineLinked="true",
    :lineOpacity="0.3",
    :linesDistance="180",
    :moveSpeed="1",
    :hoverEffect="false",
    hoverMode="push",
    :clickEffect="false",
    clickMode="grab")
    q-layout(ref="layout", view="hHh LpR fFf")
      mbui-user-nav(slot='header')
      router-view
    mbui-service-user
    mbui-service-notification
</template>

<script>
/*
 * Root component
 */
import { QLayout } from 'quasar-framework'
export default {
  components: { QLayout }
}
</script>

<style></style>
