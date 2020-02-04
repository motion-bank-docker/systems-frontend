<template lang="pug">
  div

    // ----------------------------------------------------------------------------------------------- select vocabulary

    q-list.q-py-none.ui-border-top(v-if="visible && !loading",
    :class="{'q-pb-sm': checkedTypes.length > 0 && typesVisibility, 'ui-border-bottom': checkedTypes.length > 0}")

      // add-button
      q-item.q-pr-sm.q-py-xs.moba-tag-hover-dark

        q-item-main
          q-icon.q-mr-md(name="add", size="sm", round, flat)
          | Select object type
          q-popover
            q-list
              q-item.q-py-sm.q-px-xs.moba-tag-hover-dark(v-for="type in objectTypes")
                q-checkbox.full-width(v-model="checkedTypes", :val="type", :label="type.label",
                :key="type.id", checked-icon="check", unchecked-icon="xxxxxx",
                @input="handlerActivity(type)")

        q-item-side.text-right
          q-btn(@click="handlerTypesVisibility()", :class="{'rotate-180': typesVisibility}",
          icon="keyboard_arrow_down", size="sm", flat, round)

      // selected vocabularies
      template(v-if="typesVisibility")
        template(v-if="checkedTypes.length > 0")

          q-item.q-pl-md.q-pr-sm.q-py-none.moba-tag-hover-dark.cursor-pointer(v-for="type in checkedTypes",
          tag="label")

            q-item-side(style="min-width: auto;")
              q-checkbox(v-model="activeTypesModel", :val="type", :key="type.id",
              size="sm", round, flat, checked-icon="remove_red_eye", unchecked-icon="none")

            q-item-main.text-grey-7
              q-item-tile.ellipsis(label) {{ type.label }}

            q-item-side.text-right.buttons
              q-btn(@click="handlerRemoveType(type)", icon="clear", size="sm", round, flat)

    // --------------------------------------------------------------------------------------- no selection notification

    .ui-border-top.text-grey-7.text-italic.q-px-md.q-py-sm(v-if="visible && !loading && checkedTypes <= 0")
      | No object type selected.

    // ------------------------------------------------------------------------------------------------- vocabulary list

    div(ref="tagList", v-if="visible", style="max-height: 50vh; overflow-y: scroll;")

      .q-my-md.q-px-sm(v-if="loading")
        q-spinner.q-mr-md.q-ml-xs(:size="25")
        span Loading types...

      // results
      q-list.q-py-sm(v-for="(type, i) in listTypes",
      :key="type.id", :class="{'ui-border-bottom': i < listTypes.length - 1}")

        // vocabulary label
        q-item.q-py-xs(:class="{'q-mb-xs': objectList[type] && objectList[type].length > 0}")
          q-item-main.text-grey-7 {{ type.label }} ({{ objectList[type].length }})

        // vocabulary items
        q-item.moba-tag-hover.cursor-pointer.q-pa-none(v-if="objectList[type]", v-for="item in objectList[type]", :key="item.identifier")
          q-item-main
            div.q-px-md.q-py-xs(@click="selectEntry(item)") {{ item.label }}
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { userHasFeature } from 'mbjs-quasar/src/lib'

  export default {
    props: {
      highlight: Object,
      media: Object
    },
    data () {
      return {
        visible: false,
        loading: false,

        objectList: {},
        selectedTypeId: undefined,
        selectedTypeLabel: 'select a type',
        selectedType: undefined,
        filterValue: undefined,
        filterTimeout: undefined,

        checkedTypes: [],
        activeTypesModel: [], // checkbox model to be watched
        activeTypes: [], // type list to be rendered

        typesVisibility: true // show/hide checked types list
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        objectTypes: 'autosuggest/getTypes'
      }),
      listTypes () {
        return Object.keys(this.objectList).filter(type => Array.isArray(this.objectList[type]) && this.objectList[type].length)
      }
    },
    watch: {
      async filterValue () {
        if (this.filterTimeout) {
          clearTimeout(this.filterTimeout)
          this.filterTimeout = undefined
        }
        this.filterTimeout = setTimeout(async () => {
          this.filterTimeout = undefined
          const objects = await this.$store.dispatch('autosuggest/find',
            [this.media.body.source.id, this.filterValue])
          console.log('objects', objects)
          const objectList = {}
          for (let type of this.activeTypesModel) {
            objectList[type.id] = this.filteredItems(objects, type)
            console.log('filter', type, objectList[type.id])
          }
          this.objectList = objectList
          console.debug('filterValue', this.objectList)
        }, 500)
      },
      objectTypes (val) {
        if (!this.checkedTypes.length && val.length) {
          this.checkedTypes.push(val[0])
        }
      }
    },
    async mounted () {
      this.loading = true
      if (this.objectTypes.length) this.selectObjectType(this.objectTypes[0])
      this.loading = false
    },
    methods: {
      handlerActivity (type) {
        console.debug('handlerActivity', type, this.checkedTypes, this.activeTypesModel)
        if (!this.activeTypesModel.includes(type)) {
          this.activeTypesModel.push(type)
          this.checkedTypes.sort((a, b) => (a.label - b.label) ? 1 : -1)
        }
        else this.handlerRemoveType(type)
      },
      handlerTypesVisibility () {
        this.typesVisibility = !this.typesVisibility
      },
      handlerRemoveType (vocab) {
        this.checkedTypes = this.checkedTypes.filter(item => item !== vocab)

        let _activeTypesModel = this.activeTypesModel
        let _activeTypes = this.activeTypes

        let index = _activeTypesModel.indexOf(vocab)
        if (index > -1) _activeTypesModel.splice(index, 1)

        let indexActive = _activeTypes.indexOf(vocab)
        if (indexActive > -1) _activeTypes.splice(indexActive, 1)
      },
      filteredItems (objects, type) {
        if (type && objects) {
          return objects.filter(object => object.type === type.id)
        }
        return []
      },
      toggle () {
        this.visible = !this.visible
      },
      async selectObjectType (v) {
        this.selectedTypeLabel = v.label
        this.selectedTypeId = v.type
      },
      async addEntry () {
        if (this.selectedVocabulary) {
          // await this.selectedVocabulary.addTerm(value)
        }
      },
      async selectEntry (entry, createImmediatly = false) {
        this.$emit('select-entry', entry, createImmediatly)
      },
      updateFilter (value) {
        if (value && !value.length) {
          this.filterValue = undefined
        }
        else this.filterValue = value ? value.trim().toLocaleLowerCase() : undefined
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .q-item
    min-height auto

  .moba-tag-hover
    &:hover
      background-color: $grey-9

  .moba-tag-hover-dark
    &:hover
      background-color: $grey-10

  .q-item
    .buttons
      opacity 0
    &:hover
      .buttons
        opacity 1
</style>
