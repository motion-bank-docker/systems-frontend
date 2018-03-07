<template lang="pug">

  div.cell-grid-container

    div.cell-grid(
      @dragenter="handleDragOverGrid",
      @dragover="handleDragOverGrid",
      @dragleave="handleDragEndGrid",
      @drop="handleDrop",
      :style="gridStyle")

      template(v-for="(cell, index) in cells")
        .cell-item(
          draggable="true",
          @dragstart="event => {handleCellDragStart(event, cell)}",
          @dragend="event => {handleCellDragEnd(event, cell)}",
          :style="{'grid-column-start': cell.x, 'grid-column-end': `span ${cell.width}`, 'grid-row-start': cell.y, 'grid-row-end': `span ${cell.height}`}",
          :title="cell.title",
          @click.prevent="event => {handleCellClick(event, cell)}",
          :class="{selected: cellUIStates[cell.uuid] ? cellUIStates[cell.uuid].selected : false}")
            cell(:cell="cell")
            div.cell-item-resize-handle(
              draggable="true",
              @dragstart="event => {handleCellResizerDragStart(event, cell)}",
              @dragend="event => {handleCellResizerDragEnd(event, cell)}",
              @dragexit="event => {handleCellResizerDragEnd(event, cell)}"
              )
            q-context-menu
              q-list(link, separator, no-border, style="min-width: 150px; max-height: 300px;")
                q-item(
                  v-for="action in contextMenuActions",
                  :key="action.label",
                  @click="event => {action.handler(event, cell)}")
                    q-item-main(:label="action.label")

      template(v-for="(tmpCell, index) in tmpCells")
        .cell-item(:style="{'grid-column-start': tmpCell.x, 'grid-column-end': `span ${tmpCell.width}`, 'grid-row-start': tmpCell.y, 'grid-row-end': `span ${tmpCell.height}`}")
          cell(:cell="tmpCell")

</template>

