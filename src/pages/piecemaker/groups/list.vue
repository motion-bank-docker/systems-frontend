<template lang="pug">

  // card-full
  full-screen

    // modal: create timeline
    //
    q-modal(v-model="showModalAdd")
      .q-pa-xl.bg-dark(style="min-width: 50vw;")
        h5.caption.no-margin
          // q-icon(name="add")
          | Create timeline
        q-input.q-my-sm(float-label="Title", color="white", dark)
        q-input.q-my-sm(float-label="Description", color="white", dark)

        h5.q-mt-xl.q-mb-none.caption
          // q-icon(name="add")
          | Inviting list
          q-icon.q-ml-md(name="help")
            q-tooltip.q-caption.bg-black.text-white
              | Every mail in this list will receive an invitation to this timeline.
              | After creating a new timeline you can manage the users in this timline, too.

        // user list
        q-list(no-border)

          q-item.q-my-sm.q-pa-sm(
          v-for="(n, i) in createTimelineUsers",
          style="border: 1px solid #333;"
          )
            q-item-side
              q-tooltip.bg-white.text-dark.q-caption Allow managing rights?
              q-checkbox(v-model="n.createTimelineUsers", color="grey-9")
            q-item-main
              div.q-mb-xs() {{ n.mail }}
            q-item-side
              q-btn(
              icon="clear",
              round, no-caps
              )
                q-tooltip.bg-red.q-caption Remove from inviting list?

          q-item.q-mt-sm.q-px-lg.q-py-md(
          style="border: 1px solid #333;"
          )
            q-item-main
              q-input.q-mb-md(
              v-model="newUser.mail",
              float-label="Enter mail",
              color="white",
              dark
              )
            q-item-side
              q-btn(
              @click="onAction('add-user-create')",
              label="Add",
              color="primary",
              no-caps
              )

        .text-center
          q-btn.q-mx-xs.q-mt-xl.bg-green.text-white(
          @click="showModalAdd=false",
          label="Create Timeline",
          no-caps
          )

    //
    // modal: delete/leave timeline
    //
    q-modal(v-model="showModalDelete")
      .q-pa-lg.bg-red.text-white
        h6.no-margin.no-padding.text-center
          | Do you really want to
          br
          | delete/leave this timeline?
        .text-center.q-mt-lg
          q-btn.q-mx-sm(
          @click="showModalDelete=false",
          label="Yes",
          no-caps
          )
          q-btn.q-mx-sm(
          @click="showModalDelete=false",
          label="No",
          no-caps
          )

    //
    // modal: manage timeline information
    //
    q-modal(v-model="showModalEditInformation")
      .q-pa-xl.bg-dark(style="min-width: 50vw;")
        h5.caption.no-margin
          // q-icon(name="edit")
          | Timeline information

        // title
        .row.q-mt-md(v-model="watchTest")
          q-input.col-10(
          v-model="maps[0].title",
          float-label="Title",
          color="white",
          dark
          )
          .col-2.text-right
            q-btn.q-mt-md(
            :disable="disableBtn",
            label="Save",
            no-caps
            )

        // title
        .row.q-mt-md(v-model="watchTest")
          q-input.col-10(
          v-model="maps[0].desc",
          float-label="Description",
          color="white",
          dark
          )
          .col-2.text-right
            q-btn.q-mt-md(
            :disable="disableBtn",
            label="Save",
            no-caps
            )

        .text-center
          q-btn.q-mx-xs.q-mt-xl.bg-green.text-white(
          @click="showModalEditInformation=false",
          label="Done",
          no-caps
          )

    // modal: manage users
    //
    q-modal(v-model="showModalUsers")
      .q-pa-xl.bg-dark(style="min-width: 50vw;")

        // user list
        .row
          h5.col-6.caption.no-margin Users: {{ maps[0].users.length + 1 }}
          .col-6.no-margin.text-right
            q-btn-dropdown.no-padding.no-margin(
            :label="'Order by ' + orderBy",
            style="min-height: auto;",
            flat, dark, no-caps
            )
              div.q-px-md.q-py-sm.text-white.cursor-pointer.bg-dark Mail
              div.q-px-md.q-py-sm.text-white.cursor-pointer.bg-dark Status
              div.q-px-md.q-py-sm.text-white.cursor-pointer.bg-dark Managing rights

        q-list(no-border)
          q-item.q-my-sm.q-pa-md(
          style="border: 1px solid #333;"
          )
            | {{ user.name }} (Owner)

          q-item.q-my-sm.q-pa-sm(
          v-for="(n, i) in maps[0].users",
          style="border: 1px solid #333;"
          )
            q-item-side.text-center
              q-tooltip.bg-black.text-white.q-caption Allow managing rights?
              q-checkbox(v-model="n.managingrights", color="grey-9", dark)
            q-item-main
              div.q-mb-xs()
                span(v-if="i > 1")
                  q-icon.q-mr-sm.text-red(name="error")
                    q-tooltip.bg-black.q-caption Pending confirmation.
                | {{ n.mail }}
            q-item-side
              q-btn(
              icon="clear",
              round, no-caps
              )
                q-tooltip.bg-red.q-caption Remove from this timeline?

          q-item.q-mt-sm.q-px-lg.q-py-md(
          style="border: 1px solid #333;"
          )
            q-item-main
              q-input.q-mb-md(
              v-model="newUser.mail",
              float-label="Enter mail",
              color="white",
              dark
              )
            q-item-side
              q-btn(
              @click="onAction('add-user')",
              label="Invite",
              color="primary",
              no-caps
              )

        .text-center
          q-btn.q-mx-xs.q-mt-xl.bg-green.text-white(
          @click="showModalUsers=false",
          label="Done",
          no-caps
          )

    span(slot="form-logo")
    div(slot="form-title") {{ $t('routes.piecemaker.groups.list.title') }} you have access to, {{ user.name }}.
    // p.caption(slot="form-caption") {{ $t('routes.piecemaker.groups.list.caption') }}

    .row
      .col-10.offset-1
        p
          q-btn(
          @click="onAction('add')",
          no-caps
          )
            q-icon(name="add").q-mr-sm
            | {{ $t('buttons.create_group') }}

        // group-list
        // data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")
        q-table.no-shadow(
        @rowclick="onRowClick($event)",
        :dark="true",
        :data="maps",
        :config="conf",
        :columns="columns",
        :actions="actions",
        row-key="title"
        )

          // cell "title"
          //
          q-td.text-left(
          slot="body-cell-title",
          slot-scope="props",
          :props="props"
          )
            q-btn(
            @click="$router.push('groups/show')",
            no-caps, flat
            ) {{ props.row.title }}

          // cell "users"
          //
          q-td(
            slot="body-cell-users",
            slot-scope="props",
            :props="props"
            )
            q-btn(@click="showModalUsers = true")
              | {{ props.row.users.length }}

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
            flat, no-caps
            )
              q-icon.q-mr-sm(:name="a.icon")
              | {{ $t(a.title) }}

