<template lang="pug">
  #q-app
    router-view
    mb-notification-service
    mb-conversion-jobs
    mb-extraction-jobs
    browser-warning
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
</style>
