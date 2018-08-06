<template lang="pug">

  q-list
    template(v-for="(cell, index) in cells")

      q-list-header
        q-item
          small Cell Content Editor

      q-item-separator

      template(v-if="index > 0")
        q-item-separator

      q-item
        q-field(
          :icon="typeToIconName[cell.type]",
          :helper="itemSpecs[cell.type].help",
          :error="itemSpecs[cell.type].error",
          :error-label="itemSpecs[cell.type].errorMessage",
          style="width: 100%")
            q-input(
              :float-label="itemSpecs[cell.type].label",
              :type="itemSpecs[cell.type].inputType",
              :min-rows="1",
              :max-height="500",
              :value="cell.content",
              @change="value => {handleItemChanged(value, cell)}")

</template>

<script>
  export default {
    props: ['cells'],
    data () {
      return {
        typeToIconName: {
          'Image': 'photo',
          'IFrame': 'picture in picture',
          'Internal-Link': 'link',
          'Video': 'local movies',
          'Text': 'subject',
          'Title': 'title'
        },
        itemSpecs: {
          'Title': {
            inputType: 'text',
            type: 'Title',
            label: 'Title Cell',
            help: '',
            error: false,
            errorMessage: '',
            value: ''
          },
          'Text': {
            inputType: 'textarea',
            type: 'Text',
            label: 'Text Cell',
            help: '',
            error: false,
            errorMessage: '',
            value: ''
          },
          'Video': {
            inputType: 'url',
            type: 'Video',
            label: 'Video Cell',
            help: 'Insert a URL to: a video file or a Vimeo / YouTube video page',
            error: false,
            errorMessage: 'Needs to be a valid URL',
            value: ''
          },
          'Image': {
            inputType: 'url',
            type: 'Image',
            label: 'Image Cell',
            help: 'Insert a URL to an image file',
            error: false,
            errorMessage: 'Needs to be a valid URL',
            value: ''
          },
          'Internal-Link': {
            inputType: 'url',
            type: 'Internal-Link',
            label: 'Link Cell',
            help: 'Insert a URL to a page in this system',
            error: false,
            errorMessage: 'Needs to be a valid URL',
            value: ''
          },
          'IFrame': {
            inputType: 'url',
            type: 'IFrame',
            label: 'IFrame Cell',
            help: 'Insert some URL',
            error: false,
            errorMessage: 'Needs to be a valid URL',
            value: ''
          }
        }
      }
    },
    methods: {
      handleItemChanged (value, cell) {
        if (cell.inputType !== 'url') {
          this.updateCellContent(value, cell)
        }
        else {
          cell.error = !(/^http[s]?:\/\/.+/.test(value))
          if (!cell.error) {
            this.updateCellContent(value, cell)
          }
        }
      },
      updateCellContent (value, cell) {
        const _this = this
        // can't remember why the extra sourceUuid is needed …
        // maybe if this is an annotation made in piecemaker (video),
        // that is wrapped into a cell-annotation
        const destUuid = cell.sourceUuid || cell.uuid
        if (destUuid) {
          this.$store.dispatch('annotations/find', {'uuid': destUuid})
            .then(annotations => {
              const a = annotations.items.shift()
              cell.content = value
              a.body.value = JSON.stringify(cell)
              _this.$store.dispatch('annotations/patch', [destUuid, {body: a.body, target: a.target}])
            })
        }
      }
    }
  }
</script>

<style scoped lang="stylus"></style>
