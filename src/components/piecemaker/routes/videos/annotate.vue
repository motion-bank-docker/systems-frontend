<template lang="pug">

  div(style="border: 0px solid yellow; height: calc(100vh - 52px); overflow-y: hidden!important;")
    q-layout

      div#btn-back
        q-btn(@click="$router.push({ name: 'piecemaker.videos.list', params: { groupId: $route.params.groupId } })",
          color="grey" icon="keyboard_backspace" round flat small)
        q-btn(v-if="!fullscreen" @click="fullscreenHandler" icon="fullscreen" round flat small)
        q-btn(v-if="fullscreen" @click="fullscreenHandler" icon="fullscreen_exit" round flat small)

      div
        video-player(v-if="video", :src="video", @ready="playerReady($event)", @time="onPlayerTime($event)")

      #pop-up(v-bind:class="{ activeCondition: active }")
        // q-input#zwischenfokus(@keyup="activatePopUp()" autofocus)

        div.text-right.outline(@click="toggleForm()", v-if="!active", color="primary")
          | Start typing or click here

        div(v-if="active")
          q-input(@keyup.enter="createAnnotation()", @keyup.esc="toggleForm(); closePopUp()",
            v-model="currentBody.value", type="textarea", float-label="Start typing", autofocus)
          div.row
            .col-6
              q-btn(@click="toggleForm()", small) Esc
            .col-6.text-right
              q-btn(@click="createAnnotation()", small) Enter

      // div#annotations(v-if="!fullscreen")
      hallo(v-if="!fullscreen" slot="right")
        q-list.no-border
          q-item.annotation(v-for="(annotation, i) in annotations", :key="annotation.uuid")
            q-item-main.row
              a(name="annotation.uuid")
              q-item-tile.col-6
                q-btn(@click="gotoSelector(annotation.target.selector.value)" small) {{ formatSelectorForList(annotation.target.selector.value) }}
              q-item-tile.col-6
                q-btn(@click="deleteAnnotation(annotation.uuid)", small) {{ $t('buttons.delete') }}
                q-btn(@click="updateAnnotation(annotation)", small) {{ $t('buttons.save') }}
              q-item-tile.col-12
                q-input(type="textarea", v-model="annotation.body.value")

</template>

