<template lang="pug">
  .wrapper
    q-btn#button-back(slot="nav-button", icon="keyboard_backspace", @click="$router.push(`/piecemaker/groups/show`)", round, small)
    span(slot="form-logo")
    span(slot="form-title")

    q-input#input.bg-grey-10.text-white.q-pa-md(v-model="currentBody.value", @keyup="keyMonitor", type="textarea", autofocus, dark)
    q-list(no-border)#list
      q-item.annotation(v-for="(annotation, i) in annotations", :key="annotation.uuid", :id="annotation.uuid")
        q-item-side(v-if="annotation.target.selector") {{ formatSelectorForList(annotation.target.selector.value) }}
        q-item-main
          q-item-tile.text-left
            q-input.color(type="textarea" v-model="annotation.body.value")
        q-item-side.text-right
          q-btn(@click="deleteAnnotation(annotation.uuid, i)", icon="clear", round, small)
</template>

<script>
  import Full from '../../../components/shared/layouts/Full'
  import { ObjectUtil, Assert } from 'mbjs-utils'
  import uuidValidate from 'uuid-validate'
  import constants from '../../../lib/constants'
  import annotations from '../../../lib/annotations'

  const TimelineSelector = annotations.selectors.TimelineSelector

  export default {
    components: {
      Full
    },
    data () {
      return {
        prevKey: undefined,
        currentBody: {
          value: undefined,
          purpose: 'commenting',
          type: 'TextualBody'
        },
        currentSelector: {
          type: 'Fragment',
          value: undefined
        },
        annotations: []
      }
    },
    methods: {
      keyMonitor (e) {
        if (this.prevKey === 13 && e.keyCode === 13) {
          this.prevKey = undefined
          const bodyLength = this.currentBody.value.length
          if (bodyLength > 2) {
            this.currentBody.value = this.currentBody.value.substr(0, bodyLength - 2)
            this.createAnnotation()
          }
          else {
            this.currentBody.value = undefined
          }
        }
        else {
          if (this.currentSelector.value === undefined) {
            this.currentSelector.value = new TimelineSelector().isoString
          }
          this.prevKey = e.keyCode
        }
      },
      createAnnotation () {
        const _this = this
        const annotation = {
          body: ObjectUtil.merge({}, _this.currentBody),
          target: {
            id: _this.$route.params.id,
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
            _this.annotations = _this.annotations.sort(annotations.Sorting.sortOnTarget)
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
        const selector = TimelineSelector.fromISOString(val)
        return selector.toFormat(constants.TIMECODE_FORMAT)
      }
    }
  }
</script>

<style scoped>
  #button-back {
    position: fixed;
    left: 1em;
    top: calc(52px + 1em);
  }
  .wrapper {
    border: 0px solid red;
    min-height: calc(100vh - 52px);
    overflow-y: scroll;
    padding-left: 5rem;
  }
  #input {
    position: fixed;
    top: calc(52px + 2em);
    width: calc(100vw - 25rem);
    margin-left: 7.5rem;
    overflow: scroll;
    margin-bottom: 0;
    z-index: 1111;
    border: 1px solid rgba(255, 255, 255, .1);
  }
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
