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

      q-btn(slot="nav-button", icon="keyboard_backspace",
      @click="$router.push({name: 'piecemaker.timelines.show', params: {id: $route.params.id}})", round, small)

    // TOP CENTER
    //
    //
    .row.fixed-top.q-mt-md(style="z-index: 2000; top: 52px;")

      // BUTTON - SWITCH BETWEEN TEXT INPUT AND TAG BOX

      .col-xs-2.offset-xs-1.col-md-1.offset-md-1.col-lg-1.offset-lg-2.text-right.q-pa-sm.q-pr-md
        q-btn.text-primary.bg-grey-10(v-if="!tagBox && staging", @click="tagBox = true", round) #
          // q-tooltip.bg-dark.q-caption(:offset="[0,10]") Click here or type # to open the vocabulary dialog

      .col-xs-8.col-md-8.col-lg-6.bg-grey-10.relative-position(:class="[tagBox ? 'shadow-4' : '']")

        // TEXT INPUT

        q-input.q-pa-md(
        v-model="currentBody.value", :class="[tagBox ? 'q-pl-xl text-primary' : 'text-white']",
        @keyup="keyMonitor", @keydown.enter="handlerKeyPress", type="textarea", autofocus, dark)
        .absolute-top.q-mt-sm(v-if="staging", style="width: 3rem;")
          q-btn.q-ml-sm.q-mt-xs.q-mr-none.text-primary(
          v-if="tagBox", @click="tagBox = false", round, flat, icon="clear", size="sm")

        // TAG BOX

        div(v-if="tagBox && staging")
          vocabularies(:parent='parent', :pressedKey="pressedKey", :str="currentBody.value", @selectedVocab="selectedV")

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
              // button below ("re-use"):
              // appears only on tag types
              q-btn.q-mr-sm(@click="", small, rounded) re-use
                // q-tooltip.q-caption.bg-dark(:offset="[0,5]") alt + e
              q-btn(@click="deleteAnnotation(annotation.uuid, i)", icon="clear", round, small)

</template>

<script>
  import Full from 'mbjs-quasar/src/components/layouts/Full'
  import Vocabularies from '../../../components/piecemaker/partials/vocabularies/Vocabularies'
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  import uuidValidate from 'uuid-validate'
  import constants from 'mbjs-data-models/src/constants'
  import { Sorting } from 'mbjs-data-models/src/lib'

  export default {
    components: {
      Full,
      Vocabularies
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
      /* toggleInputStyle () {
        this.inputStyle = !this.inputStyle
      }, */
      selectedV (val) {
        this.highlightedTag = val
      },
      handlerKeyPress (e) {
        this.pressedKey = e.keyCode
      },
      keyMonitor (e) {
        if (this.prevKey === 13 && e.keyCode === 13 && !this.tagBox) { // enter text input
          this.prevKey = undefined
          this.tagBox = false
          const bodyLength = this.currentBody.value.length
          if (bodyLength > 2) {
            this.currentBody.value = this.currentBody.value.substr(0, bodyLength - 2)
            this.createAnnotation()
          }
          else {
            this.currentBody.value = undefined
          }
        }
        else if (e.keyCode === 13 && this.tagBox) { // enter vocabulary
          this.currentBody.value = this.highlightedTag
          this.createAnnotation()
          this.tagBox = false
          this.currentBody.value = undefined
          // console.log(this.highlightedTag)
        }
        else if (e.keyCode === 27) { // escape
          this.tagBox = false
          this.currentBody.value = undefined
        }
        else if (e.keyCode === 220 || e.keyCode === 40) { // hashtag or arrow down
          this.currentSelector.value = DateTime.local().toISO()
          this.tagBox = true
          if (e.keyCode === 220) this.currentBody.value = undefined
        }
        else {
          if (this.currentSelector.value === undefined) {
            this.currentSelector.value = DateTime.local().toISO()
          }
          this.prevKey = e.keyCode
        }
        // console.log(e.keyCode)
      },
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
