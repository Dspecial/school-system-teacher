import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path: '/',
		  component: resolve => require(['@/views/Login'], resolve),
		  name: 'Login',
		  meta: {
		    title: '登录'
		  },
  	},
		{
		  path: '/home',
		  component: resolve => require(['@/views/Home'], resolve),
		  name: 'Home',
		  redirect: '/index',
		  meta: {
		    title: '主页'
		  },
		  children: [
		  	{
				  path: '/index',
				  component: resolve => require(['@/views/Index'], resolve),
				  name: 'Index',
				  meta: {
				    title: '工作台'
				  },
				  children: null
				},
				{
				  path: '/project/application',
				  component: resolve => require(['@/views/project/Application'], resolve),
				  name: 'Application',
				  meta: {
				    title: '项目申请'
				  },
				  children: null
				},
				{
				  path: '/project/application/detail',
				  component: resolve => require(['@/views/project/ApplicationDetail'], resolve),
				  name: 'ApplicationDetail',
				  meta: {
				    title: '项目详情'
				  },
				  children: null
				},
				{
				  path: '/project/progress',
				  component: resolve => require(['@/views/project/Progress'], resolve),
				  name: 'Progress',
				  meta: {
				    title: '项目进程'
				  },
				  children: null
				},
				{
				  path: '/project/resource',
				  component: resolve => require(['@/views/project/Resource'], resolve),
				  name: 'Resource',
				  meta: {
				    title: '资源管理'
				  },
				  children: null
				},
				{
				  path: '/message',
				  component: resolve => require(['@/views/message/Message'], resolve),
				  name: 'Message',
				  meta: {
				    title: '信息管理'
				  },
				  children: null
				},
				{
				  path: '/document',
				  component: resolve => require(['@/views/document/Document'], resolve),
				  name: 'Document',
				  meta: {
				    title: '文档资源管理'
				  },
				  children: null
				},
		  ],
		}
  ]
})
