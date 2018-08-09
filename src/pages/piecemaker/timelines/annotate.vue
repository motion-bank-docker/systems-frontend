<template lang="pug">

  // LIVE ANNOTATE

  .wrapper.relative-position
    span(slot="form-logo")
    span(slot="form-title")

    // TOP LEFT
    //
    //
    .absolute-top-left.q-ma-md

      // BUTTON: GO BACK

      q-btn(slot="nav-button", icon="keyboard_backspace", @click="$router.push(`/piecemaker/timelines/show`)", round, small)

      // BUTTON: SWITCH INPUT STYLE

        q-btn.bg-white.cursor-pointer.q-mx-xs(@click="toggleInputStyle()", :class="{'bg-dark': inputStyle}", round)
          q-icon(name="autorenew")

    // TOP CENTER
    //
    //
    .row.fixed-top.q-mt-md(style="width: 60%; left: 20%; z-index: 2000; top: 52px;")

      .col-1.text-right.q-pa-sm.q-pr-md
        q-btn(v-if="!tagBox", @click="tagBox = true", round) #
          q-tooltip.bg-dark.q-caption(:offset="[0,10]") Click here or type # to open the vocabulary dialog
        q-btn(v-else, @click="tagBox = false" ,icon="clear", round)
          q-tooltip.bg-dark.q-caption(:offset="[0,10]") Click here or press escape to close the vocabulary dialog

      .col-10(:class="[tagBox ? 'bg-grey-10' : 'bg-grey-10']")
        // TEXT INPUT

        // q-input#input.bg-grey-10.text-white.q-pa-md(v-else, v-model="currentBody.value", @keyup="keyMonitor", type="textarea", autofocus, dark)
        q-input.text-white.q-pa-md(
        v-model="currentBody.value", @keyup="keyMonitor", @keydown="handlerKeyPress", type="textarea", autofocus, dark)

        // TAG BOX

        div(v-if="tagBox")
          vocabularies(:parent='parent', :pressedKey="pressedKey", :str="currentBody.value")

    // RIGHT SIDE: SHOW ANNOTATIONS
    //
    //
    q-list(v-if="inputStyle", no-border)#list
      q-item.annotation(v-for="(annotation, i) in annotations", :key="annotation.uuid", :id="annotation.uuid")
        q-item-side(v-if="annotation.target.selector") {{ formatSelectorForList(annotation.target.selector.value) }}
        q-item-main
          q-item-tile.text-left
            q-input(type="textarea", v-model="annotation.body.value", dark)
        q-item-side.text-right
          q-btn(@click="deleteAnnotation(annotation.uuid, i)", icon="clear", round, small)

</template>

<script>
  import Full from '../../../components/shared/layouts/Full'
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
        inputStyle: true,
        parent: 'live-annotate',
        pressedKey: '',
        prevKey: undefined,
        tagBox: false
      }
    },
    methods: {
      toggleInputStyle () {
        this.inputStyle = !this.inputStyle
      },
      handlerKeyPress (e) {
        this.pressedKey = e.keyCode
      },
      keyMonitor (e) {
        if (this.prevKey === 13 && e.keyCode === 13) {
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
        else if (e.keyCode === 27) {
          this.tagBox = false
          this.currentBody.value = undefined
        }
        else if (e.keyCode === 220) {
          this.tagBox = true
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
  #list {
    /* background-color: #eee; */
    width: calc(100vw - 20rem);
    min-height: calc(100vh - 52px - 2rem);
    margin-left: 5rem;
    overflow-y: scroll;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0;
    padding-top: 8em;
    border: 0px solid red!important;
    position: relative;
  }
  .annotation {
    padding: .75em 1em;
  }
    .annotation:hover {
      background-color: rgba( 255, 255, 255, .05 );
    }
  .q-item-side {
    padding: 0 1.5em;
    vertical-align: top;
  }
  .color {
    color: white!important;
  }
</style>
