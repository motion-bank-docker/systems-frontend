<template lang="pug">
  .cell-item(
      draggable="true",
      @dragstart="handleDragStart",
      :style="cellStyle",
      :title="cell.title",
      @click.prevent="handleClick",
      :class="{selected}")
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
      },
      cellStyle () {
        return {
          'grid-column-start': this.cell.x,
          'grid-column-end': `span ${this.cell.width}`,
          'grid-row-start': this.cell.y,
          'grid-row-end': `span ${this.cell.height}`
        }
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

  .cell-item

    &
      overflow: hidden
      border 1px solid lightsalmon
      grid-column-start: 1
      grid-column-end: span 1
      grid-row-start: 1
      grid-row-end: span 1

    &:hover
      background-color lightblue

    &.selected
      background-color lightpink

    .cell-content
      pointer-events none

    h1, h2, h3, h4, h5, h6
      font-size: 1em
      font-weight: normal

    a, a:hover, a:visited
      color: black
      text-decoration: underline

</style>
