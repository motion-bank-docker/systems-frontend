<template lang="pug">

    .row

      .padding-1em
        tags(
          v-if="payload",
          :targetUuid="payload.uuid",
          fullWidth
          )

      .padding-1em
        form-main(
          v-model="payload",
          :schema="schema"
          )

      users-table(
        :columns="columns",
        :actions="actions",
        :headline="$t('routes.piecemaker.groups.users.title')",
        @action="onAction"
        )

</template>

<script>
  import FormMain from '../../shared/forms/FormMain'
  import { QBtn, QRadio, QToggle, QList, QItem, QListHeader, QDataTable } from 'quasar-framework'
  import { required } from 'vuelidate/lib/validators'
  import constants from '../../../lib/constants'
  import Tags from '../../shared/partials/Tags'
  import UsersTable from '../../shared/partials/UsersTable'

  export default {
    components: {
      FormMain,
      Tags,
      QBtn,
      QRadio,
      QToggle,
      QList,
      QItem,
      QListHeader,
      QDataTable,
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
          { type: 'edit', title: 'Settings', scope: 'timeline' },
          { type: 'delete', title: 'Remove' }
        ],
        type: constants.MAP_TYPE_TIMELINE,
        payload: this.$route.params.id ? context.$store.dispatch('maps/get', context.$route.params.id) : undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.group_title',
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
    }
  }
</script>

<style>
</style>
