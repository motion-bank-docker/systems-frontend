<template lang="pug">

  // card-full
    span(slot="form-logo")
    h4 Edit Grid
  // div
  .row

    .padding-1em
      tags(
        v-if="payload",
        :targetUuid="payload.uuid",
        fullWidth
        )

    .padding-1em.full-width
      form-main(
        v-model="payload",
        :schema="schema"
        )

    .full-width.q-mt-lg(style="border: 1px solid #333;")
      users-table(
        :headline="$t('routes.mosys.grids.users.title')",
        :entries="users",
        :columns="columns",
        :actions="actions",
        @action="onAction"
        )

</template>

<script>
  import FormMain from '../../shared/forms/FormMain'
  import { required } from 'vuelidate/lib/validators'
  import constants from '../../../lib/constants'
  import Tags from '../../shared/partials/Tags'
  import CardFull from '../../shared/layouts/CardFull'
  import UsersTable from '../../shared/partials/UsersTable'

  export default {
    components: {
      FormMain,
      Tags,
      CardFull,
      UsersTable
    },
    props: ['redirectTo'],
    data () {
      const context = this
      return {
        columns: [
          {
            label: 'Name',
            field: 'name',
            type: 'string',
            sort: true
          }
        ],
        actions: [
          { type: 'edit', title: 'Settings', scope: 'grid' },
          { type: 'delete', title: 'Remove' }
        ],
        payload: this.$route.params.id ? context.$store.dispatch('maps/get', context.$route.params.id) : undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'routes.mosys.grids.edit.title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              context.payload.owner = context.$store.state.auth.payload.userId
              if (!context.$route.params.id) {
                context.payload.type = [constants.MAP_TYPE_2D_GRID]
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
    }
  }
</script>
