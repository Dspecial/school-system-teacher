/*
 * @Author: dxx
 * @Email: dxxtalking@163.com
 * @Date: 2021-10-13 10:32:33
 * @LastEditors: dxx
 * @LastEditTime: 2022-05-25 11:36:16
 */
import Vue from 'vue';
import axios from 'axios';
import store from '@/store';
import qs from 'qs';
import VueCookies from 'vue-cookies';
import router from '@/router/index.js';
import 'element-ui/lib/theme-chalk/index.css';
import { Loading,Notification,Message } from 'element-ui'; // 按需引入

import globalUrl from '@/core/globalUrl.js';

axios.defaults.timeout = 120000; // 响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 配置请求头
axios.defaults.baseURL = ''; // 配置接口地址
axios.defaults.showLoading = true; // 默认接口都带loading

let loadingInstance;
let needLoadingRequestCount = 0; // 防止一个页面出现多次loading，多层遮罩；使用count最终都转成一个loading

function startLoading () {
  loadingInstance  = Loading.service({
    lock: true, // 锁定屏幕，屏幕不能滚动
    text: '请求数据中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
};

function endLoading () {
  Vue.nextTick(function () {
    // DOM 更新了
    loadingInstance.close()
  })
};

function showLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
};

function hideLoading () {
  setTimeout(tryCloseLoading, 300)
};

function tryCloseLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
};

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    if(config.showLoading){
      // 登录动画
      showLoading();
    }
    if(config.customTimeout){
      config.timeout = config.customTimeout;
    }
    // 每次发送请求之前判断VueCookies是否存在token        
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
    // var token = '';
    // if(VueCookies.get("token")){
    //   token = VueCookies.get("token");// 从VueCookies中拿到token
    // };
    // config.headers.tokenId = token;
    return config;
  },
  error => {
    console.log('错误的传参');
    return Promise.error(error);
  }
);

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
    // 否则的话抛出错误
    hideLoading();
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      console.log("抛出错误");
      Notification({
        title: '提示',
        message: '抛出错误',
        duration: 3000,
        type: 'warning',
      });
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码    
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    if (error.response) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。                
        case 401:
          Notification({
            title: '提示',
            message: '未登录',
            duration: 3000,
            type: 'error',
          });
          // router.replace({
          //   path: '/login',
          //   query: {
          //     redirect: router.currentRoute.fullPath
          //   }
          // });
          break;

        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面                
        case 403:
          Notification({
            title: '提示',
            message: '登录过期，请重新登录',
            duration: 3000,
            type: 'warning',
          });

          // 清除token
          VueCookies.delete("token");
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
          break;

        // 404请求不存在
        case 404:
          Message({
            message: '网络请求不存在',
            duration: 3000,
            type: 'error',
          });
          break;

        // 500程序出错
        case 500:
          Message({
            message: '后台程序出错：'+ error.response.data.message,
            duration: 3000,
            type: 'error',
          });
          break;

        // 其他错误，直接抛出错误提示
        default:
          Message({
            message: error.response.data.message,
            duration: 3000,
            type: 'error',
          });
      }
      hideLoading();
      return Promise.reject(error.response);
    }else{
      // 处理超时的情况
      let config = error.config
      // 如果配置不存在或未设置重试选项，请拒绝
      if(!config || !config.retry){
        Message({
          message: '连接超时！',
          duration: 3000,
          type: 'error',
        });
        hideLoading();
        return Promise.reject(error);
      } else{
        // to do 重试等操作...

      } 
    }
  }
);

//返回一个Promise(发送post请求)
const setParams = (url, params) => {
  return {
    url: globalUrl.baseURL+ url + (typeof params == 'string' ? '/' + params : ''),
    params: (typeof params == 'string' ? {} : params),
  }
}

//返回一个Promise(发送post请求,带token)
export function postToken (url, params, config) {  // eslint-disable-line no-unused-vars
  let opt = setParams(url, params);
  // 设置公共的user_token
  opt.params.user_token = VueCookies.get("application_token");
  return new Promise((resolve, reject) => {
    axios.post(opt.url, qs.stringify(opt.params), config)
    .then(res => { 
      resolve(res.data); 
    })
    .catch(err => { 
      reject(err.data) 
    });
  });
};

//返回一个Promise(发送post请求)
export function post (url, params, config) {  // eslint-disable-line no-unused-vars
  let opt = setParams(url, params, config);
  return new Promise((resolve, reject) => {
    axios.post(opt.url, qs.stringify(opt.params), config)
    .then(res => { 
      resolve(res.data); 
    })
    .catch(err => {
      reject(err.data);
    });
  });
};

// postJson 请求
export function postJson (url, params, config) { 
  let opt = setParams(url, params);
  return new Promise((resolve, reject) => {
    axios.post(opt.url, opt.params, config, { 
      headers: { 'Content-Type': 'application/json;charset=UTF-8' } 
    })
    .then(res => { 
      resolve(res.data); 
    })
    .catch(err => { 
      reject(err.data);
    });
  });
};

// postUpload 请求
export function postUpload (url, params, config) { 
  let opt = setParams(url, params);
  return new Promise((resolve, reject) => {
    axios.post(opt.url, opt.params, config, { 
      headers: {"Content-Type": "multipart/form-data"},
    })
    .then(res => { 
      resolve(res.data); 
    })
    .catch(err => { 
      reject(err.data);
    });
  });
};

//返回一个Promise(发送get请求)
export function get(url, params, config) { 
  let opt = setParams(url, params);
  return new Promise((resolve, reject) => {
    axios.get(opt.url, { params: opt.params, ...config })
    .then(res => { 
      resolve(res.data); 
    })
    .catch(err => {
      reject(err.data) 
    })
  });
};

//返回一个Promise(发送get请求,带token)
export function getToken(url, params, config) {   
  let opt = setParams(url, params);
  // 设置公共的token
  opt.params.user_token = VueCookies.get("application_token");
  return new Promise((resolve, reject) => {
    axios.get(opt.url, { params: opt.params }, config)
    .then(res => { 
      resolve(res.data); 
    })
    .catch(err => { 
      reject(err.data) 
    })
  });
};

export default {
  post,
  postToken,
  postJson,
  postUpload,
  get,
  getToken
}