<template lang="pug">
  full-screen

    content-block(:position="'first'")
      headline(:content="'Search timelines'")

      // input field
      content-paragraph(:position="'first'")
        q-input.q-mb-sm(v-model="query", dark, float-label="Search", :before="[{icon: 'search'}]")
        .full-width.text-right
          q-btn.full-width(@click="search", color="primary") Search

      // results
      content-paragraph(v-for="(result, i) in results", :class="{'q-mt-xl': i === 0}")
        div(:class="{'ui-border-bottom': i < results.length - 1}")
          // div
          markdown-display.markdown-display(:content="result.body.value", :options="mdOptions")
          .q-my-md
            a.cursor-pointer(:href="`/piecemaker/media/${getMedia(result).annotation._uuid}/annotate#${result._uuid}`")
              | {{ getMedia(result).metadata.title }}
            p.text-grey-8 {{ formatDate(result.target.selector._valueMillis) }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import { DateTime } from 'luxon'
  import BackButtonNew from '../../../components/shared/buttons/BackButtonNew'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'
  import PageSubNav from '../../../components/shared/navigation/PageSubNav'

  export default {
    components: {
      PageSubNav,
      BackButtonNew,
      Headline,
      ContentBlock,
      ContentParagraph
    },
    data () {
      return {
        query: undefined,
        map: undefined,
        media: [],
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
      const media = await this.$store.dispatch('annotations/find', {
        'target.id': this.map.id,
        'body.type': 'Media'
      })
      this.media = media.items.sort(this.$sort.onRef).map(annotation => { return { annotation } })
      for (let i in this.media) {
        try {
          this.media[i].metadata = await this.$store.dispatch('metadata/get', this.media[i].annotation)
        }
        catch (e) { this.media[i].metadata = {} }
      }

      // const aggs = {
      //   annotations_per_minute: {
      //     date_histogram: {
      //       field: 'target.selector._valueMillis',
      //       calendar_interval: '1m'
      //     }
      //   }
      // }
      // const query = {
      //   match: { 'target.id': this.map.id }
      // }
      // const aggregations = await this.$store.dispatch('search/query', { index: 'annotations', aggs, query })
      // console.debug('Aggregations', aggregations)

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
          match: { 'body.value': this.query }
        }
        const result = await this.$store.dispatch('search/query', { index: 'annotations', query })
        this.results = (result && Array.isArray(result.hits) ? result.hits.sort(this.$sort.onRef) : [])
          .map(hit => hit._source)
        this.$q.loading.hide()
      },
      formatDate (millis) {
        return DateTime.fromMillis(millis).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
      },
      getMedia (annotation) {
        for (let video of this.media) {
          const
            annoTime = DateTime.fromMillis(annotation.target.selector._valueMillis),
            videoStart = DateTime.fromMillis(video.annotation.target.selector._valueMillis),
            videoEnd = videoStart.plus(video.metadata.duration * 1000)
          if (annoTime >= videoStart && annoTime < videoEnd) return video
        }
        return { annotation: {}, metadata: {} }
      }
    }
  }
</script>
