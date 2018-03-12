<template lang="pug">

  div.cell-grid-container

    div.cell-grid(
      @dragenter="handleGridDragOver",
      @dragover="handleGridDragOver",
      @dragleave="handleGridDragEnd",
      @drop="handleGridDrop",
      @contextmenu="handleGridContextMenu",
      :style="gridStyle")

      q-context-menu(ref="gridmenu")
        q-list(link, separator, no-border, style="min-width: 150px; max-height: 300px;")
          q-item(
          v-for="action in gridContextMenuActions",
          :key="action.label",
          @click="event => {action.handler(event), $refs.gridmenu.close()}")
            q-item-main(:label="action.label")

      template(v-for="(cell, index) in cells")
        .cell-item(
          v-if="cellUIStates[cell.uuid] && !cellUIStates[cell.uuid].beingDragged",
          draggable="true",
          @dragstart="event => {handleCellDragStart(event, cell)}",
          @dragend="event => {handleCellDragEnd(event, cell)}",
          @contextmenu="handleCellContextMenu",
          :style="getCellStyle(cell)",
          :title="cell.title",
          @click.prevent="event => {handleCellClick(event, cell)}",
          :class="{selected: cellUIStates[cell.uuid] ? cellUIStates[cell.uuid].selected : false}")
            cell(:cell="cell", preview)
            div.cell-item-resize-handle(
              draggable="true",
              @dragstart="event => {handleCellResizerDragStart(event, cell)}",
              @dragend="event => {handleCellResizerDragEnd(event, cell)}",
              @dragexit="event => {handleCellResizerDragEnd(event, cell)}")
                q-icon(name="network cell")

            q-context-menu
              q-list(link, separator, no-border, style="min-width: 150px; max-height: 300px;")
                q-item(
                  v-for="action in cellContextMenuActions",
                  :key="action.label",
                  @click="event => {action.handler(event, cell)}")
                    q-item-main(:label="action.label")

      template(v-for="(tmpCell, index) in tmpCells")
        .cell-item.cell-item-tmp(:style="getCellStyle(tmpCell)")
          cell(:cell="tmpCell")

      q-fixed-position(corner="top-right", :offset="[18, 18]", v-if="!$store.state.mosysGridEditorStore.showSources")
        q-btn(round, color="primary", small, @click="handleGridButtonClickEdit", style="margin-right: 0.5em")
          q-icon(name="add")
        q-btn(round, color="primary", small, @click="$router.push(`/mosys/grids/${$route.params.id}`)")
          q-icon(name="remove red eye")

</template>

