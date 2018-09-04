<template lang="pug">
  div
    q-card.shadow-6(v-if="env.IS_STAGING && resource")
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
      //q-card-separator
      <!--q-card-actions(:class="[!showForm ? 'q-pa-md' : 'q-px-md q-pb-md q-pt-none']")-->
        <!--q-btn(v-if="!showForm", @click="showForm = true", :label="$t('labels.add_group')", color="primary")-->
        <!--form-main.full-width(v-if="showForm", v-model="payload", :schema="schema")-->
          <!--q-btn(slot="form-buttons-add", :label="$t('buttons.cancel')", @click="showForm = false, payloard = ''")-->

</template>

<script>
  import FormMain from '../../../components/shared/forms/FormMain'
  import { ObjectUtil } from 'mbjs-utils'

  export default {
    components: {
      FormMain
    },
    props: [
      'resource'
    ],
    async mounted () {
      await this.loadACL()
    },
    watch: {
      async resource () {
        await this.loadACL()
      }
    },
    data () {
      return {
        acl: {},
        env: process.env,
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
        }]
        // payload: '',
        // schema: {
        //   fields: {
        //     title: {
        //       fullWidth: true,
        //       type: 'text',
        //       label: 'labels.new_group_title',
        //       errorLabel: 'errors.field_required',
        //       validators: {
        //         required
        //       }
        //     }
        //   },
        //   submit: {
        //     label: _this.$t('labels.add_group'),
        //     handler () {
        //       _this.showForm = false
        //       return _this.groups.push({title: _this.payload.title, model: []})
        //     }
        //   }
        // },
        // showForm: false
      }
    },
    methods: {
      async loadACL () {
        if (!this.resource) return

        const aclQuery = {role: 'public', id: this.resource.id, permission: 'get'}
        const permissions = await this.$store.dispatch('acl/isRoleAllowed', aclQuery)
        this.acl.public = permissions.get === true
      },
      async setACL (action, payload, recursive = false) {
        await this.$store.dispatch(action, payload)
        if (recursive) {
          const results = await this.$store.dispatch('annotations/find', { 'target.id': payload.id })
          for (let item of results.items) {
            const itemPayload = ObjectUtil.merge({}, payload)
            itemPayload.uuid = item.uuid
            await this.$store.dispatch(action, payload)
          }
        }
      },
      async updateACL () {
        console.debug('setting acl...', this.acl)
        if (this.acl.public) {
          await this.setACL('acl/set', { role: 'public', id: this.timeline.id, permissions: ['get'] }, this.acl.recursive)
        }
        else {
          await this.setACL('acl/remove', { role: 'public', id: this.timeline.id, permission: 'get' }, this.acl.recursive)
        }
        if (this.acl.group) {
          await this.setACL('acl/set', { role: this.acl.group, id: this.timeline.id, permissions: ['get'] }, this.acl.recursive)
        }
        if (this.acl.group_remove) {
          await this.setACL('acl/remove', { role: this.acl.group_remove, id: this.timeline.id, permission: 'get' }, this.acl.recursive)
        }
        this.$store.commit('notifications/addMessage', {
          body: 'messages.acl_updated',
          type: 'success'
        })
      }
    }
  }
</script>
