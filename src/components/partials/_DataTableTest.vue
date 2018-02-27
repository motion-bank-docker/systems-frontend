<template lang="pug">

  div.table-wrap

    div.table-top
      slot(name="table-top-item")

    div.table-form
      slot(name="table-form-item")

    q-data-table(
      title="Table Title",
      :data="tableData",
      :columns="columns",
      row-key="name")
      q-tr

    div.table-bottom
      slot(name="table-bottom-item")

</template>

<script>
  import {
    QDataTable
  } from 'quasar-framework'
  export default {
    components: {
      QDataTable
    },
    data: () => ({
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Group Title',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'status',
          required: true,
          label: 'Status',
          align: 'left',
          field: 'status',
          sortable: true
        },
        {
          name: 'timestamp',
          required: true,
          label: 'Timestamp',
          align: 'left',
          field: 'timestamp',
          sortable: true
        }
      ],
      tableData: [
        {
          name: 'Video 1',
          status: 'public',
          timestamp: 'today'
        }, {
          name: 'Video 2',
          status: 'private',
          timestamp: '2017-12-03'
        }, {
          name: 'Video 3',
          status: 'public',
          timestamp: '2017-12-03'
        }
      ]
    })
  }
</script>

<style scoped>

  .table-top {
    padding: .5em 0;
  }
    .table-top-item {
      display: inline-block;
      padding: .2em .5em;
    }

      .table-top-button {
      }

        .table-top-button > * {
          background-color: #ddd;
          color: white;
          border-radius: .2em;
          margin-right: .2em;
          padding: .2em .5em;
        }

  .table-wrap {
    /* margin: 0 1.5em 4em; */
    margin: 0 5vw 4em
  }
</style>
