(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{"10ZX":function(t,a,e){"use strict";var o=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("form-main",{attrs:{schema:t.schema},model:{value:t.payload,callback:function(a){t.payload=a},expression:"payload"}})},r=[],s=(e("VRzm"),e("Y9fb")),i=e("ta7f"),n=e("ExVU"),u=e("wbdi"),d={components:{FormMain:s["a"]},props:["redirectTo"],data:function(){var t=this;return{apiPayload:void 0,payload:t.$route.params.id?t.$store.dispatch("annotations/get",t.$route.params.id).then(function(t){return{url:t.body.source}}):void 0,schema:{fields:{url:{fullWidth:!0,type:"text",label:"labels.video_url",errorLabel:"errors.field_required",validators:{required:i["required"]}}},submit:{handler:function(){return t.apiPayload={body:{source:t.payload.url,type:"Video",purpose:"linking"},author:t.$store.state.auth.payload.userId,target:{id:t.$route.params.groupId||t.groupId,type:u["a"].MAP_TYPE_TIMELINE,selector:{type:"Fragment",value:n["DateTime"].local().toString()}}},Promise.resolve().then(function(){return t.payload.uuid?t.$store.dispatch("annotations/patch",[t.payload.uuid,t.apiPayload]):t.$store.dispatch("annotations/create",t.apiPayload)}).then(function(){t.$router.push("/piecemaker/groups/".concat(t.$route.params.groupId,"/videos"))})}}}}}},l=d,c=e("KHd+"),p=Object(c["a"])(l,o,r,!1,null,null,null);a["a"]=p.exports},m26z:function(t,a,e){"use strict";e.r(a);var o=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("card-full",[e("q-btn",{attrs:{slot:"backButton",icon:"keyboard_backspace",small:"",round:""},on:{click:function(a){t.$router.push("/piecemaker/groups/"+t.groupId+"/videos")}},slot:"backButton"}),e("span",{attrs:{slot:"form-logo"},slot:"form-logo"}),e("span",{attrs:{slot:"form-title"},slot:"form-title"},[t._v(t._s(t.$t("routes.piecemaker.videos.edit.title")))]),e("div",{staticClass:"row"},[e("div",{staticClass:"col-6 padding-1em"},[t.$route.params.id?e("tags",{attrs:{targetUuid:t.$route.params.id}}):t._e()],1),e("div",{staticClass:"col-6 padding-1em"},[e("edit-video",{staticClass:"col-6"})],1)])],1)},r=[],s=e("10ZX"),i=e("huk2"),n=e("Qqu8"),u={components:{Tags:n["a"],EditVideo:s["a"],CardFull:i["a"]},data:function(){return{groupId:""}},mounted:function(){this.fetchGroupId()},methods:{fetchGroupId:function(){var t=this;this.$store.dispatch("annotations/find",{query:{uuid:this.$route.params.id}}).then(function(a){t.groupId=a.shift().target.id})}}},d=u,l=e("KHd+"),c=Object(l["a"])(d,o,r,!1,null,null,null);a["default"]=c.exports}}]);