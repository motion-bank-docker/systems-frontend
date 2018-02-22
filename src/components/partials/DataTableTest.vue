<template lang="pug">
  div
    slot(name="table-title")
    slot(name="table-button")
    slot(name="table-formular")
    q-data-table(
      title="Table Title",
      :data="tableData",
      :columns="columns",
      row-key="name")
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
        }
      ]
    })
  }
</script>

<style scoped>

</style>
