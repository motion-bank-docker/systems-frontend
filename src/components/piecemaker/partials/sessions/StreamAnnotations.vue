<template lang="pug">
  div
    .q-pl-sm(v-for="annotation in annotations", :ref="annotation.annotation.uuid",
      @mouseenter="onAnnotationEnter(annotation)", @mouseleave="onAnnotationLeave",
      @click="setSessionTime(annotation.duration)")

      .row.moba-list-entry(:ref="`annotation-${annotation.annotation.uuid}-${annotation.duration.toFixed(3)}`")
        .row.col-12(style="line-height: 1.35rem;")
          .col-12.row.q-px-md.q-py-sm.moba-round-borders(:class="[annotation.type != 'system' ? 'moba-hover' : '', annotation.type == 'separator' ? 'bg-grey-9 text-black text-center' : '']")
            .col-10.cursor-pointer

              // AUTHOR
              //
              span.text-grey-9 {{ shortenName(annotation.annotation.author.name) }}&nbsp;&nbsp;
                q-tooltip.bg-dark.shadow-8.moba-border(anchor="center left", self="center right", :offset="[10, 0]") {{ annotation.annotation.author.name }}

              // TEXT
              //
              span(:class="[annotation.active ? 'text-primary' : '']") {{ annotation.annotation.body.value }}

            // ZITIER LINK
            //
            .col-1.text-right.moba-edit
              q-btn.bg-dark.text-white.flip-horizontal.moba-border(icon="link", size="sm", round, flat)

              // ANNOTATION TAGS
              // erstmal drin lassen
              //
              // div(v-if="annotation.tags.length > 0")
                div.text-right
                  span
                    q-chip.bg-dark.text-white.moba-border.moba-annotation-tag
                      | #
                    q-tooltip.bg-dark.q-py-none.shadow-8.moba-border(anchor="top left", self="top right", :offset="[10, 0]")
                      q-list.no-border
                        q-item(v-for="(at, ati) in annotation.tags", :class="{'q-pa-xs': ati - 2 < annotation.tags.length}")
                          q-chip.bg-transparent.text-grey-4.moba-border {{ at }}

            // BUTTON
            // go to annotation screen
            //
            .col-1.text-right.moba-edit
              q-btn.bg-dark.text-white.flip-horizontal.moba-border(icon="keyboard_backspace", size="sm", round, flat)
</template>

<script>
  export default {
    props: ['annotations'],
    methods: {
      shortenName (val) {
        if (typeof val === 'string') return val.match(/\b\w/g).join('')
        return ''
      },
      onAnnotationEnter (annotation) {
        this.$emit('annotation-preview', annotation)
      },
      onAnnotationLeave () {
        this.$emit('annotation-preview')
      },
      setSessionTime (val) {
        this.$emit('session-time', val)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .moba-round-borders
    border-radius .5rem
</style>
