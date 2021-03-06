<template lang="pug">
  div

    // ----------------------------------------------------------------------------------------------- select vocabulary

    q-list.ui-border-top(v-if="visible && !loading",
    :class="[{'ui-border-bottom': checkedTypes.length > 0}, checkedTypes.length > 0 && typesVisibility ? 'q-py-sm' : 'q-py-none']")

      // add-button
      q-item.q-pa-none

        q-item-main.q-pa-sm.moba-tag-hover-dark
          q-icon.q-mr-sm.q-ml-xs(name="add", size="sm", round, flat)
          | Select object type ({{ activeTypesModel.length }})
          q-popover
            q-list
              q-item.q-py-sm.q-pl-sm.q-pr-md.moba-tag-hover-dark(v-for="type in objectTypes")
                q-checkbox.full-width(v-model="checkedTypes", :val="type", :label="type.label",
                :key="type.value", checked-icon="check", unchecked-icon="xxxxxx",
                @input="handlerActivity(type)")

        q-item-side.moba-tag-hover-dark(style="margin-left: 0;")
          q-btn.bg-transparent(@click="handlerTypesVisibility()", flat, size="sm", no-ripple, style="height: 35px;")
            q-icon(name="keyboard_arrow_down", :class="{'rotate-180': typesVisibility}", size="20px")

      // selected vocabularies
      template(v-if="typesVisibility")
        template(v-if="checkedTypes.length > 0")

          q-item.q-pa-none.cursor-pointer(v-for="type in checkedTypes",
          tag="label")

            q-item-main.q-pa-sm.moba-tag-hover-dark.text-grey-7(style="height: 35px;")
              q-checkbox.q-mr-sm(v-model="activeTypesModel", :val="type", :key="type.value",
              size="sm", round, flat, checked-icon="remove_red_eye", unchecked-icon="none")
              span.ellipsis(label) {{ type.label }}

            q-item-side.moba-tag-hover-dark.buttons(style="margin-left: 0;")
              q-btn.bg-transparent(@click="handlerRemoveType(type)", flat, size="sm", no-ripple, style="height: 35px; width: 52px;")
                q-icon(name="clear", size="18px")

    // --------------------------------------------------------------------------------------- no selection notification

    .ui-border-top.text-grey-7.text-italic.q-px-md.q-py-sm(v-if="visible && !loading && checkedTypes <= 0")
      | No object type selected.

    // ------------------------------------------------------------------------------------------------- vocabulary list

    div(ref="tagList", v-if="visible", style="max-height: 50vh; overflow-y: scroll;")

      .q-my-md.q-px-sm(v-if="loading")
        q-spinner.q-mr-md.q-ml-xs(:size="25")
        span Loading types...

      // results
      q-list.q-py-sm(v-for="(type, i) in listTypes", v-if="filterValue",
      :key="type.value", :class="{'ui-border-bottom': i < listTypes.length - 1}")

        // vocabulary label
        q-item.q-py-xs(:class="{'q-mb-xs': objectList[type.value] && objectList[type.value].length > 0}")
          q-item-main.text-grey-7 {{ type.label }} ({{ objectList[type.value].length }})

        // vocabulary items
        q-item.moba-tag-hover.cursor-pointer.q-pa-none(v-if="objectList[type.value]",
          v-for="(item, index) in objectList[type.value]", :key="item.identifier")
          q-item-main
            div.q-px-md.q-py-xs(
              @click="selectEntry(item)",
              :class="{'bg-primary text-white': checkHighlight(item, i, index)}")
              | {{ item.label }}

              // preview image

              q-tooltip.q-pa-none.bg-dark.shadow-6(v-if="item.thumbnail", anchor="top right", self="top left", :offset="[10, 0]")
                img.tooltip-img(:src="item.thumbnail")
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { userHasFeature } from 'mbjs-quasar/src/lib'

  export default {
    props: {
      highlight: Object,
      media: Object,
      highlightIndex: Number
    },
    data () {
      return {
        visible: false,
        loading: false,

        objectList: {},
        listTypes: [],
        selectedTypeId: undefined,
        selectedTypeLabel: 'select a type',
        selectedType: undefined,
        filterValue: undefined,
        filterTimeout: undefined,

        checkedTypes: [],
        activeTypesModel: [], // checkbox model to be watched
        activeTypes: [], // type list to be rendered

        typesVisibility: false, // show/hide checked types list,
        allItems: [],
        objects: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        objectTypes: 'autosuggest/getTypes'
      })
    },
    watch: {
      listTypes () {
        this.allItems = []
        for (let type of this.activeTypesModel) {
          let items = this.filteredItems(this.objects, type)
          items.forEach(item => this.allItems.push(item))
        }
      },
      highlightIndex (val) {
        this.$emit('highlighted', this.allItems[val])
      },
      async filterValue () {
        if (this.filterTimeout) {
          clearTimeout(this.filterTimeout)
          this.filterTimeout = undefined
        }
        this.filterTimeout = setTimeout(async () => {
          if (!this.media) {
            console.warn('ObjectList: No media object')
            return
          }

          this.filterTimeout = undefined
          this.objects = await this.$store.dispatch('autosuggest/find',
            [this.media.body.source.id, this.filterValue])

          this.allItems = []

          const objectList = {}
          for (let type of this.activeTypesModel) {
            let items = this.filteredItems(this.objects, type)
            items.forEach(item => this.allItems.push(item))
            objectList[type.value] = items
          }
          this.$emit('itemsLength', this.allItems.length)
          this.objectList = objectList
          this.listTypes = this.activeTypesModel.filter(type => {
            return Array.isArray(this.objectList[type.value]) && this.objectList[type.value].length
          })
        }, 500)
      },
      objectTypes (val) {
        if (!this.checkedTypes.length && val.length) {
          this.checkedTypes = [].concat(val)
        }
      },
      activeTypesModel (val) {
        this.listTypes = val.filter(type => {
          return Array.isArray(this.objectList[type.value]) && this.objectList[type.value].length
        })
      }
    },
    async mounted () {
      this.loading = true
      await this.$store.dispatch('autosuggest/getFilters')
      if (this.objectTypes.length) {
        for (let type of this.objectTypes) {
          this.handlerActivity(type)
        }
      }
      this.filterValue = ''
      this.loading = false
    },
    methods: {
      checkHighlight (item) {
        if (isNaN(this.highlightIndex)) return
        return item.identifier === this.allItems[this.highlightIndex].identifier
      },
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
          return objects.filter(object => object.type === type.value)
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
      async selectEntry (entry, createImmediatly = true) {
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
      background-color: $grey-8

  .moba-tag-hover-dark
    &:hover
      background-color: $grey-10

  .q-item
    .buttons
      opacity 0
    &:hover
      .buttons
        opacity 1
  .q-tooltip
    .tooltip-img
      max-width 150px
      max-height 150px
      vertical-align bottom
</style>
