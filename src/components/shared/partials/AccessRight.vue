<template lang="pug">
  div
    q-card.shadow-6
      q-card-title.text-grey-8 {{ $t('labels.access_control') }}
      q-card-separator
      q-card-main.no-padding
        q-list(v-if="groups.length", no-border)
          template(v-for="(group, index) in groups")
            q-item.row.q-px-md(:class="{'q-py-md': $q.screen.lt.lg}")
              q-item-main.ellipsis(:class="{'col-12': $q.screen.lt.lg}") {{ group.title }}
              q-item-side.no-margin(:class="{'col-10 q-pt-sm': $q.screen.lt.lg}")
                // span.q-mr-sm May:
                q-checkbox(v-for="(checkbox, i) in checkboxes", v-model="group.model", :val="checkbox.title",
                :class="{'q-mr-lg': i < checkboxes.length - 1, 'text-primary': group.model.includes(checkbox.title)}",
                :checked-icon="checkbox.icon", :unchecked-icon="checkbox.icon")
                  .q-pl-sm(v-if="$q.screen.gt.sm") {{ checkbox.title }}
              q-item-side.no-margin.text-right(:class="{'col-2 q-pt-sm': $q.screen.lt.lg}")
                q-btn(@click="", :class="{'q-ml-xl': $q.screen.gt.md}", round)
                  q-icon(name="delete")
            // q-item-separator.bg-grey-10(v-if="$q.screen.lt.lg")
            q-item-separator.bg-grey-9
        div(v-else) {{ $t('labels.empty') }}
      q-card-separator
      q-card-actions.q-pa-md
        q-btn(v-if="!showForm", @click="showForm = true", :label="$t('labels.add_group')", color="primary")
        form-main.full-width(v-if="showForm", v-model="payload", :schema="schema")

</template>

<script>
  import FormMain from '../../../components/shared/forms/FormMain'

  import { required } from 'vuelidate/lib/validators'

  export default {
    components: {
      FormMain
    },
    data () {
      const _this = this
      return {
        checked: [],
        checkboxes: [{
          title: this.$t('checkboxes.read'),
          icon: 'remove_red_eye'
        }, {
          title: this.$t('checkboxes.write'),
          icon: 'edit'
        }, {
          title: this.$t('checkboxes.delete'),
          icon: 'clear'
        }],
        groups: [{
          title: 'Hier steht ein Gruppentitel',
          model: []
        }, {
          title: 'Ein weiterer Titel',
          model: []
        }, {
          title: 'Klasse von Vorname Nachname',
          model: []
        }],
        payload: '',
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.new_group_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            label: _this.$t('labels.add_group'),
            handler () {
              _this.showForm = false
              return _this.groups.push({title: _this.payload.title, model: []})
            }
          }
        },
        showForm: false
      }
    },
    name: 'access-right'
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

</style>
