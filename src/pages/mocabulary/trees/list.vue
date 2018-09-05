<template lang="pug">
  full-screen

    modal-confirm(ref="newVocabularyModal", close-icon="clear", @confirm="addVocabulary(newVocabulary)", @cancel="cancelModal")
      template(slot="content")
        q-input(v-model="newVocabulary", :float-label="$t('buttons.add_vocabulary')", dark)

    h5.caption(dark) {{ $t('routes.mocabulary.trees.title') }}
    .row
      .col-6
        h5 {{ $t('labels.my_vocabularies') }}
        .q-mb-xl.q-pa-sm(v-for="(tree, i) in trees")
          q-tree(:nodes="tree", node-key="label", color="primary", dark)
            div(slot="header-generic", slot-scope="prop")
              q-btn(@click="onAction(prop.node.label)", icon="edit", size="sm", round)
              q-btn.q-mx-xs(@click="onAction(prop.node.label)", icon="keyboard", size="sm", round)
              q-btn.q-mr-md(@click="onAction(prop.node.label)", icon="clear", size="sm", round)
              | {{ prop.node.label }}
            div(slot="header-add", slot-scope="prop")
              q-btn(@click="showModal('newTerm')", icon="add", :label="$t('buttons.add_term')", color="primary")
        q-btn(@click="showModal('newVocabulary')", icon="add", :label="$t('buttons.add_vocabulary')", color="primary")

</template>

<script>
  // import FormMain from '../../../components/shared/forms/FormMain'
  import ModalConfirm from '../../../components/shared/partials/ModalConfirm'

  export default {
    components: {
      // FormMain,
      ModalConfirm
    },
    data () {
      // const _this = this
      return {
        newVocabulary: '',
        trees: [],
        vocabularies: []
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
      // addTerm (val) {
      //   console.log(val)
      // },
      addVocabulary (val) {
        this.trees.push([{label: val, children: [{label: 'empty', header: 'add'}]}])
      },
      cancelModal () {
        this.newVocabulary = ''
      },
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
