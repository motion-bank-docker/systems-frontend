<template lang="pug">
  .cell-item-inner
    template(v-if="cellTypeName")
      component(:is="cellTypeName", :cell="cell", :class="'cell-content cell-type-' + cell.type.toLowerCase()")
    template(v-else)
      div Empty cell
    slot
</template>

<script>
  import cellTypes from './cells'

  export default {
    props: ['cell'],
    data () {
      return {
        selected: false
      }
    },
    computed: {
      cellTypeName () {
        return this.cell.type ? this.cellTypeToClassName(this.cell.type) : ''
      }
    },
    mounted () {
      if (this.cellTypeName && cellTypes.hasOwnProperty(this.cellTypeName) === false) {
        throw new Error('This cell type is missing: ' + this.cell.type)
      }
    },
    methods: {
      cellTypeToClassName (type) {
        return 'Cell' + type.slice(0, 1).toUpperCase() + type.slice(1).replace(/[^a-z0-9]/ig, '').toLowerCase()
      },
      handleClick () {
        this.selected = !this.selected
      },
      handleDragStart (event) {
        event.dataTransfer.setData('text/plain', JSON.stringify(this.cell))
      }
    },
    components: cellTypes
  }
</script>

<style lang="stylus">

    .cell-content
      pointer-events none

    h1, h2, h3, h4, h5, h6
      font-size: 1em
      font-weight: normal

    a, a:hover, a:visited
      color: black
      text-decoration: underline

</style>
