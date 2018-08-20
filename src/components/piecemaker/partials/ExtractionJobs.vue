<template lang="pug">
  div
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        pollTimeout: undefined
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    mounted () {
      const _this = this
      this.pollTimeout = setTimeout(function () {
        _this.checkJobs()
      }, 1000)
    },
    beforeDestroy () {
      if (this.pollTimeout) clearTimeout(this.pollTimeout)
    },
    methods: {
      async checkJobs () {
        this.pollTimeout = undefined
        const jobIds = this.$store.state.timecodes.jobIds
        for (let jobId of jobIds) {
          console.debug('checking timecode extraction job...', jobId)
          const job = await this.$store.dispatch('timecodes/get', jobId)
          console.debug('job status', jobId, job)
          if (job.failed) {
            this.$store.commit('timecodes/removeJobId', jobId)
            this.$store.commit('timecodes/removeJobDetail', jobId)
            this.$store.commit('notifications/addMessage', {
              body: 'messages.timecode_extraction_failed',
              type: 'error'
            })
          }
          else if (job.finished) {
            this.$store.commit('timecodes/removeJobId', jobId)
            const detail = this.$store.state.timecodes.jobDetails[jobId]
            this.$store.commit('timecodes/removeJobDetail', jobId)
            const message = {
              result: job.result,
              detail,
              user: this.user.uuid
            }
            await this.$store.dispatch('logging/log', { action: 'convert', message })
            this.$root.$emit('extraction-complete', message)
            this.$store.commit('notifications/addMessage', {
              body: 'messages.timecode_extraction_successful',
              type: 'success'
            })
          }
        }
        const _this = this
        this.pollTimeout = setTimeout(function () {
          _this.checkJobs()
        }, 1000)
      }
    }
  }
</script>
