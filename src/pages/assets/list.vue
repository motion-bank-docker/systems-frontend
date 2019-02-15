<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")

    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.assets.list.title') }}

    data-table(v-if="user", :config="config", :title="'routes.assets.list.title'", ref="listTable")
      template(slot="buttons-left")
        q-btn(@click="$router.push({ name: 'assets.create' })", color="primary") {{ $t('buttons.create_asset') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import { openURL } from 'quasar'

  export default {
    data () {
      const _this = this
      return {
        assets: [],
        config: {
          columns: [
            {
              name: 'name',
              label: this.$t('labels.name'),
              field: 'name',
              filter: true,
              sortable: true
            },
            {
              name: 'type',
              label: this.$t('labels.type'),
              field: row => row.metaData && row.metaData['content-type'] ? row.metaData['content-type'] : 'unknown'
            },
            {
              name: 'size',
              label: this.$t('labels.size'),
              field: 'size',
              format: val => `${(val / Math.pow(1024, 2)).toFixed(2)} MB`,
              sortable: true
            }
          ],
          actions: [
            {
              type: 'url',
              title: 'buttons.copy_url',
              click: item => _this.copyToClipboard(_this.getAssetURL(item.name))
            },
            {
              type: 'download',
              title: 'buttons.download',
              click: item => openURL(_this.getAssetURL(item.name, true))
            },
            {
              type: 'edit',
              title: 'buttons.edit',
              click: item => _this.$router.push({ name: 'assets.edit', params: { asset: item.name, bucket: _this.bucketName } })
            },
            {
              type: 'delete',
              title: 'buttons.delete',
              click: item => _this.$refs.confirmModal.show('buttons.delete', item, 'buttons.delete')
            }
          ],
          async request () {
            return _this.$store.dispatch('assets/list', _this.bucketName)
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      bucketName () {
        return `user-${this.user.uuid}`
      }
    },
    methods: {
      getAssetURL (asset, download = false) {
        const url = `${process.env.ASSETS_HOST}/assets/user-${this.user.uuid}/${asset}`
        if (download) return `${url}?dl=1`
        return url
      },
      async copyToClipboard (text) {
        try {
          await navigator.clipboard.writeText(text)
          this.$store.commit('notifications/addMessage', {
            body: 'messages.url_copied',
            type: 'success'
          })
        }
        catch (err) {
          this.$store.commit('notifications/addMessage', {
            body: err.message,
            type: 'error'
          })
        }
      },
      async handleConfirmModal (item) {
        try {
          await this.$store.dispatch('assets/delete', [this.bucketName, item.name])
          this.$store.commit('notifications/addMessage', {
            body: 'messages.asset_deleted',
            type: 'success'
          })
          this.$refs.listTable.request()
        }
        catch (err) {
          this.$store.commit('notifications/addMessage', {
            body: 'errors.asset_delete_failed',
            type: 'error'
          })
        }
      }
    }
  }
</script>
