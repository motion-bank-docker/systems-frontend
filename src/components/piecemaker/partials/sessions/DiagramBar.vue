<template lang="pug">
  svg(:width="width", height="100%", :x="x * index")
    rect.cursor-pointer.moba-diagram-bar(v-if="session", width="100%", :height="height", :y="y", :class="{'moba-active-bar' : active}",
      @mouseenter="sessionBarEnter", @mouseleave="sessionBarLeave", @click="sessionBarClick")
</template>

<script>
  import { DateTime } from 'luxon'
  export default {
    props: ['session', 'index', 'dimensions', 'active', 'timeFormat'],
    methods: {
      sessionBarEnter () {
        const hoverVal = {}
        hoverVal.start = this.getTime(DateTime.fromISO(this.session.start))
        hoverVal.end = this.getTime(DateTime.fromISO(this.session.end))
        hoverVal.duration = this.duration
        this.$emit('hover', hoverVal)
      },
      sessionBarLeave () {
        this.$emit('hover')
      },
      sessionBarClick () {
        this.$emit('click', { session: this.session, index: this.index })
      },
      getTime (val) {
        return val.toLocaleString({
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
        })
      }
    },
    computed: {
      duration () {
        return (DateTime.fromISO(this.session.end).toMillis() - DateTime.fromISO(this.session.start).toMillis()) * 0.001
      },
      isConfigured () {
        return this.session && this.dimensions
      },
      height () {
        return Math.min(this.dimensions.height, this.isConfigured ? (this.dimensions.height / 2 / 60 / 60) * Math.max(10 * 60, this.duration) : 0)
      },
      width () {
        return this.isConfigured ? this.dimensions.barWidth : 0
      },
      x () {
        return this.isConfigured ? (this.dimensions.barWidth + this.dimensions.barSpace) : 0
      },
      y () {
        return this.isConfigured ? this.dimensions.height - this.height +
          // (this.getActiveSessionDuration(this.session.start.millis, this.session.end.millis) / 1000)) +
          this.dimensions.offsetY : 0
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .moba-diagram-bar
    fill rgba(255, 255, 255, .1)

  .moba-diagram-bar:hover
    fill rgba(255, 255, 255, .2)

  .moba-active-bar
    fill $primary!important
</style>
