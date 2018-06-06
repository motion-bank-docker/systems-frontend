<template lang="pug">

  card-full

    q-modal(v-model="showModalAdd")
      .q-pa-xl.bg-grey-9
        div add timeline
        q-input.bg-white(label="title") title
        q-input.bg-white(label="title") user 1
        q-btn(
          @click="showModalAdd=false",
          label="ok/add"
          )
        q-btn(
          @click="showModalAdd=false",
          label="close"
          )

    q-modal(v-model="showModalDelete")
      .q-pa-xl.bg-grey-9
        div delete/leave timeline
        div Are you sure?
        q-btn(
          @click="showModalDelete=false",
          label="leave/delete"
          )
        q-btn(
          @click="showModalDelete=false",
          label="cancel"
          )

    q-modal(v-model="showModalEdit")
      .q-pa-lg.bg-grey-9
        div Manage timeline

        div.q-mt-md(v-model="watchTest")
          q-input(
            v-model="maps[0].title",
            label="Title",
            dark
            )
          q-btn(
            :disable="disableBtn",
            label="Save changes"
            )
        div.q-mt-md
          q-list(no-border)
            q-item.no-padding(
              v-for="(n, i) in maps[0].users"
              )
              q-item-main
                q-item-tile(:class="{ mobainactive : i > 1 }") {{ n.mail }}
                q-item-tile
                  q-radio read only
                  q-radio edit
              q-item-side(v-if="i > 0")
                q-btn(
                  icon="clear",
                  size="xs",
                  round
                  )

        div
          q-input(
            v-model="newUser.mail",
            float-label="Enter mail",
            color="white",
            dark
            )
          q-btn(
            @click="onAction('add-user')",
            label="add"
            )
        // div.q-mt-md
          q-btn.q-mx-xs(
            @click="showModalEdit=false",
            label="Save Changes"
            )
          q-btn.q-mx-xs(
            @click="showModalEdit=false",
            label="cancel"
            )

    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.piecemaker.groups.list.title') }}
    // p.caption(slot="form-caption") {{ $t('routes.piecemaker.groups.list.caption') }}

    p
      q-btn(
        @click="onAction('add')",
        color="primary"
        ) {{ $t('buttons.create_group') }}

    // group-list
    // data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")
    q-table(
      @rowclick="onRowClick($event)",
      :dark="true",
      :data="maps",
      :config="conf",
      :columns="columns",
      :actions="actions",
      row-key="title"
      )

      //
      // cell "title"
      //
      q-td.text-left(
        slot="body-cell-title",
        slot-scope="props",
        :props="props"
        )
        q-btn(
          @click="$router.push('videos/session')",
          flat, small
          )
          q-icon.flip-horizontal.q-mr-sm(name="keyboard_backspace")
          | {{ props.row.title }}

      //
      // cell "users"
      //
      q-td(
        slot="body-cell-users",
        slot-scope="props",
        :props="props"
        )
        | {{ props.row.users.length }}

      //
      // cell "actions"
      //
      q-td(
        slot="body-cell-actions",
        slot-scope="props",
        :props="props"
        )
        q-btn(
          @click="onAction(a.type)",
          v-for="a in actions",
          :color="a.color || 'neutral'",
          :key="a.type",
          flat, small
          ) {{ $t(a.title) }}

</template>

<script>
  import CardFull from '../../../components/shared/layouts/CardFull'
  import GroupList from '../../../components/piecemaker/partials/GroupsList'
  import DataTable from '../../../components/shared/partials/DataTable'
  import { QModal, QTr, QTd, QList, QItem, QItemMain, QItemSide, QItemTile } from 'quasar'
  export default {
    components: {
      CardFull,
      GroupList,
      DataTable,
      QModal,
      QTr,
      QTd,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemTile
    },
    methods: {
      onAction (type) {
        // alert(type)
        // const _this = this
        switch (type) {
        case 'add':
          this.showModalAdd = true
          return
        case 'delete':
          this.showModalDelete = true
          return
        case 'edit':
          this.showModalEdit = true
          return
        case 'add-user':
          this.maps[0].users.push(this.newUser)
          this.newUser = {
            mail: '',
            name: ''
          }
          // console.log('bla')
        /* case 'live-annotate':
          return _this.$router.push({ name: 'piecemaker.groups.annotate', params: { id: data.row.uuid } })
        case 'videos':
          return _this.$router.push({ name: 'piecemaker.videos.list', params: { groupId: data.row.uuid } })
        case 'edit':
          return _this.$router.push({ name: 'piecemaker.groups.edit', params: { id: data.row.uuid } })
        case 'delete':
          _this.$store.dispatch('maps/remove', data.row.uuid)
            .then(() => { _this.maps = _this.$store.dispatch('maps/find') }) */
        }
      }
    },
    watch: {
      watchTest: function () {
        alert('bla')
      }
    },
    data () {
      const _this = this
      return {
        disableBtn: true,
        newUser: [{
          name: '',
          mail: ''
        }],
        showModalAdd: false,
        showModalDelete: false,
        showModalEdit: false,
        userType: 'admin',
        maps: [{
          author: 'ch',
          created: '1.1.1970',
          desc: 'hier können notizen stehen',
          title: 'aaaaaaa',
          updated: '4.6.2018',
          users: [{
            name: 'ch',
            mail: 'abc@gmx.de'
          }, {
            name: 'xx',
            mail: 'hallo@test.de'
          }]
        }, {
          author: 'ch',
          created: '1.1.1970',
          desc: 'notizen notizen notizen',
          title: 'bbbb',
          updated: '4.6.2018',
          users: [{
            name: 'ch',
            mail: 'abc@gmx.de'
          }, {
            name: 'aaaaaaaaaaa aaaaaa',
            mail: 'aaaaaa@test.de'
          }, {
            name: 'bbb bbb',
            mail: 'testmail@google.com'
          }]
        }],
        columns: [
          {
            name: 'title',
            field: 'title',
            label: _this.$t('labels.title'),
            type: 'string',
            sort: true,
            filter: true
          },
          {
            name: 'created',
            field: 'created',
            label: _this.$t('labels.created'),
            type: 'date',
            sort: true
          },
          {
            name: 'updated',
            field: 'updated',
            label: _this.$t('labels.updated'),
            type: 'date',
            sort: true
          },
          {
            name: 'users',
            field: 'users',
            label: _this.$t('labels.users'),
            type: 'number',
            sort: true
          },
          {
            name: 'author',
            field: 'author',
            label: _this.$t('labels.author')
          }, {
            label: '',
            name: 'actions',
            field: 'action',
            classes: 'bg-dark text-right'
          }
        ],
        actions: [
          // { type: 'live-annotate', title: 'buttons.live_annotate', color: 'primary' },
          // { type: 'videos', title: 'buttons.videos', color: 'primary' },
          { type: 'edit', title: 'buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
        ]
      }
    }
  }
</script>

<style scoped>
  .mobainactive {
    opacity: .4;
    color: red;
    }
</style>
