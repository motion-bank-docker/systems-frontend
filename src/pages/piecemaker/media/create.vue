<template lang="pug">
  full-screen

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.media.create.title')")

      content-paragraph(:position="'first'")
        q-alert.q-mb-lg(color="info" v-if="!payload.customMediaDate") {{ $t('routes.piecemaker.media.create.default_selector_notice') }}
        calendar-time-main(v-if="mayAdd && payload.customMediaDate", @update="onCalendarUpdate")

      content-paragraph(:position="'last'")
        form-main(v-if="mayAdd", v-model="payload", :schema="schema", ref="mediaForm")
          q-btn(label="Cancel", @click.native="$router.push({name: 'piecemaker.media.list', params: {uuid: $route.params.timelineUuid} })")
        div(v-if="mayAdd === false")
          p {{ $t('errors.add_media_forbidden') }}
          q-btn(label="Cancel", @click.native="$router.push({name: 'piecemaker.media.list', params: {uuid: $route.params.timelineUuid} })")
</template>

<script>
  import CalendarTimeMain from '../../../components/shared/forms/CalendarTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  import { DateTime } from 'luxon'
  import { required } from 'vuelidate/lib/validators'
  import guessType from 'mbjs-media/src/util/guess-type'
  import titleHelper from 'mbjs-quasar/src/lib/title-helper'

  export default {
    components: {
      CalendarTimeMain,
      FormMain,
      Headline,
      ContentBlock,
      ContentParagraph
    },
    methods: {
      onCalendarUpdate (val) {
        this.selectorValue = val
      },
      async fetchMetadata () {
        if (this.payload.url) {
          this.metadata = await this.$store.dispatch('metadata/get', {
            body: {
              source: {
                id: this.payload.url
              }
            }
          })
        }
      }
    },
    data () {
      const _this = this
      return {
        actions: [
          {
            label: this.$t('buttons.reset'),
            handler () {
              _this.selectorValue = undefined
            }
          }
        ],
        timeline: undefined,
        mayAdd: undefined,
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        payload: { url: undefined, title: undefined, customMediaDate: false },
        selectorValue: undefined,
        metadata: undefined,
        schema: {
          fields: {
            customMediaDate: {
              fullWidth: true,
              type: 'checkbox',
              label: 'labels.use_custom_date'
            },
            url: {
              fullWidth: true,
              type: 'text',
              label: 'labels.media_url',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            async handler () {
              try {
                await _this.fetchMetadata()
              }
              catch (err) {
                if (err.message === 'ENOENT') throw new Error('errors.media_could_not_be_accessed')
                else throw err
              }
              let
                start = _this.selectorValue,
                end
              if ((!_this.payload.customMediaDate || !_this.selectorValue) && _this.metadata && _this.metadata.publishedAt) {
                start = DateTime.fromISO(_this.metadata.publishedAt, { setZone: true }).toISO()
              }
              else if (!_this.payload.customMediaDate) start = DateTime.local().toString()
              if (_this.metadata && _this.metadata.duration) {
                end = DateTime.fromISO(start, {setZone: true}).plus(_this.metadata.duration * 1000).toISO()
              }
              const
                target = _this.timeline.getInterval(start, end),
                type = guessType(_this.payload.url),
                typeName = type.split('/')[0].substr(0, 1).toUpperCase() + type.split('/')[0].substr(1)
              _this.apiPayload = {
                body: {
                  source: {
                    id: _this.payload.url,
                    type
                  },
                  type: typeName,
                  purpose: 'linking'
                },
                target
              }
              const annotation = await _this.$store.dispatch('annotations/post', _this.apiPayload)
              if (_this.metadata) {
                await titleHelper.create(_this.$store, annotation.id, _this.metadata.title)
              }
              _this.$router.push({
                name: 'piecemaker.media.list',
                params: { timelineUuid: _this.$route.params.timelineUuid }
              })
            }
          }
        }
      }
    },
    async mounted () {
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.timelineUuid)
      if (this.timeline) {
        try {
          const acl = await this.$store.dispatch('acl/isAllowed',
            { id: this.timeline.id, permission: 'get' })
          this.mayAdd = !!(acl || {}).get
        }
        catch (err) {
          this.$handleError(err)
        }
      }
    }
  }
</script>

<style lang="stylus">
</style>
