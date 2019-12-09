<template lang="pug">
  // btn: filter
  q-btn.fixed.text-white.filter-button(@click="openFilter = true",
    :class="{ 'bg-green': radioFilter == 'allsessions' || radioFilter == 'thissession' }") Filter

    // FILTER
    //
    q-popover.bg-transparent.moba-round-borders-filter.moba-border.shadow-8(v-model="openFilter", anchor="top left", self="top right", :offset="[10,0]")
      div.bg-dark.q-pa-md.q-caption(style="min-height: 100%;")
        .row.q-mb-md
          .col-10.q-pa-sm
            q-radio.q-mr-lg(v-model="radioFilter", val="thissession", label="Apply filter.", color="white")
            q-radio(v-model="radioFilter", val="none", label="Do not apply.", color="white")

        div(:class="{'text-grey-8': radioFilter == 'none'}")
          q-tabs(color="dark")
            q-tab(:class="{'bg-green': filterCreators.length > 0}", slot="title", name="creators") creators
              q-tooltip.bg-dark.shadow-8.moba-border(v-if="filterCreators.length > 0", anchor="bottom middle", self="top middle", :offset="[10, 0]")
                q-list.no-border.no-padding
                  q-item.q-caption.q-pa-xs.no-margin(v-for="creator in filterCreators") {{ creator }}

            q-tab(:class="{'bg-green': filterTags.length > 0}", slot="title", name="tags") tags
              q-tooltip.bg-dark.shadow-8.moba-border(v-if="filterTags.length > 0", anchor="bottom middle", self="top middle", :offset="[10, 0]")
                q-list.no-border.no-padding
                  q-item.q-caption.q-pa-xs.no-margin(v-for="tag in filterTags") {{ tag }}

            q-tab(:class="{'bg-green': filterTypes.length > 0}", slot="title", name="types") types
              q-tooltip.bg-dark.shadow-8.moba-border(v-if="filterTypes.length > 0", anchor="bottom middle", self="top middle", :offset="[10, 0]")
                q-list.no-border.no-padding
                  q-item.q-caption.q-pa-xs.no-margin(v-for="type in filterTypes") {{ type }}

            q-tab(slot="title", name="date") date
            q-tab(slot="title", name="search") search

            q-tab-pane(name="creators")
              q-btn-group.row.full-width
                q-btn.col-6 select all
                q-btn.col-6(@click="filterCreators = ['']") select none
              q-list.no-border
                q-item.no-padding(v-for="creator in creators")
                  q-checkbox.q-caption(v-model="filterCreators", :val="creator", :label="creator", color="white")

            q-tab-pane(name="tags")
              q-btn-group.row.full-width
                q-btn.col-6 select all
                q-btn.col-6(@click="filterTags = ['']") select none
              q-list.no-border
                q-checkbox.q-caption(v-model="filterTags", :val="tag", label="annotation tag", color="white")

            q-tab-pane(name="types")
              q-btn-group.row.full-width
                q-btn.col-6 select all
                q-btn.col-6(@click="filterTypes = ['']") select none
              q-list.no-border
                q-item.no-padding(v-for="type in annotationTypes")
                  q-checkbox.q-caption(v-model="filterTypes", :val="type", :label="type", color="white")

            q-tab-pane(name="date")
              q-range.q-mt-lg(v-model="rangeValues", :min="0", :max="10", :step="1", color="white", label, dark)

            q-tab-pane(name="search")
              q-search.bg-transparent.text-white(color="white", dark)
              q-btn.q-mt-sm.full-width search
</template>

<script>
  export default {
    data () {
      return {
        annotationTypes: [],
        filterAuthors: [],
        filterTags: [],
        filterTypes: [],
        openFilter: false,
        radioFilter: 'none',
        rangeValues: { max: 4, min: 2 }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .filter-button
    top: 66px
    right: 16px
    z-index: 1000
</style>
