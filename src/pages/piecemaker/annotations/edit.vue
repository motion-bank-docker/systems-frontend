<template lang="pug">
  center-card-full
    a(@click="goBack") Back
    span(slot="form-logo")
    .row
      .col-8
        video-player(:src="video.src", @ready="playerReady($event)", @time="onPlayerTime($event)")
        form-main(v-model="payload", :schema="schema")#annotations-form
      .col-4
        q-list(highlight, separator, no-border)#test
          q-list-header {{ $t('labels.annotations') }}
          q-item(v-for="annotation in annotations", :key="annotation.uuid",
          :class="{ 'bg-faded': playerTime >= annotation.object.sel }",
          link, multiline, @click="onAnnotationClick(annotation)")
            q-item
              q-item-side(sublabel, color="white", left) {{ annotation.object.sel.toFixed(3) }}s
            q-item-side(sublabel, color="white", right)
              q-btn edit
              q-btn delete
            q-item-main
              q-item-tile(label, color="white") {{ annotation.body }}
              // q-item-tile(sublabel, color="white") {{ annotation.object.sel.toFixed(3) }}s on {{ annotation.object.url }}
</template>

<script>
  import CenterCardFull from 'mbjs-quasar/src/components/layouts/CenterCardFull'
  import { FormMain } from '../../../components/shared/forms/index'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      CenterCardFull,
      FormMain
    },
    created: function () {
      window.addEventListener('keydown', this.Annotate)
    },
    methods: {
      goBack () {
        window.history.back()
      },
      Annotate (e) {
        document.getElementById('annotations-form').style.display = 'block'
        // document.getElementById('new-input').focus()

        // if (e.keyCode === 13 && document.getElementById('new-input').value !== '') {
        if (e.keyCode === 13) {
          document.getElementById('annotations-form').style.display = 'none'
          document.getElementById('annotations-form').getElementsByTagName('input').focus()

          // var newObj = [document.getElementById('new-input').value]

          // var Vue = require('vue')

          // this.$set(this.items.lenght + 1, this.items.length + 1, newObj)
          // console.log(this.items)

          // document.getElementById('new-input').value = ''
        }

        if (e.keyCode === 27) {
          document.getElementById('annotations-form').style.display = 'none'
          // document.getElementById('new-input').value = ''
        }
      },
      playerReady (player) {
        console.debug('Video.js: player ready - ID', player.id())
        this.player = player
      },
      loadAnnotations () {
        const _this = this
        return this.$store.dispatch('annotations/find', { 'target.id': this.timeline.id })
          .then(annotations => {
            _this.annotations = annotations.map(annotation => {
              annotation.object = JSON.parse(annotation.object)
              return annotation
            }).sort((a, b) => {
              if (a.object.sel > b.object.sel) return 1
              if (a.object.sel < b.object.sel) return -1
              return 0
            })
            if (_this.annotations.length) {
              _this.video.src = this.annotations[0].object.url
            }
          })
      },
      onAnnotationClick (target) {
        if (this.video.src !== target.object.url) {
          this.video.src = target.object.url
        }
        this.player.currentTime(target.object.sel)
      },
      onPlayerTime (seconds) {
        this.playerTime = seconds
      }
    },
    beforeDestroy () {
      const _this = this
      return new Promise(function (resolve) {
        if (_this.player) {
          _this.player.dispose()
          resolve()
        }
      })
    },
    data () {
      const _this = this
      return {
        timeline: undefined,
        video: {
          src: _this.$route.query.url || undefined
        },
        player: undefined,
        playerTime: 0.0,
        annotations: [],
        annotationSelect: undefined,
        payload: undefined,
        schema: {
          fields: {
            body: {
              fullWidth: true,
              type: 'text',
              label: 'labels.annotation_body',
              validators: { required }
            }
          },
          submit: {
            handler () {
              _this.payload.target = { id: _this.timeline.id }
              _this.payload.body = JSON.stringify({
                url: _this.video.src,
                sel: _this.annotationSelect
              })
              _this.$store.dispatch('annotations/create', _this.payload)
                .then(() => {
                  _this.payload = undefined
                  _this.annotationSelect = undefined
                  return _this.loadAnnotations()
                })
            }
          }
        }
      }
    },
    watch: {
      payload () {
        if (!this.annotationSelect && this.player) {
          this.annotationSelect = this.player.currentTime()
        }
      }
    },
    async mounted () {
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.mapId)
      await this.loadAnnotations()
    }
  }
</script>
