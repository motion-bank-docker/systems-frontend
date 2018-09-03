<template lang="pug">
  q-card.q-pa-sm
    q-list(no-border)
      q-item(v-for="group in groups")
        q-item-main {{ group.title }}
        q-item-side
          q-checkbox(v-for="(checkbox, i) in checkboxes", v-model="group.model", :val="checkbox.title",
          :class="{'q-mr-lg': i < checkboxes.length - 1, 'text-primary': group.model.includes(checkbox.title)}",
          :label="checkbox.title", :checked-icon="checkbox.icon", :unchecked-icon="checkbox.icon")
      q-item
        q-btn(@click="", :label="$t('buttons.add_group')", color="primary")
</template>

<script>
  export default {
    data () {
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
          title: 'gruppe 1',
          model: []
        }, {
          title: 'gr. 2',
          model: []
        }, {
          title: 'group 3333333',
          model: []
        }]
      }
    },
    name: 'access-right'
  }
</script>

<style scoped>
</style>
