<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.groups.list' })", icon="keyboard_backspace", round, small)
    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.videos.list.title') }}
    data-table(:config="config", :title="'routes.piecemaker.videos.list.title'",
      path="annotations", :query="query", base-path="videos")
      template(slot="buttons-left")
        q-btn(@click="$router.push({ name: 'piecemaker.videos.create', params: { groupId: $route.params.groupId } })",
          color="primary") {{ $t('buttons.add_video') }}
</template>

<script>
  import DataTable from '../../../components/shared/partials/DataTable'
  import FullScreen from '../../../components/shared/layouts/FullScreen'

  import Promise from 'bluebird'
  import URL from 'url'
  import path from 'path'
  import he from 'he'
  import { ObjectUtil } from 'mbjs-utils'

  export default {
    components: {
      DataTable,
      FullScreen
    },
    methods: {
      getPageTitle (url) {
        const _this = this
        if (url.indexOf('http') !== 0) return
        if (path.extname(URL.parse(url).path) === '.mp4') return
        // TODO: check if change from superagent to axios is breaking
        return _this.$axios.get(`${process.env.API_HOST}/proxy?url=${encodeURIComponent(url)}`)
          .then(result => {
            let title = result.data.match(/<title[^>]*>([^<]+)<\/title>/)[1]
            return he.decode(title)
          })
          .catch(err => {
            console.warn(`Error getting title for ${url}: ${err.message}`)
          })
      },
      loadVideoTitles (entries) {
        const _this = this
        return Promise.map(entries, entry => {
          const newEntry = ObjectUtil.merge({}, entry)
          newEntry.title = entry.body.source
          return Promise.resolve()
            .then(() => {
              if (entry.body.source.indexOf('http') !== 0) return
              if (path.extname(URL.parse(entry.body.source).path) === '.mp4') return
              // TODO: check if change from superagent to axios is breaking
              return _this.$axios.get(`${process.env.API_HOST}/proxy?url=${encodeURIComponent(entry.body.source)}`)
                .then(result => {
                  let title = result.text.match(/<title[^>]*>([^<]+)<\/title>/)[1]
                  newEntry.title = he.decode(title)
                })
                .catch(err => {
                  console.warn(`Error getting title for ${entry.body.source}: ${err.message}`)
                })
            })
            .then(() => {
              return newEntry
            })
        })
      }
    },
    data () {
      const _this = this
      return {
        query: { 'body.purpose': 'linking', 'target.id': this.$route.params.groupId },
        config: {
          columns: [
            {
              name: 'title',
              label: _this.$t('labels.title'),
              field: val => val.body.source.id,
              // FIXME: throws array sort exception when active
              sort: false,
              filter: true,
              format: async (val) => {
                const title = await _this.getPageTitle(val)
                console.log(title)
                return title
              }
            },
            {
              label: _this.$t('labels.created'),
              field: 'created',
              sort: true
            },
            {
              label: _this.$t('labels.updated'),
              field: 'updated',
              sort: true
            },
            {
              label: _this.$t('labels.author'),
              field: 'author'
            }
          ],
          actions: [
            {
              type: 'live-annotate',
              title: 'buttons.annotate',
              color: 'primary',
              click: (item) => _this.$router.push({ name: 'piecemaker.videos.annotate', params: { id: item.uuid } })
            },
            {
              type: 'edit',
              title: 'buttons.edit',
              // click: (item) => _this.$router.push({ name: 'piecemaker.videos.edit', params: { id: item.uuid } })
              click: (item) => _this.$router.push({ name: 'piecemaker.videos.edit', params: { id: item.uuid } })
            },
            {
              type: 'delete',
              title: 'buttons.delete'
            }
          ]
        }
      }
    }
  }
</script>
