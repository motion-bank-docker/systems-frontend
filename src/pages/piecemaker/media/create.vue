<template lang="pug">
  full-screen

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.media.create.title')")

      .q-mb-lg
        q-alert(color="info" v-if="!selectorValue") {{ $t('routes.piecemaker.media.create.default_selector_notice') }}
        q-alert(color="info" :actions="actions" v-else) {{ $t('routes.piecemaker.media.create.override_selector_notice') }}

      content-paragraph(:position="'first'")
        calendar-time-main(v-if="mayAdd", @update="onCalendarUpdate")

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
        payload: { url: undefined, title: undefined },
        selectorValue: undefined,
        schema: {
          fields: {
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
              const metadata = await _this.$store.dispatch('metadata/get', {
                body: {
                  source: {
                    id: _this.payload.url
                  }
                }
              })
              let
                start = _this.selectorValue,
                end
              if (!_this.selectorValue && metadata && metadata.publishedAt) {
                start = DateTime.fromISO(metadata.publishedAt, { setZone: true }).toISO()
              }
              else start = DateTime.local().toString()
              if (metadata && metadata.duration) {
                end = DateTime.fromISO(start, {setZone: true}).plus(metadata.duration * 1000).toISO()
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
              if (metadata) {
                await titleHelper.create(_this.$store, annotation.id, metadata.title)
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
