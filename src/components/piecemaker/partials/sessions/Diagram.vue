<template lang="pug">
  // DIAGRAM
  // timeline overview
  //
  .text-center(v-if="grouped")
    // TOOLTIP FOR TIMELINE DIAGRAM BARS
    //
    .fixed.bg-dark.shadow-6.moba-border(v-if="barTooltip.visibility", :style="{left: barTooltip.cursorX + 15 + 'px', top: barTooltip.cursorY + 15 + 'px', zIndex: 1000}")
      .q-ma-sm
        div {{ hoverVal.start }}
        div {{ hoverVal.end }}
        div {{ hoverVal.duration / 1000 }} seconds

    q-window-resize-observable(@resize="onWindowResize")

    svg(width="100%", :height="diagramDimensions.height + diagramDimensions.offsetY")

      defs
        linearGradient(id="lgrad" x1="50%" y1="0%" x2="50%" y2="100%")
          stop(offset="0%" style="stop-color: rgb(255,255,255); stop-opacity: .5;")
          stop(offset="100%" style="stop-color: rgb(0,0,0); stop-opacity: .2;")

      // BACKGROUND LINES
      //
      line.background-line(v-for="n in diagramDimensions.distances.length", x1="0", x2="100%",
        :y1="diagramDimensions.height / diagramDimensions.distances.length * (n - 1) + diagramDimensions.offsetY",
        :y2="diagramDimensions.height / diagramDimensions.distances.length * (n - 1) + diagramDimensions.offsetY")
      rect(width="60", height="100%", fill="#1F1D1E")

      // TIME LABELS
      //
      text.q-caption.time-labels(v-for="(n, i) in diagramDimensions.distances.length", x="0",
      :y="diagramDimensions.height - (diagramDimensions.height / diagramDimensions.distances.length * (n - 1)) - ((diagramDimensions.height / diagramDimensions.distances.length)) + 3 + diagramDimensions.offsetY",)
        | {{ diagramDimensions.distances[i] }}

      // BACKGROUND LINE + TIME LABEL
      // if session duration <= minimum time
      line.background-line-label(v-for="n in diagramDimensions.distances.length", x1="0", x2="100%",
        :y1="backgroundLineLabel.y1", :y2="backgroundLineLabel.y2")
      text.q-caption.background-line-label-caption(x="0", :y="backgroundLineLabelCaptionY") < 10min

      // SESSION BARS
      //
      svg(:x="sessionBarX")
        diagram-bar(v-for="(session, i) in grouped.sessions", :session="session", :index="i", :active="activeSessionIndex === i"
          @hover="sessionHover", @click="sessionBarClick", :time-format="timeFormat", :dimensions="diagramDimensions")

      // BOTTOM LINE
      //
      line.bottom-line(x1="0", x2="100%", :y1="bottomLine.y1", :y2="bottomLine.y2")
</template>

<script>
  import DiagramBar from './DiagramBar'
  export default {
    components: {
      DiagramBar
    },
    props: ['grouped', 'activeSessionIndex'],
    data () {
      return {
        activeBar: null,
        barTooltip: {
          cursorX: 0,
          cursorY: 0,
          visibility: false
        },
        hoverVal: {
          duration: 0,
          end: null,
          start: null
        },
        diagramDimensions: {
          activeId: null,
          barMinHeight: 10, // duration in min
          barSpace: 1,
          barWidth: 15,
          distances: ['30min', '60min', '90min', '120min'],
          height: 250,
          offsetY: 20
        },
        timeFormat: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
        },
        map: undefined,
        previewLine: {
          visibility: false,
          positionY: ''
        },
        showSession: false,
        viewportWidth: 0,
        viewportHeight: 0
      }
    },
    mounted () {
      window.addEventListener('mousemove', this.moveTooltip)
    },
    beforeDestroy () {
      window.removeEventListener('mousemove', this.moveTooltip)
    },
    methods: {
      clearSession () {
        this.diagramDimensions.activeId = null
      },
      sessionBarClick (data) {
        this.$emit('select-session', data)
      },
      sessionHover (hoverVal) {
        this.hoverVal = hoverVal
        if (this.hoverVal.start) this.barTooltip.visibility = true
        else { this.barTooltip.visibility = false }
      },
      moveTooltip (event) {
        this.barTooltip.cursorX = event.clientX
        this.barTooltip.cursorY = event.clientY
      },
      onWindowResize (size) {
        this.viewportHeight = size.height
        this.viewportWidth = size.width - 96
      }
    },
    computed: {
      sessionBarX () {
        return this.viewportWidth ? ((this.viewportWidth / 2) - 48) : 0
      },
      bottomLine () {
        return {
          y1: this.diagramDimensions.height + this.diagramDimensions.offsetY,
          y2: this.diagramDimensions.height + this.diagramDimensions.offsetY
        }
      },
      backgroundLineLabelCaptionY () {
        return this.diagramDimensions.height -
          (this.diagramDimensions.height / 2 / 60 * this.diagramDimensions.barMinHeight / 2) +
          4 + this.diagramDimensions.offsetY
      },
      backgroundLineLabel () {
        return {
          y1: this.diagramDimensions.height -
            (this.diagramDimensions.height / 2 / 60 * this.diagramDimensions.barMinHeight) +
            this.diagramDimensions.offsetY,
          y2: this.diagramDimensions.height -
            (this.diagramDimensions.height / 2 / 60 * this.diagramDimensions.barMinHeight) +
            this.diagramDimensions.offsetY
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .bottom-line
    stroke: rgba( 255, 255, 255, .25 )
    stroke-width: 1

  .background-line-label-caption
    fill: rgba( 255, 255, 255, .5 )

  .background-line-label
    stroke: rgba( 255, 255, 255, .05 )
    stroke-width: 1

  .background-line
    stroke: rgba( 255, 255, 255, .1 )
    stroke-width: 1

  .time-labels
    fill: rgba( 255, 255, 255, .5 )
</style>
