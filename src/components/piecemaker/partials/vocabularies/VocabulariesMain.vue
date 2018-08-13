<template lang="pug">

  // TOP CENTER
  //
  //
  .row.fixed-top.q-mt-md.bg-dark(style="z-index: 2000; top: 52px;")

    // BUTTON - SWITCH BETWEEN TEXT INPUT AND TAG BOX

    .col-xs-2.offset-xs-1.col-md-1.offset-md-1.col-lg-1.offset-lg-2.text-right.q-pa-sm.q-pr-md
      q-btn.text-primary.bg-grey-10(v-if="!tagBox && staging", @click="tagBox = true", round) #

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

</template>

<script>
  // import Full from 'mbjs-quasar/src/components/layouts/Full'
  import Vocabularies from './Vocabularies'
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import { DateTime } from 'luxon'
  import uuidValidate from 'uuid-validate'
  import constants from 'mbjs-data-models/src/constants'
  import { Sorting } from 'mbjs-data-models/src/lib'

  export default {
    components: {
      // Full,
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
        currentVal: {
          time: undefined,
          string: undefined
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
          this.currentVal.string = this.currentBody.value
          this.currentVal.time = this.currentSelector.value
          console.log(this.currentVal)
          this.prevKey = undefined
          this.tagBox = false
          const bodyLength = this.currentBody.value.length
          if (bodyLength > 2) {
            this.currentBody.value = this.currentVal.string.substr(0, bodyLength - 2)
            this.$emit('currentString', this.currentVal)
            // this.$emit('currentTime', this.currentSelector.value)
            this.currentBody.value = undefined
            this.currentSelector.value = undefined
            // this.createAnnotation()
          }
          else {
            this.currentBody.value = undefined
          }
        }
        else if (e.keyCode === 13 && this.tagBox) { // enter vocabulary
          this.currentVal.string = this.highlightedTag
          this.currentVal.time = this.currentSelector.value
          // this.createAnnotation()
          this.$emit('currentString', this.currentVal)
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
