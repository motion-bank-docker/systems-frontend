<template lang="pug">
  div
    q-chips-input(
    v-model="tags",
    dark,
    :float-label="$t('labels.tags')",
    chips-color="white",
    chips-bg-color="primary")
</template>

<script>
  export default {
    data () {
      return {
        tags: []
      }
    },
    watch: {
      tags (val) {
        this.$emit('updateTags', val)
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
