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

      q-btn.fixed-top-left.q-ma-md(slot="nav-button", icon="keyboard_backspace",
      @click="$router.push({name: 'piecemaker.timelines.show', params: {id: $route.params.id}})", round, small,
      style="top: 50px; z-index: 2100;")

    // TOP CENTER: INPUT AREA
    //
    //
    .fixed-top(style="top: 50px; width: 100%; z-index: 1000;")
      vocabularies-main(@currentString="currentString")

    // CENTER: SHOW ANNOTATIONS
    //
    //
    .row
      .col-xs-12.offset-xs-none.col-md-10.offset-md-1.col-lg-8.offset-lg-2
        q-list(v-if="inputStyle", no-border, style="margin-top: 8rem;")
          q-item(v-for="(annotation, i) in annotations", :key="annotation.uuid", :id="annotation.uuid")
            q-item-side(v-if="annotation.target.selector")
              | {{ formatSelectorForList(annotation.target.selector.value) }}
            q-item-main
              q-input(type="textarea", v-model="annotation.body.value", dark)
            q-item-side.text-right
              q-btn.q-mr-sm(@click="cloneEntry(annotation.body.value)", small, round, icon="filter_none")
              q-btn.q-mr-sm(@click="", small, round, icon="playlist_add")
                // q-tooltip.q-caption.bg-dark(:offset="[0,5]") alt + e
              q-btn(@click="deleteAnnotation(annotation.uuid, i)", icon="clear", round, small)

</template>

<script>
  // import Full from 'mbjs-quasar/src/components/layouts/Full'
  // import Vocabularies from '../../../components/piecemaker/partials/vocabularies/Vocabularies'
  import VocabulariesMain from '../../../components/piecemaker/partials/vocabularies/VocabulariesMain'
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  import uuidValidate from 'uuid-validate'
  import constants from 'mbjs-data-models/src/constants'
  import { Sorting } from 'mbjs-data-models/src/lib'

  export default {
    components: {
      // Full,
      // Vocabularies,
      VocabulariesMain
    },
    data () {
      return {
        annotations: [],
        currentBody: {
          value: undefined,
          purpose: 'commenting',
          type: 'TextualBody'
        },
        currentSelector: {
          type: 'Fragment',
          value: undefined
        },
        highlightedTag: undefined,
        inputStyle: true,
        parent: 'live-annotate',
        pressedKey: '',
        prevKey: undefined,
        staging: process.env.IS_STAGING,
        tagBox: false
      }
    },
    methods: {
      cloneEntry (val) {
        // this.$refs.vocabInput.$el[0].focus()
        this.currentBody.value = val
        this.currentSelector.value = this.formatSelectorForList(DateTime.local().toISO())
        this.createAnnotation()
      },
      currentString (val) {
        // console.log(val, '------')
        if (val.string !== undefined) {
          const bodyLength = val.string.length
          if (bodyLength > 2) {
            this.currentBody.value = val.string
            this.currentSelector.value = val.time
            this.createAnnotation()
            this.currentBody.value = undefined
          }
          else {
            this.currentBody.value = undefined
          }
        }
      },
      /* selectedV (val) {
        this.highlightedTag = val
      },
      handlerKeyPress (e) {
        this.pressedKey = e.keyCode
      }, */
      createAnnotation () {
        const _this = this
        const annotation = {
          body: ObjectUtil.merge({}, _this.currentBody),
          target: {
            id: `${process.env.TIMELINE_BASE_URI}${_this.$route.params.id}`,
            type: constants.MAP_TYPE_TIMELINE,
            selector: ObjectUtil.merge({}, _this.currentSelector)
          }
        }
        annotation.body.value = annotation.body.value.trim()
        this.currentBody.value = undefined
        this.currentSelector.value = undefined
        return this.$store.dispatch('annotations/post', annotation)
          .then(annotation => {
            _this.annotations.push(annotation)
            _this.annotations = _this.annotations.sort(Sorting.sortOnTarget)
            _this.scrollToElement()
            // _this.scrollToElement(annotation.uuid)
          })
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
        // alert(uuid)
        // window.location.href = '#' + uuid
        // window.scrollTo(0, document.body.scrollHeight)
        setTimeout(function () {
          window.scrollTo(0, document.body.scrollHeight)
        }, 250)
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
