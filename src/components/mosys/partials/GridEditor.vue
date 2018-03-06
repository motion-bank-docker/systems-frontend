<template lang="pug">

  div.cell-grid-container
    div.cell-grid(:style="gridStyle")
      template(v-for="(cell, index) in cells")
        cell(:cell="cells[index]")

</template>

<script>
  import { QScrollArea } from 'quasar-framework'
  import Cell from './Cell'

  export default {
    components: {
      QScrollArea,
      Cell
    },
    data () {
      return {
        grid: {
          columns: 10,
          rows: 3,
          ratio: (16 / 9.0)
        },
        cells: [
          {
            type: 'title',
            content: 'Mein Toller Titel',
            x: 1,
            y: 1,
            width: 1,
            height: 1
          },
          {
            type: 'text',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis facere facilis, iste iusto labore, mollitia nihil perspiciatis praesentium quae quibusdam quis repudiandae saepe, sed soluta voluptatum. Deleniti earum iste velit!',
            x: 1,
            y: 2,
            width: 1,
            height: 2
          },
          {
            type: 'video',
            content: 'https://www.youtube.com/watch?v=Cn4vC80Pv6Q',
            x: 2,
            y: 1,
            width: 2,
            height: 2
          }
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
      // setId () {
      //   api.getCellSet(this.setId, this.setCellSet)
      // },
      // set () {
      //   this.updateGridDimensions()
      // }
    },
    methods: {
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
