<template lang="pug">

  // LIVE ANNOTATE

  .wrapper.relative-position(v-if="timeline")
    span(slot="form-logo")
    span(slot="form-title")

    // TOP LEFT
    //
    //
    .absolute-top-left.q-ma-md
      // BUTTON - GO BACK
      back-button.fixed-top-left.q-ma-md(slot="nav-button", style="top: 50px; z-index: 2100;")

    // TOP CENTER: INPUT AREA
    //
    //
    <!--.fixed-top.bg-dark.q-pb-md(style="top: 50px; width: 100%; z-index: 1000;")-->
    q-page-sticky(position="top")
      annotation-field(@annotation="onAnnotation", ref="annotationField", :submit-on-num-enters="2")

    // CENTER: SHOW ANNOTATIONS
    //
    //
    .row.q-pb-xl
      .col-xs-12.offset-xs-none.col-md-10.offset-md-1.col-lg-8.offset-lg-2
        q-list(v-if="inputStyle", no-border, style="margin-top: 8rem;")
          q-item(v-for="(annotation, i) in annotations", :key="annotation._uuid", :id="annotation._uuid")
            q-item-side(v-if="annotation.target.selector")
              | {{ formatSelectorForList(annotation.target.selector.value) }}
            q-item-main
              q-input(v-if="annotation.body.type === 'TextualBody'", type="textarea",
              v-model="annotation.body.value", dark)
              q-input(v-if="annotation.body.type === 'VocabularyEntry'", type="textarea",
              v-model="annotation.body.value", dark, disabled)
            q-item-side.text-right
              q-btn.q-mr-sm(@click="cloneEntry(annotation)", small, round, icon="filter_none")
              q-btn.q-mr-sm(v-if="staging", small, round, icon="playlist_add",
              :disabled="annotation.body.type !== 'TextualBody'",
              @click="$refs.annotationField.addToVocabulary(annotation)")
                // q-tooltip.q-caption.bg-dark(:offset="[0,5]") alt + e
              q-btn(@click="deleteAnnotation(annotation._uuid, i)", icon="clear", round, small)

</template>

<script>
  import AnnotationField from '../../../components/piecemaker/partials/AnnotationField'
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  import uuidValidate from 'uuid-validate'
  import constants from 'mbjs-data-models/src/constants'

  export default {
    components: {
      AnnotationField
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
    methods: {
      async cloneEntry (annotation) {
        const payload = {
          body: ObjectUtil.merge({}, annotation.body),
          target: ObjectUtil.merge({}, annotation.target)
        }
        payload.target.selector.value = DateTime.local().toISO()
        await this.createAnnotation(payload)
      },
      async onAnnotation (annotation) {
        console.debug('received annotation...', annotation)
        if (annotation) await this.createAnnotation(annotation)
      },
      async createAnnotation (annotation = {}) {
        try {
          const target = this.timeline.getTimelineTarget(annotation.target.selector.value)
          const payload = ObjectUtil.merge(annotation, {target})
          const result = await this.$store.dispatch('annotations/post', payload)
          if (result.body.type === 'VocabularyEntry') {
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
      async deleteAnnotation (uuid, index) {
        try {
          Assert.ok(uuidValidate(uuid))
          Assert.isType(index, 'number')
          await this.$store.dispatch('annotations/delete', uuid)
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
        const selector = DateTime.fromISO(val)
        return selector.toFormat(constants.config.TIMECODE_FORMAT)
      }
    }
  }
</script>

<style scoped>
</style>
