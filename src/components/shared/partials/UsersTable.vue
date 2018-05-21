<template lang="pug">

  div.shadow-10(style="padding: 1rem;")

    q-modal(v-model="openModal")
      div.bg-black(style="padding: 1rem 2rem;")
        h5.no-margin.no-padding Send an invitation

        form-main(
          :schema="schemaMail"
          )

        .text-center
          q-btn(@click="openModal = false") Abort

    div
      h5.light-paragraph
        | {{ headl }}
        span.float-right
          q-btn(@click="openModal = true") Add user

      q-data-table(
        @rowclick="onRowClick($event)",
        :dark="true",
        :data="users",
        :config="conf",
        :columns="cols",
        :actions="actns"
        )

        template(slot="col-name", slot-scope="cell")
          template(v-for="c in cell")
            // span(v-if="c.status") {{ c.name }}
            | {{ c.name }}

        template.text-center(slot="col-confirmed", slot-scope="cell")
          div.text-center(v-if="cell.data")
            q-icon(name="done")

        template(slot="col-action", slot-scope="cell")
          q-btn(
            flat,
            small,
            v-for="a in actions",
            :color="a.color || 'neutral'",
            :key="a.type",
            @click="action(a.type, cell, a.scope)"
            ) {{ $t(a.title) }}

</template>

<script>
  import FormMain from '../forms/FormMain'
  import Username from './Username'
  import { DateTime } from 'luxon'
  import constants from '../../../lib/constants'
  import { required } from 'vuelidate/lib/validators'

  export default {
    components: {
      Username,
      FormMain
    },
    // props: ['entries', 'config', 'columns', 'actions'],
    props: ['columns', 'actions', 'headline'],
    data () {
      const _this = this
      const defaultConfig = {
        rowHeight: '50px',
        noHeader: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        bodyStyle: {
        },
        messages: {
          noData: _this.$t('table.no_data'),
          noDataAfterFiltering: _this.$t('table.no_data_in_filter')
        }
      }
      const cols = this.columns.map(column => {
        return Object.assign({
          filter: false,
          sort: false
        }, column)
      })
      cols.push({
        field: 'action',
        classes: 'text-right'
      })
      const context = this
      return {
        openModal: false,
        rows: [],
        conf: Object.assign(defaultConfig, _this.config),
        cols: cols,
        headl: _this.headline,
        actns: _this.actions,
        users: [{
          name: 'Christian Hansen',
          mail: 'ch@motionbank.org',
          confirmed: true
        }, {
          name: 'Marlon Brando',
          mail: 'info@motionbank.org',
          confirmed: true
        }, {
          name: 'Johnny Cash',
          mail: 'jc@motionbank.org',
          confirmed: false
        }, {
          name: 'Donald Duck',
          mail: 'dd@motionbank.org',
          confirmed: true
        }],
        schemaMail: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'Enter mail address',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              context.payload.author = context.$store.state.auth.payload.userId
              if (!context.$route.params.id) {
                context.payload.type = [constants.MAP_TYPE_TIMELINE]
              }
              return Promise.resolve()
                .then(() => {
                  if (context.payload.uuid) {
                    return context.$store.dispatch('maps/patch', [context.payload.uuid, context.payload])
                  }
                  return context.$store.dispatch('maps/create', context.payload)
                })
                .then(() => {
                  if (context.redirectTo) {
                    context.$router.push(context.redirectTo)
                  }
                })
            }
          }
        }
      }
    },
    methods: {
      onRowClick (target) {
        this.$emit('row-click', target)
      },
      action (type, target, scope) {
        // this.$emit('action', type, target)
        const _this = this
        // const hl = this.headline
        switch (type) {
        case 'edit':
            // return _this.$router.push({ name: 'piecemaker.groups.user' })
          if (scope === 'grid') {
            return _this.$router.push({ name: 'mosys.grids.user' })
          }
          else if (scope === 'timeline') {
            return _this.$router.push({ name: 'piecemaker.groups.user' })
          }
        }
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

<style>
  .inactive {
    opacity: .5!important;
    background-color: red;
    }
</style>
