<template lang="pug">
  .col-4.shadow-16.moba-border.stream-diagram.overflow-hidden(
    :class="{'moba-fixed': fixDiagram, 'full-width': fixDiagram}")

    svg(v-if="session", width="100%", :height="session.duration * 0.01")

      // LINES - horizontal
      // displays the annotations as lines in the diagramm
      //
      svg(width="100%", height="100%", x="0%")
        rect.cursor-pointer.moba-svg-entry(
          v-for="annotation in annotations",
          @click="setSessionTime(annotation.duration)",
          :class="[annotation.active ? 'moba-active-line' : '']",
          style="fill: rgba(255, 255, 255, 0.2); opacity: 1",
          width="100%", height="1", x="0",
          :y="((annotation.relativeTime / session.duration) * 100).toFixed(3) + '%'")

      // CURRENT TIME
      line.current-time(v-if="typeof sessionTime === 'number'", x1="0", x2="100%", :y1="sessionTime", :y2="sessionTime")

      // SWIMLANES - vertical
      // vertical visualization of the videos
      //
      svg(width="80%")
        // @click="onClickVideo(vid)",
        svg.shadow-6(
          v-for="(vid, i) in session.videos",
          :id="vid.annotation.uuid",
          :width="session.videos.length * 10",
          height="100%",
          :x="(session.videos.length * 10 + 15) * i + 20",
          y="0")
          rect.moba-swimlane(:class="{ 'moba-active-swimlane': isCurrentVideo(vid) }", width="100%", height="100%", x="0", y="0")

          g(v-if="currentVideo === vid.annotation.uuid")
            rect.moba-svg-entry(v-for="n in parseInt(session.duration / 10 + 1)",
              @click="setSessionTime(parseInt(n * 10), vid)",
              width="100%", height="10",
              :y="(n - 1) * 10")
            line.video-line-trans(v-for="n in parseInt(session.duration / 10 + 1)",
              x1="25%", x2="75%", :y1="n * 10", :y2="n * 10")

          line.video-line(v-if="currentVideo == vid.annotation.uuid", x1="0", x2="100%", :y1="n * 60", :y2="n * 60",
            v-for="n in parseInt(session.duration / 60 + 1)")

      // PREVIEW LINE – horizontal
      // appears on the left when hovering matching text on the right
      //
      svg(v-if="previewLine.visibility", width="100%", height="100%")
        rect.preview-line(width="100%", height="1", :y="previewLineY")

      // CURRENT TIME
      // appears on the right side of the diagram when video is playing
      //
        svg(
        v-if="previewWindow.visibility",
        @mousedown="changeSessionTimeDown()",
        width="15%", height="100%",
        x="85%",)
          rect( width="100%", height="100%", fill="#1f1d1e")
          svg(width="100%", height="100%")
            rect(@click="setSessionTime(n)",,
            v-for="n in 1000", :y="n", height="1", width="100%", fill="transparent")
          line(x1="0", y1="0", x2="0", y2="100%", style="stroke: rgba(255, 255, 255, .5); stroke-width: 1;")
          svg( width="100%", height="50px", :y="sessionTime - 20" )
            line(
            x1="0", y1="20",
            x2="100%", y2="20",
            style="stroke: rgba(255, 255, 255, .5); stroke-width: 1;"
            )
            circle.cursor-pointer(
            cx="50%", cy="20", r="12", stroke="rgba(255, 255, 255, .5)", stroke-width="1", fill="#1f1d1e"
            )

      // VIDEO TIME
      // displays the actual time of the selected video
      //
      svg(v-for="(vid, i) in session.videos")
        svg(v-if="currentVideo === vid.annotation.uuid", :y="(sessionTime - 10)", :x="(session.videos.length * 10) + ((session.videos.length * 10 + 15) * i + 20) + 5")
          polygon(points="10 0 0 10 10 20 60 20 60 0 10 0", fill="#749DFC")
          // rect(width="50", height="20", x="10", fill="#749DFC")
          text.q-caption(x="20", y="15", fill="white") {{ Math.floor(sessionTime / 60) }}:{{ Math.trunc(sessionTime - Math.floor(sessionTime / 60) * 60) }}
      //
        svg(width="50", height="20", :y="sessionTime - 10", x="100")
          //
            rect(
            width="100%", height="100%",
            fill="rgba(255, 255, 255, .25)"
            )
          rect(
          width="100%", height="100%",
          fill="rgba(0, 0, 0, 1)"
          )
          text(x="2", y="12", fill="white") {{ sessionTime }}
</template>

<script>
  export default {
    props: ['session', 'fixDiagram', 'sessionTime', 'currentVideo', 'previewTime'],
    data () {
      return {
        previewLine: {
          positionY: 0,
          visibility: false
        }
      }
    },
    computed: {
      previewLineY () {
        if (typeof this.previewTime !== 'undefined') return this.previewTime
        return this.previewLine.positionY
      },
      annotations () {
        return this.session ? this.session.annotations : []
      }
    },
    methods: {
      changeSessionTimeDown () {
        // console.log('changeSessionTime fired')
        // console.log('--> ' + event.clientY)
        this.setSessionTime(event.clientY)
      },
      setSessionTime (val, video) {
        this.previewLine.positionY = val
        if (video) this.onClickVideo(video)
        this.$emit('session-time', val)
      },
      onClickVideo (vid) {
        this.$emit('click-video', vid)
      },
      isCurrentVideo (vid) {
        return this.currentVideo && this.currentVideo === vid.annotation.uuid
      }
    }
  }
</script>

<style scoped lang="stylus">
  .moba-svg-entry
    opacity 0
    cursor pointer
    fill rgba(255, 255, 255, .2)

  .moba-svg-entry:hover
    fill rgba(255, 255, 255, 1)!important
    opacity 1

  .moba-swimlane
    fill rgba(255, 255, 255, .75)
    stroke-width 1
    stroke rgba(255, 255, 255, .1)
    transition fill ease 200ms

  .moba-swimlane:hover
    fill rgba( 255, 255, 255, .4 )

  .current-time
    stroke #50AE54
    stroke-width 1

  .video-line-trans
    stroke rgba(255, 255, 255, .5)
    stroke-width 1

  .video-line
    stroke rgba(255, 255, 255, 1)
    stroke-width 1

  .preview-line
    fill rgba(255, 255, 255, .5)!important

  .stream-diagram
    height calc(100vh - 50px)
    overflow scroll
    z-index 20
</style>
