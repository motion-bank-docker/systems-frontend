<template lang="pug">
  q-modal(v-model="showModal", @show="onShow", @hide="onHide")
    .q-pa-xl.bg-dark(style="min-width: 50vw;")
      h5.caption(dark)
        span(v-if="!payload") Create timeline
        span(v-if="payload") Update timeline

      q-input.q-my-sm(float-label="Title", v-model="timeline.title", color="white", dark)
      q-input.q-my-sm(float-label="Description", v-model="timeline.description", color="white", dark)

      h5.q-mt-xl.q-mb-none.caption(v-if="true === false")
        | Inviting list
        q-icon.q-ml-md(name="help")
          q-tooltip.q-caption.bg-black.text-white
            | Every mail in this list will receive an invitation to this timeline.
            | After creating a new timeline you can manage the users in this timline, too.

      // user list
      q-list(no-border, v-if="true === false")
        q-item.q-my-sm.q-pa-sm(v-for="user in users", style="border: 1px solid #333;")
          q-item-side
            q-tooltip.bg-white.text-dark.q-caption Allow managing rights?
            q-checkbox(v-model="user.allowManagement", color="grey-9")
          q-item-main
            div.q-mb-xs {{ user.name }}
          q-item-side
            q-btn(icon="clear", round, no-caps)
              q-tooltip.bg-red.q-caption Remove from inviting list?

        q-item.q-mt-sm.q-px-lg.q-py-md(style="border: 1px solid #333;")
          q-item-main
            q-input.q-mb-md(v-model="user.name", float-label="Enter name", color="white", dark)
          q-item-side
            q-btn(@click="addUser", label="Add", color="primary", no-caps)

      .text-center
        q-btn.q-mx-xs.q-mt-xl.bg-green.text-white(@click="submit", label="Submit", no-caps)
</template>

<script>
  export default {
    props: ['show', 'uuid'],
    watch: {
      show () {
        this.showModal = this.show
      },
      payload () {
        const _this = this
        if (typeof this.uuid === 'string') {
          this.$store.dispatch('maps/get', this.uuid).then(map => {
            _this.map = map
          })
        }
        else {
          _this.map = {
            title: undefined,
            description: undefined,
            type: ['Timeline']
          }
        }
      }
    },
    data () {
      return {
        showModal: false,
        timeline: {},
        users: [],
        user: {
          name: undefined,
          uuid: undefined,
          allowManagement: undefined
        }
      }
    },
    methods: {
      submit () {
        return Promise.resolve().then(() => {
          if (this.map.uuid) {
            return this.$store.dispatch('maps/update', this.map)
          }
          else {
            return this.$store.dispatch('maps/create', this.map)
          }
        }).then(map => {
          this.$emit('submit', map)
          this.showModal = false
        })
      },
      onShow () {
        this.$emit('show')
      },
      onHide () {
        this.showModal = false
        this.$emit('hide')
      },
      addUser () {
        console.debug('add user to acl', this.user)
      }
    }
  }
</script>
