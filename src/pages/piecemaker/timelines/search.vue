<template lang="pug">
  full-screen

    back-button-new(v-if="!isMobile", slot="backButton", :target="'piecemaker.timelines.list'")

    headline(:content="'Search for'")

    <!--q-field(label="Search for", dark, :label-width="2")-->
    .row.justify-right
      <!--q-field.q-mb-sm.full-width(icon="search")-->
      q-field.q-mb-sm.full-width
        q-input.full-width(v-model="query", dark, float-label="Search")
      q-btn(@click="search", color="primary") Search

    .row.q-mt-md(v-for="result in results")
      .col-md-6
        markdown-display.markdown-display(:content="result.body.value", :options="mdOptions")
        small {{ getVideo(result).metadata.title }}
      .col-md-6
        p {{ formatDate(result.target.selector._valueMillis) }}
        p
          a(:href="`/piecemaker/videos/${getVideo(result).annotation._uuid}/annotate#${result._uuid}`") Goto Video
</template>

<script>
  import { mapGetters } from 'vuex'
  import { DateTime } from 'luxon'
  import BackButtonNew from '../../../components/shared/buttons/BackButtonNew'
  import Headline from '../../../components/shared/elements/Headline'

  export default {
    components: {
      BackButtonNew,
      Headline
    },
    data () {
      return {
        query: undefined,
        map: undefined,
        videos: [],
        results: [],
        mdOptions: {
          target: '_blank'
        }
      }
    },
    async mounted () {
      this.$root.$emit('setBackButton', '/piecemaker/timelines')
      this.$q.loading.show()
      this.map = await this.$store.dispatch('maps/get', this.$route.params.uuid)
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
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
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
      formatDate (millis) {
        return DateTime.fromMillis(millis).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
      },
      getVideo (annotation) {
        for (let video of this.videos) {
          const
            annoTime = DateTime.fromMillis(annotation.target.selector._valueMillis),
            videoStart = DateTime.fromMillis(video.annotation.target.selector._valueMillis),
            videoEnd = videoStart.plus(video.metadata.duration * 1000)
          if (annoTime >= videoStart && annoTime < videoEnd) return video
        }
        return {}
      }
    }
  }
</script>
