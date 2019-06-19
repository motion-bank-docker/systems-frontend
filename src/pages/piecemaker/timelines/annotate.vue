<template lang="pug">

  // LIVE ANNOTATE

  .q-pb-xl(v-if="timeline")

    // annotations
    .row
      q-list.col-xs-12.offset-xs-none.col-md-10.offset-md-1.col-lg-8.offset-lg-2(
      v-if="inputStyle", no-border, style="margin-top: 8rem;")

        q-item(v-for="(annotation, i) in annotations", :key="annotation._uuid", :id="annotation._uuid")
          q-item-main

            q-item-tile.items-center.row
              .col-6(v-if="annotation.target.selector")
                timecode-label(:millis="annotation.target.selector._valueMillis")

              .col-6.text-right.annotation-buttons
                q-btn.q-mr-sm(@click="cloneEntry(annotation)", size="sm", round, icon="filter_none")
                q-btn.q-mr-sm(v-if="staging", size="sm", round, icon="playlist_add",
                :disabled="annotation.body.type !== 'TextualBody'",
                @click="$refs.annotationField.addToVocabulary(annotation)")
                  // q-tooltip.q-caption.bg-dark(:offset="[0,5]") alt + e
                q-btn(@click="deleteAnnotation(annotation.id, i)", icon="delete", round, size="sm")

            q-item-tile
              q-input(v-if="annotation.body.type === 'TextualBody'", type="textarea",
              v-model="annotation.body.value", dark)
              q-input(v-if="annotation.body.type === 'VocabularyEntry'", type="textarea",
              v-model="annotation.body.value", dark, disabled)

      // input field
      q-page-sticky(position="top")
        annotation-field(
        @annotation="onAnnotation",
        ref="annotationField",
        :submit-on-num-enters="1",
        :selector-value="baseSelector",
        :hasTransparency="false")

</template>

<script>
  import { mapGetters } from 'vuex'
  import AnnotationField from '../../../components/piecemaker/partials/AnnotationField'
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  import constants from 'mbjs-data-models/src/constants'
  import TimecodeLabel from '../../../components/piecemaker/partials/TimecodeLabel'

  export default {
    components: {
      AnnotationField,
      TimecodeLabel
    },
    data () {
      return {
        timeline: undefined,
        annotations: [],
        inputStyle: true,
        staging: process.env.IS_STAGING,
        tagBox: false
      }
    },
    async mounted () {
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.uuid)
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      })
    },
    methods: {
      async cloneEntry (annotation) {
        const payload = {
          body: ObjectUtil.merge({}, annotation.body),
          target: ObjectUtil.merge({}, annotation.target)
        }
        payload.target.selector.value = { 'date-time:t': DateTime.local().toISO() }
        await this.createAnnotation(payload)
      },
      async onAnnotation (annotation) {
        console.debug('received annotation...', annotation)
        if (annotation) await this.createAnnotation(annotation)
      },
      async createAnnotation (annotation = {}) {
        try {
          const target = this.timeline.getInterval(annotation.target.selector.value['date-time:t'])
          const payload = ObjectUtil.merge(annotation, {target})
          const result = await this.$store.dispatch('annotations/post', payload)
          // if (result.body.type === 'VocabularyEntry') {
          if (result.body.type === 'VocabularyEntry' && !result.body.value) {
            const entry = await this.$vocabularies.getEntry(result.body.source.id)
            result.body.value = entry.value
          }
          this.annotations.push(result)
          this.annotations = this.annotations.sort(this.$sort.onRef)
          this.scrollToElement()
        }
        catch (err) {
          this.$handleError(this, err, 'errors.create_annotation_failed')
        }
      },
      async deleteAnnotation (id, index) {
        try {
          Assert.isType(id, 'string')
          Assert.isType(index, 'number')
          await this.$store.dispatch('annotations/delete', id)
          this.annotations.splice(index, 1)
        }
        catch (err) {
          this.$handleError(this, err, 'errors.delete_annotation_failed')
        }
      },
      scrollToElement () {
        // let delay = 250
        let delay = 1
        // alert(uuid)
        // window.location.href = '#' + uuid
        // window.scrollTo(0, document.body.scrollHeight)
        setTimeout(function () {
          window.scrollTo(0, document.body.scrollHeight)
        }, delay)
      },
      formatSelectorForList (val) {
        return DateTime.fromMillis(val._valueMillis)
          .toFormat(constants.config.TIMECODE_FORMAT)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .annotation-buttons
    opacity 0
  .q-item:hover .annotation-buttons
    opacity 1
</style>
