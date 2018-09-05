<template lang="pug">
  modal(ref="modal")
    template(slot="content")
      slot(name="content")
    .q-mt-md.text-center(slot="buttons")
      q-btn.q-mx-sm(@click="confirm") {{ $t('buttons.yes') }}
      q-btn.q-mx-sm(@click="cancel") {{ $t('buttons.no') }}
</template>

<script>
  import Modal from './Modal'
  export default {
    props: ['payload'],
    components: {
      Modal
    },
    methods: {
      show () {
        this.$refs.modal.show()
      },
      confirm () {
        this.$emit('confirm', this.payload)
        this.cancel()
      },
      cancel () {
        this.$emit('cancel')
        this.$refs.modal.close()
      }
    }
  }
</script>
