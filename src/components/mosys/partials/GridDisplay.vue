<template lang="pug">

  div.cell-grid-container
    div.cell-grid(:style="gridStyle")

      template(v-for="(cell, index) in cells")
        .cell-item(
          :style="getCellStyle(cell)",
          :title="cell.title")
            cell(:cell="cell", display)

      q-fixed-position(corner="top-right", :offset="[18, 18]", v-if="$store.state.auth.payload")
        q-btn(round, color="primary", small, @click="$router.push(`/mosys/grids/${$route.params.id}/annotate`)")
          q-icon(name="edit")

</template>

<script>
  import { QFixedPosition, QBtn, QIcon } from 'quasar-framework'
  import Cell from './Cell'

  export default {
    components: {
      Cell, QFixedPosition, QBtn, QIcon
    },
    props: ['gridUuid'],
    data () {
      return {
        cells: [],
        gridMetadata: {},
        gridDimensions: {gridWidth: 0, gridHeight: 0, cellWidth: 0, cellHeight: 0},
        gridStyle: {}
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
    methods: {
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
      getCellStyle (cell) {
        return {'grid-column-start': cell.x, 'grid-column-end': `span ${cell.width}`, 'grid-row-start': cell.y, 'grid-row-end': `span ${cell.height}`}
      }
    }
  }
</script>

<style scoped lang="stylus">

  .cell-grid
    display grid

    .cell-item
      position relative
      overflow: hidden
      grid-column-start: 1
      grid-column-end: span 1
      grid-row-start: 1
      grid-row-end: span 1

      .cell-item-inner
        width 100%
        height 100%

</style>
