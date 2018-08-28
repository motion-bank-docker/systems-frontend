<template lang="pug">

  // LIVE ANNOTATE

  .wrapper.relative-position
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
    .fixed-top.bg-dark.q-pb-md(style="top: 50px; width: 100%; z-index: 1000;")
      annotation-field(@annotation="onAnnotation", ref="annotationField")

    // CENTER: SHOW ANNOTATIONS
    //
    //
    .row.q-pb-xl
      .col-xs-12.offset-xs-none.col-md-10.offset-md-1.col-lg-8.offset-lg-2
        q-list(v-if="inputStyle", no-border, style="margin-top: 8rem;")
          q-item(v-for="(annotation, i) in annotations", :key="annotation.uuid", :id="annotation.uuid")
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
              q-btn(@click="deleteAnnotation(annotation.uuid, i)", icon="clear", round, small)

</template>

<script>
  import AnnotationField from '../../../components/piecemaker/partials/AnnotationField'
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  import uuidValidate from 'uuid-validate'
  import constants from 'mbjs-data-models/src/constants'
  import { Sorting } from 'mbjs-data-models/src/lib'

  export default {
    components: {
      AnnotationField
    },
    data () {
      return {
        annotations: [],
        inputStyle: true,
        staging: process.env.IS_STAGING,
        tagBox: false
      }
    },
    methods: {
      cloneEntry (annotation) {
        const payload = {
          body: ObjectUtil.merge({}, annotation.body),
          target: ObjectUtil.merge({}, annotation.target)
        }
        annotation.target.selector.value = DateTime.local().toISO()
        this.createAnnotation(payload)
      },
      onAnnotation (annotation) {
        console.debug('received annotation...', annotation)
        if (annotation) this.createAnnotation(annotation)
      },
      async createAnnotation (annotation = {}) {
        const payload = ObjectUtil.merge(annotation, {
          target: {
            id: `${process.env.TIMELINE_BASE_URI}${this.$route.params.id}`,
            type: constants.MAP_TYPE_TIMELINE
          }
        })
        const result = await this.$store.dispatch('annotations/post', payload)
        if (result.body.type === 'VocabularyEntry') {
          const entry = await this.$vocabularies.getEntry(result.body.source.id)
          result.body.value = entry.value
        }
        this.annotations.push(result)
        this.annotations = this.annotations.sort(Sorting.sortOnTarget)
        this.scrollToElement()
      },
      deleteAnnotation (uuid, index) {
        Assert.ok(uuidValidate(uuid))
        Assert.isType(index, 'number')
        return this.$store.dispatch('annotations/delete', uuid)
          .then(() => {
            this.annotations.splice(index, 1)
          })
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
        return selector.toFormat(constants.TIMECODE_FORMAT)
      }
    }
  }
</script>

<style scoped>
</style>
