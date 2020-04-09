<template lang="pug">
  full-screen
    confirm-modal(ref="confirmModal", @confirm="handleConfirmModal")
    content-block(:position="'first'")
      headline(:content="$t('routes.users.list.title')")
      content-paragraph
        q-table(
          dark
          title="Users"
          @request="request"
          :data="users",
          :pagination.sync="serverPagination"
          :columns="columns"
          :filter="filter"
          :loading="loading"
          row-key="name")
          template(slot="top-right" slot-scope="props")
            q-search(hide-underline v-model="filter" dark)
            q-btn(color="primary", icon="add", @click="$router.push({ name: 'users.create' })")
          q-td(slot="body-cell-actions", slot-scope="props", :props="props")
            q-btn(flat, size="md",
              @click="$router.push({ name: 'users.admin', params: { id: props.row.user_id } })")
              | {{ $t('buttons.edit') }}
            q-btn(flat, size="md", @click="$refs.confirmModal.show(props.row.email, props.row, 'buttons.delete')") {{ $t('buttons.delete') }}
</template>

<script>
  import { DateTime } from 'luxon'
  export default {
    name: 'users.list',
    data: () => ({
      filter: '',
      loading: false,
      serverPagination: {
        sortBy: 'email',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      users: [],
      columns: [
        {
          name: 'email',
          label: 'Email',
          align: 'left',
          field: 'email',
          sortable: true
        },
        {
          name: 'updated_at',
          label: 'Updated',
          align: 'right',
          field: 'updated_at',
          sortable: true,
          format: val => DateTime.fromISO(val).toLocaleString(DateTime.DATETIME_SHORT)
        },
        {
          name: 'created_at',
          label: 'Created',
          align: 'right',
          field: 'created_at',
          sortable: true,
          format: val => DateTime.fromISO(val).toLocaleString(DateTime.DATETIME_SHORT)
        },
        {
          name: 'actions',
          label: '',
          align: 'right'
        }
      ]
    }),
    methods: {
      async request ({ pagination, filter }) {
        if (filter && filter.length < 3) return
        this.loading = true
        const results = await this.$store.dispatch('auth0/findUsers', [filter, pagination])
        const serverPagination = pagination
        serverPagination.page = Math.floor(results.start / results.limit) + 1
        serverPagination.rowsPerPage = results.limit
        serverPagination.rowsNumber = results.total
        this.$store.commit('auth0/setPagination', serverPagination)
        this.$store.commit('auth0/setFilter', filter)
        this.filter = filter
        this.serverPagination = serverPagination
        this.users = results.users
        this.loading = false
      },
      async handleConfirmModal (item) {
        this.loading = true
        await this.$store.dispatch('auth0/removeUser', item.user_id)
        this.loading = false
        this.request({
          pagination: this.$store.state.auth0.pagination || this.serverPagination,
          filter: this.$store.state.auth0.filter || this.filter
        })
      }
    },
    mounted () {
      this.request({
        pagination: this.$store.state.auth0.pagination || this.serverPagination,
        filter: this.$store.state.auth0.filter || this.filter
      })
    }
  }
</script>

<style scoped>

</style>
