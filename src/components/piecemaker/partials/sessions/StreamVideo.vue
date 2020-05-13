<template lang="pug">
  // VIDEO PREVIEW
  //
  .fixed-bottom-right.stream-video(v-if="visible", @mouseup="resizeButtonUp",
    :class="{'row full-width': fixDiagram, 'shadow-16 q-mb-md q-mr-md': !fixDiagram}")

    q-window-resize-observable(@resize="onResize")

    .bg-dark.text-center.relative-position(:class="{'col-8 offset-4 moba-border-top': fixDiagram}")

      // VIDEO PLAYER
      //
      div(:style="[fixDiagram ? styleActivePreview : styleActivePreviewDocked]")
        media-player(v-if="video", :annotation="video.annotation",
          @ready="playerReady($event)", @timeupdate="onPlayerTime($event)")

      .absolute-top-left.q-mt-sm.q-ml-sm(@mousedown="resizeButtonDown")
        // BTN
        // RESIZE
        //
        q-btn.q-mr-xs.rotate-90.bg-dark(v-if="fixDiagram", icon="code", round, size="sm")
        // BTN
        // INFO
        //
        q-btn.bg-dark.text-center(round, size="sm")
          q-icon(name="info")
          q-tooltip.bg-black.shadow-8.moba-border.no-padding(anchor="top left", self="bottom left", :offset="[0, 5]")
            q-list.no-border
              q-item
                q-item-side ID:
                q-item-main {{ video.annotation.body.source.id }}
              q-item
                q-item-side Author:
                q-item-main {{ video.annotation.creator.name }}
              q-item
                q-item-side Created:
                q-item-main {{ video.annotation.created }}

      // BTN
      // CLOSE
      //
      .absolute-top-right.q-mt-sm.q-mr-sm(@click="close")
        q-btn.bg-dark(icon="clear", round, size="sm")
</template>

<script>
  export default {
    props: ['fixDiagram', 'video', 'visible'],
    data () {
      return {
        visibility: false,
        height: 0,
        testHeight: '',
        testWidth: '',
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        styleActivePreview: {
          width: 40 + '%',
          maxWidth: '100%',
          marginLeft: '30%'
        },
        styleActivePreviewDocked: {
          width: 200 * 1.77777 + 'px',
          height: 200 + 'px!important',
          maxHeight: 200 + 'px!important',
          marginLeft: '0px'
        }
      }
    },
    mounted () {
      this.handlerPreviewWindow()
    },
    methods: {
      close () {
        this.$emit('close')
      },
      resizeButtonDown () {
        window.addEventListener('mousemove', this.handlerPreviewWindow)
      },
      resizeButtonUp () {
        window.removeEventListener('mousemove', this.handlerPreviewWindow)
      },
      onResize (size) {
        this.viewport.height = size.height
        this.viewport.width = size.width
      },
      handlerPreviewWindow () {
        // TODO: clean up
        this.height = this.viewport.height - event.clientY + 20
        this.testHeight = this.viewport.height - event.clientY
        this.testWidth = this.testHeight * 1.77777
        // this.styleActivePreview.width = (this.viewport.width / 12 * 8) - event.clientY + 'px'
        let testWidth = (this.viewport.height - event.clientY) * 1.777 + 35
        let testMarginLeft = ((this.viewport.width / 12 * 8) / 2) - (testWidth / 2)
        this.styleActivePreview.width = testWidth + 'px'
        if (testMarginLeft > 0) this.styleActivePreview.marginLeft = testMarginLeft + 'px'
        else this.styleActivePreview.marginLeft = '0px'
      }
    }
  }
</script>

<style scoped lang="stylus">
  .stream-video
    z-Index 10

  .active-preview
    maxWidth 100%

  .active-preview-docked
    width 355.554px
    height 200px!important
    maxHeight 200px!important
    marginLeft '0px'
</style>
