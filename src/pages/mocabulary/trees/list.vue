<template lang="pug">
  full-screen

    modal-confirm(ref="newTermModal", close-icon="clear", @confirm="addTerm(newTerm)", @cancel="cancelModal")
      template(slot="content")
        q-input(v-model="newTerm", :float-label="$t('buttons.add_term')", dark)

    modal-confirm(ref="newVocabularyModal", close-icon="clear", @confirm="addVocabulary(newVocabulary)", @cancel="cancelModal")
      template(slot="content")
        q-input(v-model="newVocabulary", :float-label="$t('buttons.add_vocabulary')", dark)

    <!--h5(dark) {{ $t('routes.mocabulary.trees.title') }}-->
    .row
      .col-6
        <!--h5 {{ $t('labels.my_vocabularies') }}-->
        .q-mb-xl.q-pa-sm(v-for="(tree, i) in trees")
          q-tree(:nodes="tree", node-key="label", color="primary", dark)
            div(slot="header-generic", slot-scope="prop")
              q-btn(@click="onAction(prop.node.label)", icon="edit", size="sm", round)
              q-btn.q-mx-xs(@click="onAction(prop.node.label)", icon="keyboard", size="sm", round)
              q-btn.q-mr-md(@click="onAction(prop.node.label)", icon="clear", size="sm", round)
              // q-btn.q-mr-md(@click="onAction(prop.node.label)", icon="play_arrow", size="sm", round)
              | {{ prop.node.label }}
            q-item(slot="header-add", slot-scope="prop")
              // q-btn(@click="showModal('newTermModal', i)", icon="add", color="primary", size="sm", round)
              q-item-main
                // q-input(:ref="trees[i][0].uuid", value="eins", :float-label="$t('labels.add_term')", dark)
                q-input(v-model="tree[0].newChild", value="eins", :float-label="$t('labels.add_term')", dark)
              q-item-side
                q-btn(@click="addTermInput(tree[0], i)", icon="add", color="primary", size="sm", round)
                // q-btn(@click="addTermInput(tree[0], i)", icon="add", :label="$t('buttons.add_term')", color="primary", size="sm")
        q-btn(@click="showModal('newVocabularyModal')", icon="add", :label="$t('buttons.add_vocabulary')", color="primary")

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
        newTerm: '',
        targetVocabulary: '',
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
        this.trees.push([{newChild: '', uuid: this.vocabularies[i].uuid, label: this.vocabularies[i].title, children: children}])
      }
      // console.log(this.trees)
    },
    methods: {
      addTerm (val) {
        let target = this.trees[this.targetVocabulary][0].children
        target.splice(-1, 1)
        target.push({label: val, header: 'generic', body: 'generic'})
        target.push({label: '', header: 'add'})
        this.targetVocabulary = ''
      },
      addTermInput (val, i) {
        let target = this.trees[i][0].children
        target.splice(-1, 1)
        target.push({label: val.newChild, header: 'generic', body: 'generic'})
        target.push({label: '', header: 'add'})
        this.trees[i][0].newChild = ''
      },
      addVocabulary (val) {
        this.trees.push([{label: val, children: [{label: 'empty', header: 'add'}]}])
      },
      cancelModal () {
        this.newTerm = ''
        this.newVocabulary = ''
      },
      onAction (val) {
        console.log(val)
      },
      showModal (val, i) {
        this.$refs[val].show()
        this.targetVocabulary = i
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
