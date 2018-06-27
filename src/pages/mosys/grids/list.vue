<template lang="pug">
  card-full

    // modal: create grid
    //
    q-modal(v-model="showModalAdd")
      .q-pa-xl.bg-dark(style="min-width: 50vw;")
        h5.caption.no-margin
          | Create grid
        q-input.q-my-sm(float-label="Title", color="white", dark)
        q-input.q-my-sm(float-label="Description", color="white", dark)

        h5.q-mt-xl.q-mb-none.caption
          | Inviting list
          q-icon.q-ml-md(name="help")
            q-tooltip.q-caption.bg-black.text-white
              | Every mail in this list will receive an invitation to this grid.
              | After creating a new grid you can manage the users in this grid, too.

        // user list
        //
        q-list(no-border)

          q-item.q-my-sm.q-pa-sm(
          v-for="(n, i) in 2",
          style="border: 1px solid #333;"
          )
            q-item-side
              q-tooltip.bg-white.text-dark.q-caption Allow managing rights?
              // q-checkbox(v-model="n.createGridUsers", color="grey-9")
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

    span(slot="form-logo")
    span(slot="form-title") {{ $t('routes.mosys.grids.list.title') }}
    // p.caption(slot="form-caption") {{ $t('routes.mosys.grids.list.caption') }}
    p
      q-btn(@click="showModalAdd = true", color="primary") {{ $t('routes.mosys.grids.create.button') }}
    data-table(:entries="maps", :columns="columns", :actions="actions", @action="onAction")
</template>

<script>
  import DataTable from '../../../components/shared/partials/DataTable'
  // import CenterCardFull from '../../../components/shared/layouts/CenterCardFull'
  import CardFull from '../../../components/shared/layouts/CardFull'
  import constants from '../../../lib/constants'
  import { QModal, QInput, QIcon, QTooltip } from 'quasar'

  export default {
    components: {
      DataTable,
      // CenterCardFull
      CardFull,
      QModal,
      QInput,
      QIcon,
      QTooltip
    },
    methods: {
      onAction (type, data) {
        const _this = this
        switch (type) {
        case 'show':
          return _this.$router.push(`/mosys/grids/${data.row.uuid}`)
        case 'edit':
          return _this.$router.push(`/mosys/grids/${data.row.uuid}/edit`)
        case 'add-user':
          this.maps[0].users.push(this.newUser)
          this.newUser = {
            mail: '',
            name: ''
          }
          return
        case 'delete':
          _this.$store.dispatch('maps/remove', data.row.uuid).then(() => { _this.maps = _this.getGrids() })
        }
      },
      getGrids () {
        return this.$store.dispatch('maps/find', { query: { type: constants.MAP_TYPE_2D_GRID } })
      }
    },
    data () {
      const _this = this
      return {
        createGridUsers: [],
        showModalAdd: false,
        // maps: _this.getGrids(),
        maps: [],
        newUser: [{
          name: '',
          mail: '',
          managingrights: ''
        }],
        columns: [
          {
            label: _this.$t('labels.title'),
            field: 'title'
          },
          {
            label: _this.$t('labels.created'),
            field: 'created'
          },
          {
            label: _this.$t('labels.users'),
            field: 'users'
          }
        ],
        actions: [
          { type: 'show', title: 'routes.mosys.grids.buttons.show' },
          { type: 'annotate', title: 'routes.mosys.grids.buttons.annotate' },
          { type: 'edit', title: 'routes.mosys.grids.buttons.edit' },
          { type: 'delete', title: 'buttons.delete' }
        ]
      }
    }
  }
</script>
