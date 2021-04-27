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
				/*
				**项目管理
				 */
				// 项目列表
				{
				  path: '/project/project',
				  component: resolve => require(['@/views/project/Project'], resolve),
				  name: 'projectList',
				  meta: {
				    title: '项目列表'
				  },
				  children: null
				},
				{
				  path: '/project/project/edit',
				  component: resolve => require(['@/views/project/ProjectEdit'], resolve),
				  name: 'ProjectEdit',
				  meta: {
				    title: '项目编辑'
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
				// 资源列表
				{
				  path: '/project/resource',
				  component: resolve => require(['@/views/project/Resource'], resolve),
				  name: 'Resource',
				  meta: {
				    title: '资源管理'
				  },
				  children: null
				},

				/*
				**消息管理
				 */
				{
				  path: '/notices/notices',
				  component: resolve => require(['@/views/notices/Notices'], resolve),
				  name: 'NoticesList',
				  meta: {
				    title: '消息列表'
				  },
				  children: null
				},

				/*
				**知识库
				 */
				{
				  path: '/knowledge/knowledge',
				  component: resolve => require(['@/views/knowledge/Knowledge'], resolve),
				  name: 'KnowledgeList',
				  meta: {
				    title: '知识库列表'
				  },
				  children: null
				},
				{
				  path: '/knowledge/knowledge/detail',
				  component: resolve => require(['@/views/knowledge/KnowledgeDetail'], resolve),
				  name: 'KnowledgeDetail',
				  meta: {
				    title: '知识库详情'
				  },
				  children: null
				},

				/*
				**事务管理
				 */
				{
				  path: '/works/routine',
				  component: resolve => require(['@/views/works/Routine'], resolve),
				  name: 'RoutineList',
				  meta: {
				    title: '事务列表'
				  },
				  children: null
				},
				{
				  path: '/works/routine/edit',
				  component: resolve => require(['@/views/works/RoutineEdit'], resolve),
				  name: 'RoutineEdit',
				  meta: {
				    title: '编辑事务'
				  },
				  children: null
				},
		  ],
		}
  ]
})
