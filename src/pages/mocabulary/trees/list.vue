<template lang="pug">
  full-screen
    h5.caption(dark) {{ $t('routes.mocabulary.trees.title') }}
    q-tree(:nodes="trees", node-key="label", dark)
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
        let k = 0
        let items = []
        for (k = 0; k < this.vocabularies[i].entries.length; k++) {
          items.push({label: this.vocabularies[i].entries[k].value})
        }
        this.trees.push({label: this.vocabularies[i].title, children: items})
      }
    }
  }
</script>
