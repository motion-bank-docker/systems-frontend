<template lang="pug">
  q-modal(v-model="showModal", minimized)
    .bg-dark.q-pa-md.text-center
      .q-py-md {{ $t('labels.duplicate_timeline_title') }}
      q-input(v-model="title", dark)
      .q-mt-md
        q-btn.q-mx-xs(color="primary", @click="confirm") {{ $t('buttons.duplicate_timeline') }}
        q-btn.q-mx-xs(color="faded", @click="clear") {{ $t('buttons.cancel') }}
</template>

<script>
  export default {
    name: 'DuplicateTimelineModal',
    data () {
      return {
        showModal: false,
        title: undefined
      }
    },
    methods: {
      show (title) {
        this.showModal = true
        this.title = title
      },
      clear () {
        this.showModal = false
        this.title = undefined
      },
      confirm () {
        this.$emit('confirm', this.title)
        this.clear()
      }
    }
  }
</script>

<style scoped lanhg="stylus">
</style>
