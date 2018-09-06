<template lang="pug">
  full-screen

    modal-confirm(ref="newVocabularyModal", close-icon="clear", @confirm="addVocabulary(newVocabulary)", @cancel="cancelModal")
      template(slot="content")
        q-input(v-model="newVocabulary", :float-label="$t('buttons.add_vocabulary')", dark)

    <!--h5(dark) {{ $t('routes.mocabulary.trees.title') }}-->
    .row
      .col-6
        <!--h5 {{ $t('labels.my_vocabularies') }}-->
        .q-mb-xl.q-pa-sm(v-for="(tree, i) in trees")
          q-tree(:nodes="tree", node-key="label", color="primary", dark)
            q-item(slot="header-generic", slot-scope="prop").q-pl-none
              q-item-side
                q-btn.text-primary(no-caps, round, size="sm") {{ getInitials(prop.node.label) }}
                q-btn(@click="onAction(prop.node.label)", icon="keyboard", size="sm", round)

              template(v-if="editTermId === prop.node.id")
                q-item-main.full-width()
                  q-input.q-pt-xs.q-pb-none(v-model="editTermNewValue", :value="prop.node.label", dark)
                q-item-side.q-pl-sm
                  q-btn(@click="editTerm(prop.node.id, i)", :label="$t('buttons.save')", color="primary", size="sm")
                  q-btn.q-ml-sm(@click="editTermId = ''", :label="$t('buttons.cancel')", color="primary", size="sm")

              template(v-else)
                q-item-main() {{ prop.node.label }}
                q-item-side.q-pl-sm
                  // q-btn.rotate-90(@click="", icon="play_arrow", size="sm", round)
                  q-btn(@click="editTermId = prop.node.id, editTermNewValue = prop.node.label", icon="edit", size="sm", round)
                  q-btn.q-ml-sm(@click="removeTerm(prop.node.id, i)", icon="clear", size="sm", round)

            q-item(slot="header-add", slot-scope="prop")
              q-item-main
                // q-input(:ref="trees[i][0].uuid", value="eins", :float-label="$t('labels.add_term')", dark)
                q-input(v-model="tree[0].newChild", value="eins", :float-label="$t('labels.add_term')", dark)
              q-item-side
                q-btn(@click="addTerm(tree[0], i)", icon="add", color="primary", size="sm", round)
                // q-btn(@click="addTerm(tree[0], i)", icon="add", :label="$t('buttons.add_term')", color="primary", size="sm")
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
        dummyTermId: 0,
        editTermId: '',
        editTermNewValue: '',
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
          this.dummyTermId++
          children.push({id: this.dummyTermId, label: this.vocabularies[i].entries[k].value, header: 'generic', body: 'generic'})
        }
        // children.unshift({label: '', body: 'test'})
        children.push({label: '', header: 'add'})
        this.trees.push([{newChild: '', uuid: this.vocabularies[i].uuid, label: this.vocabularies[i].title, children: children}])
      }
      // console.log(this.trees)
    },
    methods: {
      addTerm (val, i) {
        this.dummyTermId++
        let target = this.trees[i][0].children
        // target.splice(-1, 1)
        target.pop()
        target.push({id: this.dummyTermId, label: val.newChild, header: 'generic', body: 'generic'})
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
      editTerm (val, i) {
        console.log(val, i, this.editTermNewValue)
        let target = this.trees[i][0].children
        let editIndex = target.map(function (item) { return item.id }).indexOf(val)
        // console.log(editIndex, target[editIndex])
        target[editIndex].label = this.editTermNewValue
        this.editTermId = ''
        this.editTermNewValue = ''
      },
      getInitials (val) {
        return val.split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      },
      removeTerm (val, i) {
        let target = this.trees[i][0].children
        let removeIndex = target.map(function (item) { return item.id }).indexOf(val)
        target.splice(removeIndex, 1)
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
