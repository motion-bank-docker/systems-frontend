<template lang="pug">

  .row.tags-wrap
    q-checkbox.col-2(v-for="tag in tags" v-model="checked" :label="tag.title" :key="tag.title")
    .col-12.text-right
      slot(name="tagging-buttons")
    // form-main(v-model="payload", :schema="schema")
      span(slot="form-buttons")

    // q-btn(slot="form-buttons-add", @click="cancel") {{ $t('buttons.cancel') }}


  // center-card-full
    div(slot="form-logo")
    div(slot="form-title")
      h4 Tags

    .row
      q-checkbox.col-2(v-for="tag in tags" v-model="checked" :label="tag.title" :key="tag.title")

    form-main(v-model="payload", :schema="schema")
      q-btn(slot="form-buttons-add", @click="cancel") {{ $t('buttons.cancel') }}


    .row
      div.col-12.text-right
        q-btn() Generate grid from selected tags

</template>

<script>
  import FormMain from '../../../shared/forms/FormMain'
  import { QBtn, QCheckbox, QList, QListHeader, QItem } from 'quasar-framework'
  import { required } from 'vuelidate/lib/validators'
  import constants from '../../../../lib/constants'
  import CenterCardFull from '../../../shared/layouts/CenterCardFull'
  export default {
    components: {
      FormMain,
      QBtn,
      QCheckbox,
      QList,
      QListHeader,
      QItem,
      CenterCardFull
    },
    props: ['redirectTo'],
    data () {
      const context = this
      return {
        tags: [
          { title: 'achilles' },
          { title: 'ankle' },
          { title: 'calf' },
          { title: 'core' },
          { title: 'hamstring' },
          { title: 'hip' },
          { title: 'hip stability' },
          { title: 'knee' },
          { title: 'lower back' },
          { title: 'shinsplint' },
          { title: 'stability of the leg' },
          { title: 'trunk' }
        ],
        payload: this.$route.params.id ? context.$store.dispatch('maps/get', context.$route.params.id) : undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.new_tag',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              context.payload.owner = context.$store.state.auth.payload.userId
              context.payload.type = [constants.MAP_TYPE_TIMELINE]
              context.$store.dispatch(context.payload.uuid ? 'maps/patch' : 'maps/create', context.payload)
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

<style scoped>
  .tags-wrap {
    padding: 1em;
    margin: 1em 0;
    background-color: #111;
  }
</style>