<script>
  // import Vue from 'vue'
  // import constants from '../../../lib/constants'
  import {
    QContextMenu, QList,
    QItem, QItemMain, QFixedPosition, QBtn,
    QIcon
  } from 'quasar-framework'
  import Cell from './Cell'

  const nullImage = new Image()
  nullImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

  export default {
    components: {
      QContextMenu,
      QList,
      QItem,
      QItemMain,
      QFixedPosition,
      QBtn,
      QIcon,
      Cell
    },
    props: ['gridUuid'],
    data () {
      return {
        cellContextMenuActions: {
          // edit: {
          //   label: 'Edit',
          //   handler: this.handleCellContextMenuEdit
          // },
          delete: {
            label: 'Delete',
            handler: this.handleCellContextMenuDelete
          },
          insert_column_left: {
            label: 'Insert Column Left',
            handler: this.handleGridContextMenuInsertColumnLeft
          },
          insert_row_above: {
            label: 'Insert Row Above',
            handler: this.handleGridContextMenuInsertRowAbove
          }
        },
        gridContextMenuActions: {
          // add_cell: {
          //   label: 'Add Cell',
          //   handler: this.handleGridContextMenuAddCell
          // },
          insert_column_left: {
            label: 'Insert Column Left',
            handler: this.handleGridContextMenuInsertColumnLeft
          },
          insert_row_above: {
            label: 'Insert Row Above',
            handler: this.handleGridContextMenuInsertRowAbove
          }
        },
        gridMetadata: {},
        cells: [],
        tmpCells: [],
        cellUIStates: {},
        gridDimensions: {gridWidth: 0, gridHeight: 0, cellWidth: 0, cellHeight: 0},
        gridStyle: {},
        contextMenuClickPosition: {}
        // dragCell: {},
        // gridContainerStyle: {},
        // renderFull: true,
      }
    },
    mounted () {
      const _this = this
      window.addEventListener('resize', this.updateGridDimensions)
      this.fetchMetadataAnnotations()
        .then(() => {
          this.updateGridDimensions()
          _this.fetchCellAnnotations()
        })
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.updateGridDimensions)
    },
    watch: {
      cells () {
        this.updateCellUIStates()
      },
      gridUuid () {
        console.log('Grid UUID changed, fetch metadata again??')
        // this.gridMetadata = Object.assign({}, this.grid)
      },
      gridMetadata () {
        this.updateGridDimensions()
      }
    },
    methods: {
      handleCellResizerDragStart (event, cell) {
        event.dataTransfer.setDragImage(nullImage, 0, 0)
        this.cellUIStates[cell.uuid].beingResized = true
        let tmpCell = this.getTmpCell(cell)
        this.tmpCells.push(tmpCell)
      },
      handleCellResizerDragEnd (event, cell) {
        let position = this.getGridPositionForEvent(event)
        cell.width = Math.max(1, 1 + position.x - cell.x)
        cell.height = Math.max(1, 1 + position.y - cell.y)
        this.cellUIStates[cell.uuid].beingResized = false
        this.tmpCells = []
        this.updateCellStore(cell)
      },
      handleCellClick (event, cell) {
        const _this = this
        this.cellUIStates[cell.uuid].selected = !this.cellUIStates[cell.uuid].selected
        let selectedCells = Object.keys(this.cellUIStates).filter(k => {
          return _this.cellUIStates[k].selected
        }).map(k => {
          return _this.cells.find(c => c.uuid === k)
        })
        this.$store.commit('mosysGridEditorStore/setSelectedCells', selectedCells)
      },
      handleCellDragStart (event, cell) {
        if (this.cellUIStates[cell.uuid].beingResized) {
        }
        else {
          event.dataTransfer.setData('text/plain', JSON.stringify(cell))
          event.dataTransfer.setDragImage(nullImage, 0, 0)
          this.cellUIStates[cell.uuid].beingDragged = true
          let elContainerBoundingBox = this.$el.getBoundingClientRect()
          let elBoundingBox = event.srcElement.getBoundingClientRect()
          let offset = {
            x: (event.clientX - elContainerBoundingBox.x) - (elBoundingBox.x - elContainerBoundingBox.x),
            y: (event.clientY - elContainerBoundingBox.y) - (elBoundingBox.y - elContainerBoundingBox.y)
          }
          this.cellUIStates[cell.uuid].draggingOffset = offset
          this.cellUIStates[cell.uuid].beginDragged = true
        }
        let tmpCell = this.getTmpCell(cell)
        this.tmpCells.push(tmpCell)
      },
      handleCellDragEnd (event, cell) {
        this.cellUIStates[cell.uuid].beingDragged = false
      },

      handleCellContextMenuClick (event) {
      },
      handleCellContextMenuEdit (event, cell) {
        // this.$store.commit('mosysGridEditorStore/showSources')
        // this.$store.commit('mosysGridEditorStore/setSourcesTab', 'tab-default-cells')
      },
      handleCellContextMenuDelete (event, cell, refId) {
        const _this = this
        _this.cells = _this.cells.filter(c => c !== cell)
        this.$store.dispatch('annotations/remove', cell.uuid)
          .then(() => {
            _this.fetchCellAnnotations()
          })
        if (refId) {
          this.$refs[refId].close()
        }
      },
      handleCellContextMenu (event) {
        this.contextMenuClickPosition = this.getGridPositionForEvent(event)
      },

      handleGridDragOver (event) {
        let _this = this
        let cell = Object.keys(this.cellUIStates).filter(uuid => {
          return _this.cellUIStates[uuid].beginDragged || _this.cellUIStates[uuid].beingResized
        }).map(uuid => {
          return _this.cellUIStates[uuid].cell
        }).shift()
        let offset, position
        if (!cell) {
          cell = {uuid: null, x: 1, y: 1, width: 1, height: 1}
          position = this.getGridPositionForEvent(event)
        }
        else {
          offset = this.cellUIStates[cell.uuid].draggingOffset
          position = this.getGridPositionForEvent(event, offset)
        }
        let tmpCell = this.tmpCells[0]
        if (!tmpCell && this.tmpCells.length === 0) {
          tmpCell = this.getTmpCell(cell)
          this.tmpCells.push(tmpCell)
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
      handleGridDragEnd () {
        this.tmpCells = []
      },
      handleGridDrop (event) {
        let cellDropped = event.dataTransfer.getData('text/plain')
        if (cellDropped) {
          cellDropped = JSON.parse(cellDropped)
          let cell = this.cells.find(c => c.uuid === cellDropped.uuid)
          let offset, position
          if (cell) {
            offset = this.cellUIStates[cell.uuid].draggingOffset
            position = this.getGridPositionForEvent(event, offset)
          }
          else {
            cell = cellDropped
            position = this.getGridPositionForEvent(event)
          }
          cell.x = position.x
          cell.y = position.y
          this.tmpCells = []
          this.updateCellStore(cell)
          event.preventDefault()
        }
      },

      handleGridContextMenu (event) {
        this.contextMenuClickPosition = this.getGridPositionForEvent(event)
      },
      handleGridContextMenuAddCell (event) {
        const _this = this
        let position = this.contextMenuClickPosition
        let newCell = {
          x: position.x,
          y: position.y,
          width: 1,
          height: 1,
          type: 'text',
          content: 'A new cell is born'
        }
        let annotation = this.getGridCellAnnotation(newCell)
        Promise
          .resolve()
          .then(() => {
            return _this.$store.dispatch('annotations/create', annotation)
          })
          .then(() => {
            _this.fetchCellAnnotations()
          })
      },
      handleGridContextMenuInsertColumnLeft (event) {
        const _this = this
        let position = this.contextMenuClickPosition
        this.cells.map(cell => {
          if (cell.x >= position.x) {
            cell.x += 1
            let annotation = this.getGridCellAnnotation(cell)
            Promise
              .resolve()
              .then(() => {
                return _this.$store.dispatch('annotations/patch', [cell.uuid, annotation])
              })
              .then(() => {
                _this.fetchCellAnnotations()
              })
          }
          return cell
        })

        this.gridMetadata = Object.assign({}, this.gridMetadata, {columns: this.gridMetadata.columns + 1})

        this.updateGridMetadataStore()
      },
      handleGridContextMenuInsertRowAbove (event) {
        const _this = this
        let position = this.contextMenuClickPosition
        this.cells.map(cell => {
          if (cell.y >= position.y) {
            cell.y += 1
            let annotation = this.getGridCellAnnotation(cell)
            Promise
              .resolve()
              .then(() => {
                return _this.$store.dispatch('annotations/patch', [cell.uuid, annotation])
              })
              .then(() => {
                _this.fetchCellAnnotations()
              })
          }
          return cell
        })
        this.gridMetadata = Object.assign({}, this.gridMetadata, {rows: this.gridMetadata.rows + 1})

        this.updateGridMetadataStore()
      },

      handleGridButtonClickEdit (event) {
        this.$store.commit('mosysGridEditorStore/toggleSources')
      },

      handleGridKeyReleased (event) {
      },

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
      getTmpCell (cell, type = 'UIFeedback') {
        return {
          srcUuid: cell.uuid,
          type: type,
          x: cell.x,
          y: cell.y,
          width: cell.width,
          height: cell.height
        }
      },
      getGridPositionForEvent (event, offset = {x: 0, y: 0}) {
        offset = {x: 0, y: 0} // TODO: remove quick fix
        let elContainerBoundingBox = this.$el.getBoundingClientRect()
        let x = event.clientX + this.$el.scrollLeft - elContainerBoundingBox.x - offset.x
        let y = event.clientY + this.$el.scrollTop - elContainerBoundingBox.y - offset.y
        x = Math.ceil(x / this.gridDimensions.full.cell.width)
        y = Math.ceil(y / this.gridDimensions.full.cell.height)
        return {x: x, y: y}
      },
      updateGridDimensions () {
        let elWidth = this.$el.offsetWidth
        let elHeight = this.$el.offsetHeight
        let cellSizeRatio = this.gridMetadata.ratio
        let gridHeight = elHeight
        let cellHeight = gridHeight / this.gridMetadata.rows
        let cellWidth = elWidth / Math.round(elWidth / (cellHeight * cellSizeRatio))
        let gridWidth = cellWidth * this.gridMetadata.columns
        let cellsPerWidth = elWidth / cellWidth
        let cellWidthMini = elWidth / this.gridMetadata.columns
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
            height: gridHeightMini * this.gridMetadata.rows,
            cell: {
              width: cellWidthMini,
              height: gridHeightMini
            }
          }
        }
        // TODO: fix mobile grid editor view
        // if (elWidth > 800) {
        this.gridStyle = {
          width: this.gridDimensions.full.width + 'px',
          height: '100%',
          'grid-auto-columns': this.gridDimensions.full.cell.width + 'px',
          'grid-auto-rows': this.gridDimensions.full.cell.height + 'px',
          'background-image': this.getGridBackgroundSVG(this.gridDimensions.full.cell)
        }
        /* }
        else {
          this.gridStyle = {
            width: '100%',
            height: this.gridDimensions.mini.height + 'px',
            'grid-auto-columns': this.gridDimensions.mini.cell.width + 'px',
            'grid-auto-rows': this.gridDimensions.mini.cell.height + 'px',
            'background-image': this.getGridBackgroundSVG(this.gridDimensions.mini.cell)
          }
        } */
      },
      getGridBackgroundSVG (cell) {
        return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><defs><pattern id='smallGrid' width='${cell.width}' height='${cell.height}' patternUnits='userSpaceOnUse'><path d='M ${cell.width} 0 L 0 0 0 ${cell.height}' fill='none' stroke='gray' stroke-width='0.5'/></pattern></defs><rect width='100%' height='100%' fill='url(#smallGrid)' /></svg>")`
      },
      fetchCellAnnotations () {
        const _this = this,
          query = { query: { 'body.type': '2DCell', 'target.id': this.gridUuid } }
        this.$store.dispatch('annotations/find', query)
          .then(annotations => {
            _this.cells = annotations.map(annotation => {
              let cell = JSON.parse(annotation.body.value)
              if (cell) {
                cell.uuid = annotation.uuid
                return cell
              }
              return null
            }).filter(cell => cell)
            _this.updateCellUIStates()
          })
      },
      fetchMetadataAnnotations () {
        const _this = this
        const query = { query: { 'body.type': '2DGridMetadata', 'target.id': this.gridUuid } }
        return new Promise((resolve, reject) => {
          this.$store.dispatch('annotations/find', query)
            .then(annotations => {
              let annotation = annotations.shift()
              if (annotation) {
                let metadata = JSON.parse(annotation.body.value)
                metadata.uuid = annotation.uuid
                if (metadata) {
                  _this.gridMetadata = metadata
                  resolve()
                }
              }
              else {
                _this.gridMetadata = {
                  columns: 10,
                  rows: 6,
                  ratio: 16 / 9.0
                }
                _this.updateGridMetadataStore()
              }
            })
            .catch(reject)
        })
      },
      getGridCellAnnotation (cell) {
        return {
          body: {
            type: '2DCell',
            purpose: 'linking',
            value: JSON.stringify(cell)
          },
          author: this.$store.state.auth.payload.userId,
          target: {
            id: this.gridUuid,
            type: 'Map',
            selector: {
              type: '2DLocation',
              value: `x=${cell.x}&y=${cell.y}&width=${cell.width}&height=${cell.height}`
            }
          }
        }
      },
      getGridMetadataAnnotation (uuid, metadata) {
        return {
          body: {
            type: '2DGridMetadata',
            purpose: 'linking',
            value: JSON.stringify(metadata)
          },
          author: this.$store.state.auth.payload.userId,
          target: {
            id: uuid,
            type: 'Map'
          }
        }
      },
      updateCellStore (cell) {
        const _this = this
        let annotation = this.getGridCellAnnotation(cell)
        Promise
          .resolve()
          .then(() => {
            if (cell.uuid) {
              return _this.$store.dispatch('annotations/patch', [cell.uuid, annotation])
            }
            else {
              return _this.$store.dispatch('annotations/create', annotation)
            }
          })
          .then(() => {
            _this.fetchCellAnnotations()
          })
      },
      updateGridMetadataStore () {
        const _this = this
        let mapAnnotation = this.getGridMetadataAnnotation(this.gridUuid, this.gridMetadata)

        return Promise.resolve()
          .then(() => {
            if (_this.gridMetadata.uuid) {
              return _this.$store.dispatch('annotations/patch', [_this.gridMetadata.uuid, mapAnnotation])
            }
            return _this.$store.dispatch('annotations/create', mapAnnotation)
          })
          .then(() => {
            _this.updateGridDimensions()
          })
      },
      getCellStyle (cell) {
        return {'grid-column-start': cell.x, 'grid-column-end': `span ${cell.width}`, 'grid-row-start': cell.y, 'grid-row-end': `span ${cell.height}`}
      }
      // setCellSet: function (cellSet) {
      //   this.grid = cellSet
      // }
    }
  }
</script>

<style scoped lang="stylus">

  .cell-grid
    display grid
    background-color #eee

  .cell-item

    &
      background-color rgba(0,0,0,0.2)
      border 1px solid #777
      margin 1px
      box-sizing border-box
      position relative
      overflow: hidden
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
      color rgba(0,0,0,0.2)
      position absolute
      right 0
      bottom 0
      width 18px
      height 20px

      &:hover
        color black

</style>
