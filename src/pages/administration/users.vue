<template lang="pug">

  div(style="padding: 2rem;")

    .row.border-bottom
      h5.col-6 User-Management
      .col-6.text-right
        q-btn(@click="") Add user

    .row.border-bottom(v-for="user in users", :key="user.user")

      h6.col-12
        span.text-primary {{ user.user_name }}
        q-btn(style="margin-left: 1em;") delete

      .col-xs-12.col-lg-6.row(style="margin-bottom: 2rem;")

        table.col-12.q-table.text-center(style="background-color: rgba( 255, 255, 255, .025 ); padding: .5rem;")
          thead
            tr.border-top.text-center
              td.border-right
              td add
              td edit
              td delete
              td annotate
              td live-annotate

          tbody
            tr.tr_hover(v-for="ut in user.timelines")
              td.border-top.border-right.text-left Timelines
              td.border-top(v-for="(cell, i) in ut")
                q-checkbox(v-if="cell.val != null", @change="user.changed = true", v-model="cell.val")

            tr.tr_hover(v-for="uv in user.videos")
              td.border-top.border-right.text-left Videos
              td.border-top(v-for="(cell, i) in uv")
                q-checkbox(v-if="cell.val != null", @change="user.changed = true", v-model="cell.val")

            tr.tr_hover(v-for="uu in user.users")
              td.border-top.border-right.text-left Users
              td.border-top(v-for="(cell, i) in uu")
                q-checkbox(v-if="cell.val != null", @change="user.changed = true", v-model="cell.val")

        .col-12.text-right
          q-btn(v-if="user.changed", @click="user.changed = false", style="margin-top: .75rem;") undo
          q-btn(v-if="user.changed", @click="user.changed = false", style="margin: .75rem 0 0 .5rem;") save changes

      .col-lg-6(style="padding: 0 1.25rem;")
        p Access to timelines:
        q-list.no-border
          q-item.no-padding(v-for="data in user.meta", :key="data.mail")
            | {{ data.mail }}
            br
            | {{ data.confirmed }}
            br
            | {{ data.created }}

</template>

<script>
export default {
  data () {
    return {
      users: [{
        user_name: 'Donald Duck',
        timelines: [{
          add: { val: false },
          edit: { val: true },
          delete: { val: false },
          annotate: { val: null },
          live_annotate: { val: true }
        }],
        videos: [{
          add: { val: true },
          edit: { val: true },
          delete: { val: false },
          annotate: { val: false },
          live_annotate: { val: null }
        }],
        users: [{
          add: { val: false },
          edit: { val: true },
          delete: { val: true },
          annotate: { val: null },
          live_annotate: { val: null }
        }],
        meta: [{
          created: '2018-02-01',
          mail: 'test@abc.de',
          confirmed: true
        }],
        changed: false
      }, {
        user_name: 'Micky Maus',
        timelines: [{
          add: { val: true },
          edit: { val: true },
          delete: { val: true },
          annotate: { val: null },
          live_annotate: { val: false }
        }],
        videos: [{
          add: { val: false },
          edit: { val: true },
          delete: { val: false },
          annotate: { val: true },
          live_annotate: { val: null }
        }],
        users: [{
          add: { val: false },
          edit: { val: true },
          delete: { val: false },
          annotate: { val: null },
          live_annotate: { val: null }
        }],
        meta: [{
          created: '2018-02-02',
          mail: 'test@abc.com'
        }],
        changed: false
      }, {
        user_name: 'Goofy',
        timelines: [{
          add: { val: true },
          edit: { val: true },
          delete: { val: false },
          annotate: { val: null },
          live_annotate: { val: true }
        }],
        videos: [{
          add: { val: true },
          edit: { val: true },
          delete: { val: true },
          annotate: { val: true },
          live_annotate: { val: null }
        }],
        users: [{
          add: { val: true },
          edit: { val: true },
          delete: { val: false },
          annotate: { val: null },
          live_annotate: { val: null }
        }],
        meta: [{
          created: '2017-11-18',
          mail: 'bla@yahoo.com'
        }],
        changed: false
      }, {
        user_name: 'Dagobert Duck',
        timelines: [{
          add: { val: false },
          edit: { val: false },
          delete: { val: true },
          annotate: { val: null },
          live_annotate: { val: true }
        }],
        videos: [{
          add: { val: true },
          edit: { val: false },
          delete: { val: false },
          annotate: { val: false },
          live_annotate: { val: null }
        }],
        users: [{
          add: { val: true },
          edit: { val: true },
          delete: { val: false },
          annotate: { val: null },
          live_annotate: { val: null }
        }],
        meta: [{
          created: '2016-07-09',
          mail: 'ccdscsd@gmx.de'
        }],
        changed: false
      }]
    }
  },
  methods: {
    onChange () {
      console.log('changed')
    }
  }
  // name: "user-management"
}
</script>

<style scoped>
  .border-top {
    border-top: 1px solid rgba( 255, 255, 255, .2 )!important;
    }
  .border-bottom {
    border-bottom: 1px solid rgba( 255, 255, 255, .2 )!important;
    margin-bottom: 2rem;
    }
  .border-right {
    border-right: 1px solid rgba( 255, 255, 255, .2 )!important;
    }
  .tr_hover:hover {
    background-color: rgba( 255, 255, 255, .025 );
    }
</style>
