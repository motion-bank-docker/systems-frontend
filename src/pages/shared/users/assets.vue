<template lang="pug">
  full-screen
    confirm-modal(ref="confirmDeleteAssetModal", @confirm="deleteFile")
    q-modal(v-model="showAclModal" minimized dark)
      .bg-dark.q-pa-md
        permissions(v-if="aclResource" :resource="aclResource" :simple="true")
    content-block(position="first")
      headline(:content="$t('routes.users.assets.title')")
        | {{ $t('routes.users.assets.caption') }}

      content-paragraph(:position="first")
        q-tree(v-if="filetree" :nodes="filetree" node-key="fullpath" @lazy-load="onLazyLoad" default-expand-all dark)
          .q-pl-sm(slot="header-root" slot-scope="prop")
            h5.no-margin.caption.text-grey-5 {{ $t('labels.my_assets') }}
          q-item(slot="header-empty" slot-scope="prop")
            span {{ $t('messages.no_assets_uploaded') }}
          q-item(slot="default-header" slot-scope="prop")
            q-icon(:name="prop.node.icon || 'insert_drive_file'" size="24px" class="q-mr-sm")
            span.q-pr-md {{ prop.node.label }}
            template(v-if="prop.node.size")
              q-btn.q-pr-md(icon="link" flat size="sm" @click="copyUrl(prop.node)")
              q-btn.q-pr-md(icon="edit" flat size="sm" @click="editFile(prop.node)")
              q-btn.q-pr-md(icon="arrow_downward" flat size="sm" @click="downloadFile(prop.node)")
              q-btn.q-pr-md(icon="delete" flat size="sm" @click="$refs.confirmDeleteAssetModal.show('messages.confirm_remove_asset', prop.node)")
              span.text-weight-thin.q-pr-md ({{ getPrettyBytes(prop.node.size) }})
</template>

<script>
import { mapGetters } from 'vuex'
import { openURL } from 'quasar'
import path from 'path'
import prettyBytes from 'pretty-bytes'

import Headline from '../../../components/shared/elements/Headline'
import ContentBlock from '../../../components/shared/elements/ContentBlock'
import ContentParagraph from '../../../components/shared/elements/ContentParagraph'
import Permissions from '../../../components/shared/partials/Permissions'

export default {
  name: 'assets',
  components: {
    Headline,
    ContentBlock,
    ContentParagraph,
    Permissions
  },
  data () {
    return {
      filetree: undefined,
      showAclModal: false,
      aclResource: undefined
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUserState'
    }),
    bucket () {
      if (this.user) return `user-${this.user.uuid}`
    }
  },
  async mounted () {
    await this.initFileTree()
  },
  methods: {
    async initFileTree () {
      this.filetree = await this.listDir(this.bucket, true)
    },
    getIcon (entry) {
      if (entry.size) {
        const { metaData } = entry
        if (metaData) {
          if (metaData['content-type'].indexOf('audio') === 0) return 'audiotrack'
          if (metaData['content-type'].indexOf('image') === 0) return 'image'
          if (metaData['content-type'].indexOf('video') === 0) return 'movie'
        }
      }
      else return 'folder'
    },
    transformEntries (entries, isRoot = false) {
      const children = [].concat(entries.filter(entry => !entry.size).map(node => ({
        label: path.basename(node.prefix),
        fullpath: `${this.bucket}/${node.prefix || ''}${node.name || ''}`,
        expandable: true,
        lazy: true,
        icon: 'folder'
      })).sort((a, b) => a.label.localeCompare(b.label))).concat(entries.filter(entry => !!entry.size).map(node => ({
        title: path.basename(node.name),
        label: path.basename(node.name),
        fullpath: `${this.bucket}/${node.prefix || ''}${node.name || ''}`,
        size: node.size,
        metadata: node.metaData,
        expandable: false,
        icon: this.getIcon(node)
      })).sort((a, b) => a.label.localeCompare(b.label)))
      if (!children.length) {
        children.push({
          fullpath: 'empty',
          header: 'empty'
        })
      }
      if (isRoot) {
        return [
          {
            header: 'root',
            children
          }
        ]
      }
      return children
    },
    async listDir (path, isRoot = false) {
      this.$q.loading.show({ delay: 500 })
      const entries = await this.$store.dispatch('assets/find', path)
      this.$q.loading.hide()
      // return this.transformEntries(entries, isRoot)
      if (entries) {
        return this.transformEntries(entries, isRoot)
      }
      else {
        this.$router.push({ path: 'assets/upload' })
      }
    },
    async onLazyLoad ({ node, done }) {
      const entries = await this.listDir(node.fullpath)
      done(entries)
    },
    getPrettyBytes (bytes) {
      return prettyBytes(bytes)
    },
    getAssetUrl (node) {
      return `${process.env.API_HOST}/assets/${node.fullpath}`
    },
    async deleteFile (node) {
      this.$q.loading.show()
      await this.$store.dispatch('assets/delete', node.fullpath)
      await this.initFileTree()
      this.$store.commit('notifications/addMessage', {
        body: 'messages.delete_asset_success', mode: 'alert', type: 'success'
      })
    },
    async downloadFile (node) {
      openURL(this.getAssetUrl(node) + `?dl=true&token=${this.$auth.token}`)
    },
    editFile (node) {
      this.showAclModal = true
      this.aclResource = node.fullpath
    },
    async copyUrl (node) {
      try {
        await navigator.clipboard.writeText(this.getAssetUrl(node))
        this.$store.commit('notifications/addMessage', {
          body: 'messages.copied_url', mode: 'alert', type: 'success'
        })
      }
      catch (err) {
        this.$handleError(this, err, 'errors.failed_to_copy_url')
      }
    }
  }
}
</script>

<style scoped>

</style>
