<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small)
    .row
      .col-md-12
        q-field(label="Search for", dark)
          q-input(v-model="query", dark)
        q-btn(@click="search", color="primary") Search
    .row.q-mt-md(v-for="result in results")
      .col-md-6
        markdown-display.markdown-display(:content="result.body.value")
        small {{ getVideo(result).metadata.title }}
      .col-md-6
        p {{ formatDate(result.target.selector.value) }}
        p
          a(:href="`/piecemaker/videos/${getVideo(result).annotation.uuid}/annotate#${result.uuid}`") Goto Video
</template>

<script>
  import { DateTime } from 'luxon'

  export default {
    data () {
      return {
        query: undefined,
        map: undefined,
        videos: [],
        results: []
      }
    },
    async mounted () {
      this.$q.loading.show()
      this.map = await this.$store.dispatch('maps/get', this.$route.params.id)
      const videos = await this.$store.dispatch('annotations/find', {
        'target.id': this.map.id,
        'body.type': 'Video'
      })
      this.videos = videos.items.sort(this.$sort.onRef).map(annotation => { return { annotation } })
      for (let i in this.videos) {
        try {
          this.videos[i].metadata = await this.$store.dispatch('metadata/get', this.videos[i].annotation)
        }
        catch (e) { this.videos[i].metadata = {} }
      }
      this.$q.loading.hide()
    },
    methods: {
      async search () {
        this.$q.loading.show()
        const query = {
          'target.id': this.map.id,
          'body.type': 'TextualBody',
          'body.value': RegExp(`.*${this.query}.*`, 'ig')
        }
        const result = await this.$store.dispatch('annotations/find', query)
        this.results = result && Array.isArray(result.items) ? result.items.sort(this.$sort.onRef) : []
        this.$q.loading.hide()
      },
      formatDate (iso) {
        return DateTime.fromISO(iso).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
      },
      getVideo (annotation) {
        for (let video of this.videos) {
          const
            annoTime = DateTime.fromISO(annotation.target.selector.value, { setZone: true }),
            videoStart = DateTime.fromISO(video.annotation.target.selector.value, { setZone: true }),
            videoEnd = videoStart.plus(video.metadata.duration * 1000)
          if (annoTime >= videoStart && annoTime < videoEnd) return video
        }
        return {}
      }
    }
  }
</script>