</template>

<script>
  // import CardFull from '../../../components/shared/layouts/CardFull'
  import Vuex from 'vuex'
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import GroupList from '../../../components/piecemaker/partials/GroupsList'
  import DataTable from '../../../components/shared/partials/DataTable'
  import { QModal, QTr, QTd, QList, QItem, QItemMain, QItemSide, QItemTile, QBtnDropdown, QTooltip } from 'quasar'
  export default {
    components: {
      // CardFull,
      FullScreen,
      GroupList,
      DataTable,
      QModal,
      QTr,
      QTd,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemTile,
      QBtnDropdown,
      QTooltip
    },
    computed: {
      /* vuexTest: function () {
        return this.$store.state += 10
      } */
    },
    methods: {
      onAction (type) {
        // alert(type)
        // const _this = this
        switch (type) {
        case 'add':
          // alert(this.store.state.count)
          this.showModalAdd = true
          return
        case 'delete':
          this.showModalDelete = true
          return
        case 'edit':
          this.showModalEditInformation = true
          return
        case 'add-user':
          this.maps[0].users.push(this.newUser)
          this.newUser = {
            mail: '',
            name: ''
          }
          return
        case 'add-user-create':
          this.createTimelineUsers.push(this.newUser)
          this.newUser = {
            mail: '',
            name: ''
          }
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
    mounted () {
      const _this = this
      this.$auth.on('auth-state', user => {
        _this.user = user
        console.debug('Auth0 state change', _this.$auth.hasScope('openid'))
      })
      this.$auth.checkSession()
    },
    data () {
      const _this = this
      const store = new Vuex.Store({
        state: {
          count: 300
        }
      })
      return {
        store: store,
        createTimelineUsers: [],
        disableBtn: true,
        newUser: [{
          name: '',
          mail: '',
          managingrights: ''
        }],
        orderBy: 'mail',
        showModalAdd: false,
        showModalDelete: false,
        showModalEditInformation: false,
        showModalUsers: false,
        user: undefined,
        userType: 'admin',
        maps: [{
          author: 'ch',
          created: '1.1.1970',
          desc: 'hier können notizen stehen',
          managingrights: true,
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
          managingrights: false,
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
          { type: 'edit', title: 'buttons.edit', icon: 'edit' },
          { type: 'delete', title: 'buttons.delete', icon: 'delete' }
        ]
      }
    }
  }
</script>

<style scoped>
</style>
