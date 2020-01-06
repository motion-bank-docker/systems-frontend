<template lang="pug">
  div
</template>

<script>
  import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'
  import path from 'path'
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
        const jobIds = this.$store.state.conversions.jobIds
        for (let jobId of jobIds) {
          console.debug('Checking conversion job...', jobId)
          const job = await this.$store.dispatch('conversions/get', jobId)
          console.debug('Job status', jobId, job)
          if (job.failed) {
            this.$store.commit('conversions/removeJobId', jobId)
            this.$store.commit('conversions/removeJobDetail', jobId)
            this.$store.commit('notifications/addMessage', {
              body: 'messages.conversion_failed',
              type: 'error'
            })
          }
          else if (job.finished) {
            const headers = {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
            this.$store.commit('conversions/removeJobId', jobId)
            const detail = this.$store.state.conversions.jobDetails[jobId]
            if (detail.deleteOriginal) {
              try {
                await this.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(detail.source)}`, { headers })
              }
              catch (e) { console.error('Failed to remove video', e.message) }
            }
            const target = detail.target || {
              id: detail.timeline,
              type: 'Timeline',
              selector: {
                type: 'Fragment',
                value: DateTime.local().toISO()
              }
            }
            const payload = {
              body: {
                source: {
                  id: job.result.video,
                  type: 'video/mp4'
                },
                type: 'Media',
                purpose: detail.purpose || 'linking'
              },
              target
            }
            console.debug('Create annotation with payload', payload)
            const annotation = await this.$store.dispatch('annotations/post', payload)
            console.debug('Created annotation', annotation)
            if (detail.isPublic) {
              console.debug('Make annotation public', annotation.id)
              await this.$store.dispatch('acl/set', {id: annotation.id, role: 'public', permissions: ['get']})
            }
            this.$store.commit('conversions/removeJobDetail', jobId)
            this.$root.$emit('updateMedia')
            this.$root.$emit('jobResult', { annotation, jobId, detail })
            this.$store.commit('notifications/addMessage', {
              body: 'messages.conversion_successful',
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
