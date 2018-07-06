<template lang="pug">
  q-table(
    v-if="cols.length > 0",
    dark,
    ref="table",
    row-key="name",
    :data="rows",
    :columns="cols",
    :selection="selection",
    :selected.sync="selected",
    @request="request",
    :loading="loading",
    :rows-per-page-options="rowsPerPage",
    :pagination.sync="pagination",
    :hide-bottom="hideBottom",
    :filter="filter",
    :title="tableTitle")
    template(slot="top-left", slot-scope="props")
      slot(name="buttons-left")
    template(slot="top-right", slot-scope="props")
      q-search(hide-underline, v-model="filter", dark)
    q-td(slot="body-cell-title", slot-scope="props", :props="props")
      router-link.primary(v-if="hasShow", :to="getViewLink(props.row.uuid)")
        promise-span(:value="props.value")
      promise-span(v-if="!hasShow", :value="props.value")
    q-td(slot="body-cell-actions", slot-scope="props", :props="props")
      q-btn(v-for="btn in props.value", flat, size="sm", :icon="btn.icon",
        @click="defaultClick(btn, props)") {{ $t(btn.title) }}
</template>

<script>
  import PromiseSpan from './PromiseSpan'
  import { DateTime } from 'luxon'
  export default {
    props: ['config', 'path', 'query', 'title', 'basePath', 'hasShow'],
    components: {
      PromiseSpan
    },
    data () {
      return {
        // basePath: 'groups',
        rowsPerPage: [0],
        pagination: {
          sortBy: 'title',
          descending: false,
          page: 1,
          rowsPerPage: 0
          // rowsNumber: 0
        },
        hideBottom: true,
        selection: 'none',
        selected: [],
        filter: '',
        loading: false,
        rows: [],
        cols: []
      }
    },
    methods: {
      updateConfig () {
        if (!this.config || !this.config.columns) return
        const _this = this
        const makeFormatter = function (field) {
          if (field === 'created' || field === 'updated') {
            return val => {
              if (!val) return ''
              return DateTime.fromISO(val).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
            }
          }
          else if (field === 'author') {
            return val => val.name
          }
          else if (field === 'actions') {
            return () => {
              return _this.config.actions
            }
          }
          return undefined
        }
        const cols = this.config.columns.map(column => {
          column = Object.assign({
            name: typeof column.field === 'string' ? column.field : undefined,
            align: 'left',
            filter: true,
            sort: true,
            type: 'string'
          }, column)
          const formatter = makeFormatter(column.field)
          if (formatter) column.format = formatter
          return column
        })
        cols.push({
          name: 'actions',
          align: 'right',
          type: 'string',
          filter: false,
          sort: false,
          format: makeFormatter('actions')
        })
        this.cols = cols
      },
      defaultClick (btn, props) {
        const _this = this
        if (btn.click) return btn.click(props.row)
        if (btn.type === 'delete') {
          _this.loading = true
          return this.$store.dispatch(`${this.path}/delete`, props.row.uuid).then(() => {
            _this.loading = false
          }).catch(err => {
            console.error(err)
            _this.loading = false
          })
        }
      },
      getViewLink (id) {
        return `${this.basePath}/${id}`
      },
      request (/* { pagination, filter } */) {
        this.loading = true
        const _this = this
        this.$store.dispatch(`${this.path}/find`, this.query)
          .then((data) => {
            console.log(data)
            // _this.rowsNumber = data.items.length
            _this.rows = data.items.map(r => Object.assign(r, { actions: '' }))
            _this.loading = false
          })
          .catch(err => {
            console.error(err)
            _this.loading = false
          })
      },
      action (type, target) {
        this.$emit('action', type, target)
      }
    },
    mounted () {
      this.updateConfig()
      this.request({ pagination: this.pagination, filter: this.filter })
    },
    computed: {
      tableTitle () {
        return this.$t(this.title)
      }
    },
    watch: {
      selected () {
        console.debug('selected', this.selected)
      },
      config () {
        this.updateConfig()
      }
    }
  }
</script>
