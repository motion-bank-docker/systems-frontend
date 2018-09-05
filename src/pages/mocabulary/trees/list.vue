<template lang="pug">
  full-screen
    h5.caption(dark) {{ $t('routes.mocabulary.trees.title') }}
    q-card.q-mb-xl.q-pa-sm(v-for="(tree, i) in trees")
      q-tree(:nodes="tree", node-key="label", color="primary", dark)
</template>

<script>
  export default {
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
          children.push({label: this.vocabularies[i].entries[k].value})
        }
        this.trees.push([{label: this.vocabularies[i].title, children: children}])
      }
    }
  }
</script>