<script>
  // import { QBtn, QLayout, QInput } from 'quasar-framework'
  import { ActionSheet, Dialog, QBtn, QLayout, QInput, QList, QItem, QItemMain, QItemTile } from 'quasar-framework'
  import querystring from 'querystring'
  import assert from 'assert'
  import uuidValidate from 'uuid-validate'
  import VideoPlayer from '../../../shared/media/VideoPlayer'
  export default {
    components: {
      ActionSheet,
      Dialog,
      QBtn,
      QLayout,
      QInput,
      QList,
      QItem,
      QItemMain,
      QItemTile,
      VideoPlayer
    },
    created: function () {
      // var testVar = 1
      // window.addEventListener('keydown', this.aktivieren('cccc' + testVar + 1))
    },
    mounted () {
      if (this.$route.params.id) {
        this.getVideo().then(this.getAnnotations())
      }
      /* window.addEventListener('keypress', function () {
        console.log('abc')
      }) */
      let self = this
      window.addEventListener('keypress', self.aktivieren())
    },
    data () {
      return {
        fullscreen: false,
        player: undefined,
        playerTime: 0.0,
        video: undefined,
        active: false,
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
        filtertypes: [{
          title: 'Comment'
        }, {
          title: 'Marker'
        }
        ]
      }
    },
    methods: {
      activatePopUp () {
        this.active = true
      },
      closePopUp () {
        this.active = false
      },
      aktivieren () {
        // this.active = !this.active
        // this.active = true
        // console.log(val)
        console.log('aaaa')
        // window.addEventListener('keypress', this.aktivieren())
      },
      fullscreenHandler () {
        this.fullscreen = !this.fullscreen
      },
      getVideo () {
        const context = this
        return this.$store.dispatch('annotations/get', context.$route.params.id)
          .then(result => {
            if (result.body) {
              context.video = result.body
            }
          })
      },
      getAnnotations () {
        const context = this
        return this.$store.dispatch('annotations/find', { query: { 'target.id': context.$route.params.id } })
          .then(results => {
            if (results) {
              context.annotations = results.sort((a, b) => {
                const
                  dta = a.target.selector ? context.selectorToSeconds(context.parseSelector(a.target.selector.value)) : null,
                  dtb = b.target.selector ? context.selectorToSeconds(context.parseSelector(b.target.selector.value)) : null
                if (dta > dtb) return 1
                if (dta < dtb) return -1
                return 0
              })
            }
          })
      },
      toggleForm () {
        if (this.active) {
          this.active = false
          this.currentSelector.value = undefined
          this.currentBody.value = undefined
          // alert('active')
          // this.keydownHandler('close')
          // window.addEventListener('keydown', this.keydownHandler('close'))
        }
        else {
          this.currentSelector.value = this.encodeSelector(this.secondsToSelector(this.playerTime))
          this.active = true
          console.log(this.currentBody, this.currentSelector)
          // this.keydownHandler('open')
        }
      },
      keydownHandler (val) {
        console.log(val)
      },
      createAnnotation () {
        const _this = this
        const annotation = {
          author: _this.$store.state.auth.payload.userId,
          body: Object.assign({}, _this.currentBody),
          target: {
            id: _this.$route.params.id,
            type: 'Video',
            selector: Object.assign({}, _this.currentSelector)
          }
        }
        console.log(annotation, this)
        return this.$store.dispatch('annotations/create', annotation)
          .then(() => _this.getAnnotations())
          .then(() => _this.toggleForm())
          .then(() => _this.scrollToElement())
      },
      updateAnnotation (annotation) {
        assert.equal(typeof annotation, 'object')
        assert(uuidValidate(annotation.uuid))
        assert.equal(typeof annotation.body.value, 'string')
        console.log(annotation)
        return this.$store.dispatch('annotations/patch', [annotation.uuid, annotation])
          .then(() => this.getAnnotations())
      },
      deleteAnnotation (uuid) {
        assert(uuidValidate(uuid))
        return this.$store.dispatch('annotations/remove', uuid)
          .then(() => this.getAnnotations())
      },
      gotoSelector (selector) {
        const seconds = this.selectorToSeconds(this.parseSelector(selector))
        this.player.currentTime(seconds)
      },
      playerReady (player) {
        console.log('player ready', player.id())
        this.player = player
      },
      parseSelector (val) {
        if (!val) {
          console.warn(`Warning: encountered undefined selector`)
          return {}
        }
        assert.equal(typeof val, 'string')
        const obj = querystring.parse(val)
        Object.keys(obj).forEach(key => {
          obj[key] = parseFloat(obj[key])
        })
        return obj
      },
      encodeSelector (val) {
        assert.equal(typeof val, 'object')
        return querystring.stringify(val)
      },
      selectorToString (val) {
        assert.equal(typeof val, 'object')
        return `${Math.round(val.m || 0).toString().padStart(2, '0')}:${(val.s || 0).toFixed(3).padStart(6, '0')}`
      },
      secondsToSelector (val) {
        assert.equal(typeof val, 'number')
        const selector = {
          m: Math.floor(val / 60),
          s: val % 60
        }
        return selector
      },
      selectorToSeconds (val) {
        assert.equal(typeof val, 'object')
        return (parseInt(val.m) || 0) * 60 + (parseFloat(val.s) || 0)
      },
      formatSelectorForList (val) {
        return this.selectorToString(this.parseSelector(val))
      },
      onPlayerTime (seconds) {
        this.playerTime = seconds
      },
      scrollToElement () {
        // alert('123 abc')
        // var elmnt = document.getElementById("content");
        // aside
      }
    }
  }
</script>

<style scoped>
  #btn-back {
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 9999;
  }
  #pop-up {
    position: absolute;
    top: 1em;
    right: 1em;
    width: 33%;
    cursor: pointer;
  }
  #pop-up > div {
    padding: 1em;
    background-color: white;
  }
  .activeCondition {
    box-shadow: 0 0 10px -2px rgba( 0, 0, 0, .35 );
    background-color: rgba( 255, 255, 255, 1 );
  }
  .outline {
    border: 1px solid white;
    position: absolute;
    right: 0;
  }
  .annotation {
    margin: 1em 0;
  }
  #annotations {
    height: 50vh;
    background-color: red;
  }
  hallo > div {
    /* background-color: pink; */
    height: 100%;
    overflow-x: scroll;
  }
  hallo {
  }
  .video-js.vjs-fluid {
    width: 40px!important;
  }
  #zwischenfokus {
  }
</style>
