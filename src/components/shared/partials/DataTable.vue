<template lang="pug">

  q-table(
    @rowclick="onRowClick($event)",
    :dark="true",
    :data="rows",
    :config="conf",
    :columns="cols",
    :actions="actns",
    row-key="title"
    )

    //
      template(slot="col-actions", slot-scope="cell")
        q-btn(flat, small, v-for="a in actions", :color="a.color || 'neutral'", :key="a.type",
        @click="action(a.type, cell)") {{ $t(a.title) }}

      template(slot="col-created", slot-scope="cell")
        span(v-if="cell.data") {{ formatDateTime(cell.data) }}

      template(slot="col-updated", slot-scope="cell")
        span(v-if="cell.data") {{ formatDateTime(cell.data) }}

      template(slot="col-author", slot-scope="cell")
        username(:uuid="cell.data")

    //
    // cell "title"
    //
    q-td(
      slot="body-cell-title",
      slot-scope="props",
      :props="props"
      )
      q-btn(
        flat, small
        ) {{ props.row.title }}

    //
    // cell "actions"
    //
    q-td(
      slot="body-cell-actions",
      slot-scope="props",
      :props="props"
      )
      // q-btn(
        v-for="a in actions",
        // :key="a.type",
        flat, small
        ) {{ $t(a.title) }} {{ $t(a.type) }}

      q-btn(
        @click="action(a.action)",
        v-for="a in actions",
        :color="a.color || 'neutral'",
        :key="a.type",
        flat, small
        ) {{ $t(a.title) }}

</template>

<script>
  import Username from './Username'
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import { QTr, QTd } from 'quasar'
  export default {
    components: {
      Username,
      QTr,
      QTd
    },
    props: ['entries', 'config', 'columns', 'actions'],
    data () {
      const _this = this
      const defaultConfig = {
        rowHeight: '50px',
        noHeader: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        bodyStyle: {
          // maxHeight: '500px'
        },
        /*
        pagination: {
          rowsPerPage: 20,
          options: [5, 10, 20, 30, 50]
        },
        */
        // selection: 'single',
        messages: {
          noData: _this.$t('table.no_data'),
          noDataAfterFiltering: _this.$t('table.no_data_in_filter')
        }
        /*
        labels: {
          columns: this.$t('table.labels.columns'),
          allCols: this.$t('table.labels.all_columns'),
          rows: this.$t('table.labels.rows'),
          selected: {
            singular: this.$t('table.labels.item_selected'),
            plural: this.$t('table.labels.items_selected')
          },
          clear: this.$t('table.labels.clear'),
          search: this.$t('table.labels.search'),
          all: this.$t('table.labels.all')
        }
        */
      }
      const cols = this.columns.map(column => {
        return ObjectUtil.merge({
          filter: false,
          sort: false
          // classes: 'bg-dark'
          // Type required if using sort.
          // Available values: "string", "number", "date", "boolean"
          // type: 'string',
        }, column)
      })
      cols.push({
        label: 'Actions',
        name: 'actions',
        field: 'action',
        classes: 'bg-dark text-right'
      })
      return {
        rows: [],
        conf: ObjectUtil.merge(defaultConfig, _this.config),
        cols: cols,
        actns: _this.actions
      }
    },
    methods: {
      onRowClick (target) {
        this.$emit('row-click', target)
      },
      action (action) {
        console.log(action)
        // this.$emit('action', type, target)
      },
      updateEntries () {
        const _this = this
        if (this.entries instanceof Promise) {
          this.entries.then(entries => {
            _this.rows = entries
          })
        }
        else {
          _this.rows = this.entries
        }
      },
      formatDateTime (data) {
        return DateTime.fromISO(data).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
      }
    },
    mounted () {
      this.updateEntries()
    },
    watch: {
      entries () {
        this.updateEntries()
      }
    }
  }
</script>
