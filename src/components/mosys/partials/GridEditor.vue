<template lang="pug">

  div.cell-grid-container
    div.cell-grid(
      @dragenter="handleDrag", @dragover="handleDrag",
      @drop="handleDrop",
      :style="gridStyle")
      template(v-for="(tmpCell, index) in tmpCells")
        cell(:cell="tmpCell")
      template(v-for="(cell, index) in cells")
        cell(:cell="cell")
          q-context-menu
            q-list(link, separator, no-border, style="min-width: 150px; max-height: 300px;")
              q-item(
                v-for="action in contextMenuActions",
                :key="action.label",
                @click="event => {action.handler(event, cell)}")
                  q-item-main(:label="action.label")
</template>

<script>
  import { QScrollArea, QContextMenu, QList, QItem, QItemMain } from 'quasar-framework'
  import Cell from './Cell'

  export default {
    components: {
      QScrollArea,
      QContextMenu,
      QList,
      QItem,
      QItemMain,
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
        tmpCells: [
        ],
        renderFull: true,
        gridDimensions: {gridWidth: 0, gridHeight: 0, cellWidth: 0, cellHeight: 0},
        gridStyle: {},
        gridContainerStyle: {

        }
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
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.updateGridDimensions)
    },
    watch: {
    },
    methods: {
      handleContextMenuEdit (event, cell) {
      },
      handleContextMenuDelete (event, cell) {
        if (cell) {
          this.cells = this.cells.filter(c => c !== cell)
        }
      },
      handleDrag (event) {
        if (event.dataTransfer.types.includes('text/plain')) {
          let tmpCell
          if (this.tmpCells.length === 0) {
            tmpCell = {x: 1, y: 1, width: 1, height: 1}
            this.tmpCells.push(tmpCell)
          }
          else {
            tmpCell = this.tmpCells[0]
          }
          let position = this.getGridPositionForEvent(event)
          tmpCell.x = position.x
          tmpCell.y = position.y
          event.preventDefault()
        }
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
        let elBoundingBox = this.$el.getBoundingClientRect()
        let [x, y] = [event.clientX - elBoundingBox.x, event.clientY - elBoundingBox.y]
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

</style>