<script>
  import { QScrollArea, QContextMenu, QList, QItem, QItemMain, QFixedPosition, QBtn } from 'quasar-framework'
  import Cell from './Cell'

  export default {
    components: {
      QScrollArea,
      QContextMenu,
      QList,
      QItem,
      QItemMain,
      QFixedPosition,
      QBtn,
      Cell
    },
    data () {
      return {
        contextMenuActions: {
          edit: {
            label: 'Edit',
            handler: this.handleContextMenuEdit
          },
          delete: {
            label: 'Delete',
            handler: this.handleContextMenuDelete
          }
        },
        grid: {
          columns: 10,
          rows: 4,
          ratio: (16 / 9.0)
        },
        cells: [
          {
            uuid: 'hasen-koettel-scheisse',
            type: 'title',
            content: 'Mein Toller Titel',
            x: 1,
            y: 1,
            width: 1,
            height: 1
          },
          {
            uuid: 'einhorn-fussel-kram',
            type: 'text',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis facere facilis, iste iusto labore, mollitia nihil perspiciatis praesentium quae quibusdam quis repudiandae saepe, sed soluta voluptatum. Deleniti earum iste velit!',
            x: 1,
            y: 2,
            width: 1,
            height: 2
          },
          {
            uuid: 'taben-kabel-zippel-zappel',
            type: 'video',
            content: 'https://www.youtube.com/watch?v=Cn4vC80Pv6Q',
            x: 2,
            y: 1,
            width: 2,
            height: 2
          }
        ],
        dragCell: {},
        tmpCells: [],
        cellUIStates: {},
        renderFull: true,
        gridDimensions: {gridWidth: 0, gridHeight: 0, cellWidth: 0, cellHeight: 0},
        gridStyle: {},
        gridContainerStyle: {}
      }
    },
    computed: {
      cellWidth () {
        return 200
      },
      cellHeight () {
        return 100
      }
    },
    mounted () {
      // this.updateGridDimensions = _.debounce(this._updateGridDimensions, 100)
      // api.getCellSet(this.setId, this.setCellSet)

      window.addEventListener('resize', this.updateGridDimensions)
      this.updateGridDimensions()
      this.updateCellUIStates()
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.updateGridDimensions)
    },
    watch: {
      cells () {
        this.updateCellUIStates()
      },
      grid () {
        this.updateGridDimensions()
      }
    },
    methods: {
      updateCellUIStates () {
        let newCellUIStates = {}
        this.cells.map(c => {
          newCellUIStates[c.uuid] = {
            selected: false,
            beingResized: false,
            cell: c
          }
        })
        this.cellUIStates = newCellUIStates
      },
      handleCellResizerDragStart (event, cell) {
        this.cellUIStates[cell.uuid].beingResized = true
        let tmpCell = {type: 'UIFeedback', x: cell.x, y: cell.y, width: cell.width, height: cell.height}
        this.tmpCells.push(tmpCell)
      },
      handleCellResizerDragEnd (event, cell) {
        let position = this.getGridPositionForEvent(event)
        cell.width = Math.max(1, 1 + position.x - cell.x)
        cell.height = Math.max(1, 1 + position.y - cell.y)
        this.cellUIStates[cell.uuid].beingResized = false
        this.tmpCells = []
      },
      handleCellClick (event, cell) {
        this.cellUIStates[cell.uuid].selected = !this.cellUIStates[cell.uuid].selected
      },
      handleCellDragStart (event, cell) {
        if (this.cellUIStates[cell.uuid].beingResized) {
        }
        else {
          event.dataTransfer.setData('text/plain', JSON.stringify(cell))
          this.cellUIStates[cell.uuid].beingDragged = true
        }
        let tmpCell = {type: 'UIFeedback', x: cell.x, y: cell.y, width: cell.width, height: cell.height}
        this.tmpCells.push(tmpCell)
      },
      handleCellDragEnd (event, cell) {
        this.cellUIStates[cell.uuid].beingDragged = false
      },
      handleContextMenuEdit (event, cell) {
      },
      handleContextMenuDelete (event, cell) {
        this.cells = this.cells.filter(c => c !== cell)
      },
      handleDragOverGrid (event) {
        let _this = this
        let position = this.getGridPositionForEvent(event)
        let tmpCell = this.tmpCells[0]
        if (!tmpCell && this.tmpCells.length === 0) {
          let cell
          Object.keys(this.cellUIStates).map(uuid => {
            let state = this.cellUIStates[uuid]
            if (!cell && (state.beingDragged || state.beingResized)) cell = _this.cellUIStates[uuid].cell
          })
          if (cell) {
            tmpCell = {type: 'UIFeedback', x: cell.x, y: cell.y, width: cell.width, height: cell.height}
            this.tmpCells.push(tmpCell)
          }
        }
        if (event.dataTransfer.types.includes('text/plain')) {
          tmpCell.x = position.x
          tmpCell.y = position.y
          event.preventDefault()
        }
        else {
          tmpCell.width = Math.max(1, 1 + position.x - tmpCell.x)
          tmpCell.height = Math.max(1, 1 + position.y - tmpCell.y)
        }
      },
      handleDragEndGrid () {
        this.tmpCells = []
      },
      handleDrop (event) {
        let cellDropped = event.dataTransfer.getData('text/plain')
        if (cellDropped) {
          cellDropped = JSON.parse(cellDropped)
          let cell = this.cells.find(c => c.uuid === cellDropped.uuid)
          if (cell) {
            let position = this.getGridPositionForEvent(event)
            cell.x = position.x
            cell.y = position.y
            this.tmpCells = []
            event.preventDefault()
          }
        }
      },
      handleContextMenuClick (event) {
        console.log(event)
      },
      getGridPositionForEvent (event) {
        let elContainerBoundingBox = this.$el.getBoundingClientRect()
        // let elBoundingBox = event.srcElement.getBoundingClientRect()
        let [x, y] = [event.clientX - elContainerBoundingBox.x, event.clientY - elContainerBoundingBox.y]
        x = Math.ceil(x / this.gridDimensions.full.cell.width)
        y = Math.ceil(y / this.gridDimensions.full.cell.height)
        return {x: x, y: y}
      },
      updateGridDimensions () {
        let elWidth = this.$el.offsetWidth
        let elHeight = this.$el.offsetHeight
        let cellSizeRatio = this.grid.ratio
        let gridHeight = elHeight
        let cellHeight = gridHeight / this.grid.rows
        let cellWidth = elWidth / Math.round(elWidth / (cellHeight * cellSizeRatio))
        let gridWidth = cellWidth * this.grid.columns
        let cellsPerWidth = elWidth / cellWidth
        let cellWidthMini = elWidth / this.grid.columns
        let gridHeightMini = cellWidthMini / cellSizeRatio
        this.gridDimensions = {
          full: {
            width: gridWidth,
            height: gridHeight,
            cell: {
              width: cellWidth,
              height: cellHeight
            },
            cells_per_width: cellsPerWidth
          },
          mini: {
            width: elWidth,
            height: gridHeightMini * this.grid.rows,
            cell: {
              width: cellWidthMini,
              height: gridHeightMini
            }
          }
        }
        if (elWidth > 800) {
          this.gridStyle = {
            width: this.gridDimensions.full.width + 'px',
            height: '100%',
            'grid-auto-columns': this.gridDimensions.full.cell.width + 'px',
            'grid-auto-rows': this.gridDimensions.full.cell.height + 'px'
          }
        }
        else {
          this.gridStyle = {
            width: '100%',
            height: this.gridDimensions.mini.height + 'px',
            'grid-auto-columns': this.gridDimensions.mini.cell.width + 'px',
            'grid-auto-rows': this.gridDimensions.mini.cell.height + 'px'
          }
        }
      }
      // setCellSet: function (cellSet) {
      //   this.grid = cellSet
      // }
    }
  }
</script>

<style scoped lang="stylus">

  .cell-grid-container
    width 100%
    height 100%
    position absolute

  .cell-grid
    display grid
    width 100%
    height 100%
    position absolute
    background-color #eee

  .cell-item

    &
      position relative
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

    .cell-item-inner
      width 100%
      height 100%

    .cell-item-resize-handle
      position absolute
      right 0
      bottom 0
      width 20px
      height 20px
      background-color deeppink

      &:hover
        background-color red

</style>
