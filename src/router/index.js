import Vue from 'vue';
import Router from 'vue-router';
import VueCookies from 'vue-cookies';

Vue.use(Router)

const router = new Router({
  routes: [
		{
  		path: '/',
		  component: resolve => require(['@/views/Login'], resolve),
		  name: '首次进入',
		  meta: {
		    title: '登录'
		  },
  	},
  	{
  		path: '/login',
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
		    title: '主页',
		  },
		  children: [
		  	{
				  path: '/index',
				  component: resolve => require(['@/views/Index'], resolve),
				  name: 'Index',
				  meta: {
				    title: '工作台',
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
				    title: '项目列表',
				  },
				  children: null
				},
				{
				  path: '/project/project/edit',
				  component: resolve => require(['@/views/project/ProjectEdit'], resolve),
				  name: 'ProjectEdit',
				  meta: {
				    title: '项目编辑',
				  },
				  children: null
				},
				{
				  path: '/project/project/recheck',
				  component: resolve => require(['@/views/project/ProjectRecheck'], resolve),
				  name: 'ProjectRecheck',
				  meta: {
				    title: '项目提交复审',
				  },
				  children: null
				},
				{
				  path: '/project/project/recheckList',
				  component: resolve => require(['@/views/project/ProjectRecheckList'], resolve),
				  name: 'ProjectRecheckList',
				  meta: {
				    title: '项目复审列表',
				  },
				  children: null
				},
				{
				  path: '/project/application',
				  component: resolve => require(['@/views/project/Application'], resolve),
				  name: 'Application',
				  meta: {
				    title: '项目申请',
				  },
				  children: null
				},
				{
				  path: '/project/application/detail',
				  component: resolve => require(['@/views/project/ApplicationDetail'], resolve),
				  name: 'ApplicationDetail',
				  meta: {
				    title: '项目详情',
				  },
				  children: null
				},
				{
				  path: '/project/progress',
				  component: resolve => require(['@/views/project/Progress'], resolve),
				  name: 'Progress',
				  meta: {
				    title: '项目进程',
				  },
				  children: null
				},
				// 资源列表
				{
				  path: '/project/resource',
				  component: resolve => require(['@/views/project/Resource'], resolve),
				  name: 'Resource',
				  meta: {
				    title: '资源列表',
				  },
				  children: null
				},
				// 编辑资源
				{
				  path: '/project/resource/edit',
				  component: resolve => require(['@/views/project/ResourceEdit'], resolve),
				  name: 'ResourceEdit',
				  meta: {
				    title: '编辑资源',
				  },
				  children: null
				},
				// 资源详情
				{
				  path: '/project/resource/detail',
				  component: resolve => require(['@/views/project/ResourceDetail'], resolve),
				  name: 'ResourceDetail',
				  meta: {
				    title: '资源详情',
				  },
				  children: null
				},

				/*
				**审核管理
				 */
				// 初审列表
				{
				  path: '/check/first',
				  component: resolve => require(['@/views/check/FirstCheck'], resolve),
				  name: 'FirstCheck',
				  meta: {
				    title: '初审列表',
				  },
				  children: null
				},
				{
				  path: '/check/first/edit',
				  component: resolve => require(['@/views/check/FirstcheckEdit'], resolve),
				  name: 'FirstcheckEdit',
				  meta: {
				    title: '编辑初审',
				  },
				  children: null
				},
				{
				  path: '/check/first/check',
				  component: resolve => require(['@/views/check/FirstcheckCheck'], resolve),
				  name: 'FirstcheckCheck',
				  meta: {
				    title: '审核初审',
				  },
				  children: null
				},
				// 资源审核列表
				{
				  path: '/check/resourceCheck',
				  component: resolve => require(['@/views/check/ResourceCheck'], resolve),
				  name: 'ResourceCheck',
				  meta: {
				    title: '资源审核列表',
				  },
				  children: null
				},
				// 复审列表
				{
				  path: '/check/recheck',
				  component: resolve => require(['@/views/check/Recheck'], resolve),
				  name: 'Recheck',
				  meta: {
				    title: '复审列表',
				  },
				  children: null
				},
				// 复审
				{
				  path: '/check/recheck/check',
				  component: resolve => require(['@/views/check/RecheckCheck'], resolve),
				  name: 'RecheckCheck',
				  meta: {
				    title: '复审',
				  },
				  children: null
				},
				// 进度提交列表
				{
				  path: '/check/process',
				  component: resolve => require(['@/views/check/Process'], resolve),
				  name: 'checkProcess',
				  meta: {
				    title: '进度提交列表',
				  },
				  children: null
				},
				// 进度审核
				{
				  path: '/check/process/check',
				  component: resolve => require(['@/views/check/ProcessCheck'], resolve),
				  name: 'ProcessCheck',
				  meta: {
				    title: '进度审核',
				  },
				  children: null
				},
				// 验收审核列表
				{
				  path: '/check/accept',
				  component: resolve => require(['@/views/check/Accept'], resolve),
				  name: 'Accept',
				  meta: {
				    title: '验收审核列表',
				  },
				  children: null
				},
				// 验收审核
				{
				  path: '/check/accept/check',
				  component: resolve => require(['@/views/check/AcceptCheck'], resolve),
				  name: 'AcceptCheck',
				  meta: {
				    title: '验收审核',
				  },
				  children: null
				},

				/*
				**信息管理
				 */
				// 个人信息
				{
				  path: '/message/personal',
				  component: resolve => require(['@/views/message/PersonalMessage'], resolve),
				  name: 'PersonalMessage',
				  meta: {
				    title: '个人信息',
				  },
				  children: null
				},
				// 账户信息
				{
				  path: '/message/account',
				  component: resolve => require(['@/views/message/AccountMessage'], resolve),
				  name: 'AccountMessage',
				  meta: {
				    title: '账户信息',
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
				    title: '消息列表',
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
				    title: '知识库列表',
				  },
				  children: null
				},
				{
				  path: '/knowledge/knowledge/detail',
				  component: resolve => require(['@/views/knowledge/KnowledgeDetail'], resolve),
				  name: 'KnowledgeDetail',
				  meta: {
				    title: '知识库详情',
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
				    title: '事务列表',
				  },
				  children: null
				},
				{
				  path: '/works/routine/edit',
				  component: resolve => require(['@/views/works/RoutineEdit'], resolve),
				  name: 'RoutineEdit',
				  meta: {
				    title: '编辑事务',
				  },
				  children: null
				},

				/*
				**我的项目
				 */
				{
				  path: '/company/myProject',
				  component: resolve => require(['@/views/myProject/MyProject'], resolve),
				  name: 'MyProject',
				  meta: {
				    title: '我的项目',
				  },
				  children: null
				},
				{
				  path: '/company/myProject/process',
				  component: resolve => require(['@/views/myProject/MyprojectProcess'], resolve),
				  name: 'MyprojectProcess',
				  meta: {
				    title: '上传进度',
				  },
				  children: null
				},
				{
				  path: '/company/myProject/accept',
				  component: resolve => require(['@/views/myProject/MyprojectAccept'], resolve),
				  name: 'MyprojectAccept',
				  meta: {
				    title: '上传验收',
				  },
				  children: null
				},
		  ],
		}
  ]
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/login') {
    next();
  } else {
    let token = VueCookies.get('application_token');
    if (token === null || token === '') {
      next({
      	path:'/login',
      	query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    } else {
      next();
    }
  }
});

export default router;