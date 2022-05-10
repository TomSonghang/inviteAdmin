import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "./store";

import animated from "animate.css";
import "./plugins/element.js";
import "@/style/index.less";
import "normalize.css";

import BaiduMap from "vue-baidu-map";

Vue.use(BaiduMap, {
  ak: "wUS1TXZ2Q48w4d0prjoVmZCMqe7C94BO", // ak 是在百度地图开发者平台申请的密钥
});

import * as filter from "@/utils/filter.js";

import { hasPermission } from "@/utils/directive.js";
hasPermission();

Object.keys(filter).forEach((key) => {
  Vue.filter(key, filter[key]);
});

Vue.use(animated);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
