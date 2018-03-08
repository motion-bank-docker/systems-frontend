<template lang="pug">

  q-layout

    div#btn-back
      q-btn(@click="$router.push({ name: 'piecemaker.videos.list', params: { groupId: $route.params.groupId } })",
        color="grey") {{ $t('buttons.done') }}

    video-player(v-if="video", :src="video", @ready="playerReady($event)", @time="onPlayerTime($event)")

    #pop-up(v-bind:class="{ activeCondition: active }")
      div.text-right.outline(@click="toggleForm()", v-if="!active", color="primary")
        | Start typing or click here

      div(v-if="active")
        q-input(@keyup.enter="createAnnotation()", @keyup.esc="toggleForm()",
          v-model="currentBody.value", type="textarea", float-label="Start typing")
        div.row
          .col-6
            q-btn(@click="toggleForm()", small) Esc
            // br
              span or [Esc]
          .col-6.text-right
            q-btn(@click="createAnnotation()", small) Enter
            // br
              span or [Enter]

    // div(v-if="active" slot="right")
    div(slot="right")
      div
        .annotation(v-for="(annotation, i) in annotations", :key="annotation.uuid")
          .row(@click="gotoSelector(annotation.target.selector.value)")
            .col-6.timestamp {{ formatSelectorForList(annotation.target.selector.value) }}
            .col-6.text-right
              q-btn(@click="deleteAnnotation(annotation.uuid)", small) {{ $t('buttons.delete') }}
              q-btn(@click="updateAnnotation(annotation)", small) {{ $t('buttons.save') }}
          q-input(type="textarea", v-model="annotation.body.value")
          // .row
            .col-12.text-right
              a(@click="") add comment
            .col-12
              q-input(type="textarea")
</template>

<script>
  import { QBtn, QLayout, QInput } from 'quasar-framework'
  import querystring from 'querystring'
  import assert from 'assert'
  import uuidValidate from 'uuid-validate'
  import VideoPlayer from '../../../shared/media/VideoPlayer'
  export default {
    components: {
      QBtn,
      QLayout,
      QInput,
      VideoPlayer
    },
    mounted () {
      if (this.$route.params.id) {
        this.getVideo().then(this.getAnnotations())
      }
    },
    data () {
      return {
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
        }
      }
    },
    methods: {
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
        }
        else {
          this.currentSelector.value = this.encodeSelector(this.secondsToSelector(this.playerTime))
          this.active = true
          console.log(this.currentBody, this.currentSelector)
        }
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
  .annotation {
    padding: .5em;
    margin-bottom: 2em;
  }
  .annotation:not(:last-of-type) {
    margin-bottom: 2em;
  }
  .annotation > .row {
    margin-bottom: .25em;
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
</style>
