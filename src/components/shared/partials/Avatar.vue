<template lang="pug">
  div
    svg.avatar.responsive(v-if="type === 1", :width="width", :height="height", :data-jdenticon-value="uuid")
    img.avatar.responsive(v-if="type === 2", :width="width", :height="height", :src="src")
</template>

<script>
  import 'jdenticon/dist/jdenticon'
  export default {
    props: ['width', 'height', 'uuid', 'src'],
    computed: {
      type () {
        if (this.uuid) return 1
        if (this.url) return 2
        return 0
      }
    }
  }
</script>
