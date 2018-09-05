<template lang="pug">
  full-screen

    modal-confirm(ref="newVocabularyModal", close-icon="clear", @confirm="setShortcut", @cancel="exitSetShortcut")
      template(slot="content", v-if="newShortcutEntry")
        p Save configuration?

    h5.caption(dark) {{ $t('routes.mocabulary.trees.title') }}
    .row
      .col-6
        h5 {{ $t('labels.my_vocabularies') }}
        .q-mb-xl.q-pa-sm(v-for="(tree, i) in trees")
          q-tree(:nodes="tree", node-key="label", color="primary", dark)
            div(slot="header-generic", slot-scope="prop")
              q-btn(@click="onAction(prop.node.label)", icon="edit", size="sm", round)
              q-btn.q-mx-xs(@click="onAction(prop.node.label)", icon="keyboard", size="sm", round)
                // q-popup-edit(v-model="prop.node.label", buttons)
                  q-input(v-model="prop.node.label")
              q-btn.q-mr-md(@click="onAction(prop.node.label)", icon="clear", size="sm", round)
              | {{ prop.node.label }}
            div(slot="header-add", slot-scope="prop")
              // q-btn(icon="add", :label="$t('buttons.add_term')", color="primary")
              q-input(:label="$t('buttons.add_term')", color="primary", dark)
              q-btn(@click="add", icon="add", :label="$t('buttons.add_term')", color="primary")
        q-btn(@click="showModal('newVocabulary')", icon="add", :label="$t('buttons.add_vocabulary')", color="primary")
      // .col-6
        h5 public
        q-card.q-mb-xl.q-pa-sm(v-for="(tree, i) in trees")
          q-tree(:nodes="tree", node-key="label", color="primary", dark)
            // div(slot="header-generic", slot-scope="prop")
              q-btn(@click="onAction(prop.node.label)", icon="edit", size="sm", round)
              q-btn.q-mx-xs(@click="onAction(prop.node.label)", icon="keyboard", size="sm", round)
                // q-popup-edit(v-model="prop.node.label", buttons)
                  q-input(v-model="prop.node.label")
              q-btn.q-mr-md(@click="onAction(prop.node.label)", icon="clear", size="sm", round)
              | {{ prop.node.label }}
</template>

<script>
  import ModalConfirm from '../../../components/shared/partials/ModalConfirm'

  export default {
    components: {
      ModalConfirm
    },
    data () {
      return {
        vocabularies: [],
        trees: []
      }
    },
    async mounted () {
      this.vocabularies = await this.$vocabularies.find()
      let i
      for (i = 0; i < this.vocabularies.length; i++) {
        let k
        let children = []
        for (k = 0; k < this.vocabularies[i].entries.length; k++) {
          children.push({label: this.vocabularies[i].entries[k].value, header: 'generic', body: 'generic'})
        }
        // children.unshift({label: '', body: 'test'})
        children.push({label: '', header: 'add'})
        this.trees.push([{label: this.vocabularies[i].title, children: children}])
      }
    },
    methods: {
      onAction (val) {
        console.log(val)
      },
      showModal (val) {
        this.$refs.newVocabularyModal.show()
        console.log(val)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
