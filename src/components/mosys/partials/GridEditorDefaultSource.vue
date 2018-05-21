<template lang="pug">

  q-list.default-source-container

    q-list-header
      q-item
        small Standard Cell Types

    q-item-separator

    template(v-for="(item, i) in items")

      template(v-if="i > 0")
        q-item-separator

      q-item(draggable="true", @dragstart="event => {handleItemDragStart(event, item)}")
        q-field(
          :icon="typeToIconName(item.type)", :helper="item.help", :error="item.error",
          :error-label="item.errorMessage", style="width: 100%")
          q-input(
            :float-label="item.label", :type="item.inputType",
            :min-rows="1", :max-height="500",
            :model="item.value", :value="item.value",
            @change="event => {handleItemChanged(event, item)}")

</template>

<script>
  // import url from 'url'
  // import superagent from 'superagent'
  // import buildVars from '../../../lib/build-vars'

  const typeToIconName = {
    'image': 'photo',
    'iframe': 'picture in picture',
    'internal-link': 'link',
    'video': 'local movies',
    'text': 'subject',
    'title': 'title'
  }

  export default {
    data () {
      return {
        items: [
          {
            inputType: 'text',
            type: 'Title',
            label: 'Title Cell',
            help: '',
            error: false,
            errorMessage: '',
            value: ''
          },
          {
            inputType: 'textarea',
            type: 'Text',
            label: 'Text Cell',
            help: '',
            error: false,
            errorMessage: '',
            value: ''
          },
          {
            inputType: 'url',
            type: 'Video',
            label: 'Video Cell',
            help: 'Insert a URL to: a video file or a Vimeo / YouTube video page',
            error: false,
            errorMessage: 'Needs to be a valid URL',
            value: ''
          },
          {
            inputType: 'url',
            type: 'Image',
            label: 'Image Cell',
            help: 'Insert a URL to an image file',
            error: false,
            errorMessage: 'Needs to be a valid URL',
            value: ''
          },
          {
            inputType: 'url',
            type: 'Internal-Link',
            label: 'Link Cell',
            help: 'Insert a URL to a page in this system',
            error: false,
            errorMessage: 'Needs to be a valid URL',
            value: ''
          },
          {
            inputType: 'url',
            type: 'IFrame',
            label: 'IFrame Cell',
            help: 'Insert some URL',
            error: false,
            errorMessage: 'Needs to be a valid URL',
            value: ''
          }
        ]
      }
    },
    methods: {
      typeToIconName (type) {
        let iconName = typeToIconName[type.toLowerCase()]
        if (!iconName) {
          iconName = 'broken image'
        }
        return iconName
      },
      handleItemDragStart (event, item) {
        let resourceCell = {
          uuid: null,
          type: item.type,
          x: 1,
          y: 1,
          width: 1,
          height: 1,
          content: item.value
        }
        event.dataTransfer.setData('text/plain', JSON.stringify(resourceCell))
      },
      handleItemChanged (value, item) {
        if (item.inputType !== 'url') {
          item.value = value
        }
        else {
          item.error = !(/^http[s]?:\/\/.+/.test(value))
          if (!item.error) {
            item.value = value
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus">

  .q-list-header
    padding-left 0

    .q-input
      padding-left 1em
      padding-right 1em

    .q-input:before
    .q-input:after
      display none

  .q-input
    padding-left 0

</style>
