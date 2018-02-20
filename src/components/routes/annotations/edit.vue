<template lang="pug">
  center-card-full
    span(slot="form-logo")
    .row
      .col-8
        video-player(:src="video.src", @ready="playerReady($event)", @time="onPlayerTime($event)")
        form-main(v-model="payload", :schema="schema")
      .col-4
        q-list(highlight, separator, no-border)
          q-list-header {{ $t('labels.annotations') }}
          q-item(v-for="annotation in annotations", :key="annotation.uuid",
          :class="{ 'bg-faded': playerTime >= annotation.object.sel }",
          link, multiline, @click="onAnnotationClick(annotation)")
            q-item-main
              q-item-tile(label, color="white") {{ annotation.body }}
              q-item-tile(sublabel, color="white") {{ annotation.object.sel.toFixed(3) }}s on {{ annotation.object.url }}
</template>

<script>
  import { QSelect, QList, QListHeader, QItem, QItemMain, QItemTile, QItemSeparator } from 'quasar-framework'
  import CenterCardFull from '../../layouts/CenterCardFull'
  import VideoPlayer from '../../media/VideoPlayer'
  import { FormMain } from '../../forms/index'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      QSelect,
      QList,
      QListHeader,
      QItem,
      QItemMain,
      QItemTile,
      QItemSeparator,
      CenterCardFull,
      VideoPlayer,
      FormMain
    },
    methods: {
      playerReady (player) {
        console.debug('player ready', player.id())
        this.player = player
      },
      loadAnnotations () {
        const _this = this
        this.$store.dispatch('annotations/find', { subject: `/maps/${this.$route.params.mapId}` })
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
              _this.payload.author = `/maps/${_this.$store.state.auth.payload.userId}`
              _this.payload.subject = `/maps/${_this.$route.params.mapId}`
              _this.payload.object = JSON.stringify({
                url: _this.video.src,
                sel: _this.annotationSelect
              })
              _this.$store.dispatch('annotations/create', _this.payload)
                .then(() => {
                  _this.payload = undefined
                  _this.annotationSelect = undefined
                  _this.loadAnnotations()
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
    mounted () {
      this.loadAnnotations()
    }
  }
</script>
