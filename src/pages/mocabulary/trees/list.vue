<template lang="pug">
  full-screen

    modal-confirm(ref="newVocabularyModal", close-icon="clear", @confirm="addVocabulary(newVocabulary)", @cancel="cancelModal")
      template(slot="content")
        q-input(v-model="newVocabulary", :float-label="$t('buttons.add_vocabulary')", dark)

    <!--h5(dark) {{ $t('routes.mocabulary.trees.title') }}-->
    .row
      .col-6
        <!--h5 {{ $t('labels.my_vocabularies') }}-->
        q-btn(@click="showModal('newVocabularyModal')", icon="add", :label="$t('buttons.add_vocabulary')", color="primary")

        q-card.q-mt-lg.q-pa-sm(v-for="(tree, i) in trees")
          q-tree(:nodes="tree", node-key="label", color="primary", dark)
            q-item.full-width(slot="header-generic", slot-scope="prop").q-pl-none
              q-item-side
                q-btn(no-caps, round, size="sm", disabled) {{ getInitials(prop.node.label) }}
                q-btn(
                @click="handlerEdit(prop.node, 'shortcut')",
                size="sm", round)
                  q-icon(v-if="!prop.node.shortcut", name="keyboard")
                  span.text-primary(v-else) {{ prop.node.shortcut }}

              // edit term
              //
              template(v-if="editTermId === prop.node.id")
                q-card.bg-grey-9.q-ml-sm(style="min-width: 400px;")
                  q-card-main.q-pt-xs
                    q-input(ref="inputterm", v-model="editTermNewValue", :stack-label="$t('labels.edit_term')", placeholder="empty", dark)
                  q-card-separator
                  q-card-main.q-pt-xs
                    // FIXME: No idea where the number is coming from on the screen
                    q-input.q-py-none.q-my-none(ref="inputshortcut", v-model="editTermShortcut", :stack-label="$t('labels.set_shortcut')",
                    placeholder="not defined", dark)
                  q-card-separator
                  q-card-main.text-center
                    q-btn(@click="editTerm(prop.node.id, i)", :label="$t('buttons.save')", color="primary", size="sm")
                    q-btn.q-ml-sm(@click="cancelButton()", :label="$t('buttons.cancel')", color="primary", size="sm")

              // delete term
              //
              template(v-else-if="deleteTermId === prop.node.id")
                // q-card.bg-grey-9.q-ml-sm(style="min-width: 400px;")
                q-card.bg-grey-9.q-ml-sm(style="min-width: 400px;")
                  q-card-main.text-center
                    | Delete&nbsp;
                    span.text-primary {{ prop.node.label }}
                    | &nbsp;?
                  q-card-separator
                  q-card-main.text-center
                    q-btn(@click="removeTerm(prop.node.id, i)", :label="$t('buttons.delete')", color="primary", size="sm")
                    q-btn.q-ml-sm(@click="cancelButton()", :label="$t('buttons.cancel')", color="primary", size="sm")

              // show term
              //
              template(v-else)
                q-item-main
                  q-item-tile {{ prop.node.label }}
                q-item-side.q-pl-sm(v-if="editTermId !== prop.node.id && deleteTermId !== prop.node.id")
                  // q-btn.rotate-90(@click="", icon="play_arrow", size="sm", round)
                  q-btn(@click="handlerEdit(prop.node, 'term')", icon="edit", size="sm", round)
                  q-btn.q-ml-sm(@click="handlerDelete(prop.node)", icon="clear", size="sm", round)

            q-item(slot="header-add", slot-scope="prop")
              q-item-main
                q-input(v-model="tree[0].newChild", value="eins", :float-label="$t('labels.add_term')", dark)
              q-item-side
                q-btn(@click="addTerm(tree[0], i)", icon="add", color="primary", size="sm", round)

</template>

<script>
  // import FormMain from '../../../components/shared/forms/FormMain'
  import ModalConfirm from '../../../components/shared/dialogs/ModalConfirm'

  export default {
    components: {
      // FormMain,
      ModalConfirm
    },
    data () {
      // const _this = this
      return {
        deleteTermId: '',
        dummyTermId: 0,
        editTermId: '',
        editTermNewValue: '',
        editTermShortcut: '',
        newVocabulary: '',
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
          children.push({id: this.dummyTermId, label: this.vocabularies[i].entries[k].value, header: 'generic', body: 'generic', shortcut: ''})
        }
        // children.unshift({label: '', body: 'test'})
        children.push({label: '', header: 'add'})
        this.trees.push([{newChild: '', _uuid: this.vocabularies[i]._uuid, label: this.vocabularies[i].title, children: children}])
      }
      // console.log(this.trees)
    },
    methods: {
      addTerm (val, i) {
        this.dummyTermId++
        let target = this.trees[i][0].children
        target.pop()
        target.push({id: this.dummyTermId, label: val.newChild, header: 'generic', body: 'generic'})
        target.push({label: '', header: 'add'})
        this.trees[i][0].newChild = ''
      },
      addVocabulary (val) {
        this.trees.unshift([{label: val, children: [{label: 'empty', header: 'add'}]}])
      },
      cancelButton () {
        this.deleteTermId = ''
        this.editTermId = ''
      },
      cancelModal () {
        this.newVocabulary = ''
      },
      defineShortcut (val, i) {
        console.log(val, i)
      },
      editTerm (val, i) {
        console.log(val, i, this.editTermNewValue)
        let target = this.trees[i][0].children
        let editIndex = target.map(function (item) { return item.id }).indexOf(val)
        // console.log(editIndex, target[editIndex])
        target[editIndex].label = this.editTermNewValue
        target[editIndex].shortcut = this.editTermShortcut
        console.log(target[editIndex])
        this.editTermId = ''
        this.editTermNewValue = ''
        this.editTermShortcut = ''
      },
      getInitials (val) {
        return val.split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      },
      handlerDelete (val) {
        console.log(val)
        this.cancelButton()
        this.deleteTermId = val.id
      },
      handlerEdit (val, focus) {
        // let targetFocus = 'input' + focus
        console.log(val, focus)
        this.cancelButton()
        this.editTermId = val.id
        this.editTermNewValue = val.label
        this.editTermShortcut = val.shortcut
        // this.$refs.inputterm.focus()
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
