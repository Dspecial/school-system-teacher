// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'; // 引入vuex
import ElementUI from 'element-ui';
import VueDataTables from 'vue-data-tables';
import moment from 'moment'; 
import echarts from 'echarts';
import VueCookie from 'vue-cookie'; // api: https://github.com/alfhen/vue-cookie
import MyAxios from '@/core/axios.js';
import globalUrl from '@/core/globalUrl.js';

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });// 声明使用ElementUI
Vue.use(VueDataTables);
Vue.use(echarts);
Vue.prototype.$echarts = echarts
Vue.prototype.MyAxios = MyAxios;
Vue.prototype.globalUrl = globalUrl;

Vue.config.productionTip = false

// import 'element-ui/lib/theme-chalk/index.css'; // element-ui样式表
import './assets/css/icons/icomoon/styles.css'; // 字体图标iconmoon
import './assets/css/element-variables.scss'; // 自定义element-ui样式表
import './assets/css/base.scss'; // 基础样式表
import './assets/css/main.scss'; // 页面样式表

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
