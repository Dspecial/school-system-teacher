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
import VueCookies  from 'vue-cookies'; 
import api from '@/core/api.js'; // 引入公共api
import commonJs from '@/core/commonJs.js'; // 引入公共js
import globalUrl from '@/core/globalUrl.js';

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });// 声明使用ElementUI
Vue.use(VueDataTables);
Vue.use(VueCookies);
Vue.use(echarts);
Vue.prototype.$echarts = echarts
Vue.prototype.commonJs = commonJs; // 挂载原型链
Vue.prototype.$api = api;
Vue.prototype.$globalUrl = globalUrl;
Vue.prototype.$moment = moment;

Vue.config.productionTip = false

import iconPicker from 'e-icon-picker';
import "e-icon-picker/dist/symbol.js"; //基本彩色图标库
import 'e-icon-picker/dist/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库
Vue.use(iconPicker, {FontAwesome: false, ElementUI: true, eIcon: false, eIconSymbol: false});//使用e-icon-picker

// import 'element-ui/lib/theme-chalk/index.css'; // element-ui样式表
import './assets/css/icons/icomoon/styles.css'; // 字体图标iconmoon
import './assets/css/element-variables.scss'; // 自定义element-ui样式表
import './assets/css/base.scss'; // 基础样式表
import './assets/css/main.scss'; // 页面样式表

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,  //store:store 和router一样，将我们创建的Vuex实例挂载到这个vue实例中
  components: { App },
  template: '<App/>'
})
