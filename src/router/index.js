import Vue from 'vue';
import Router from 'vue-router';
import VueCookies from 'vue-cookies';

Vue.use(Router)

const router = new Router({
  routes: [
		{
      path: '*',
      hidden: true,
      component: ()=>import('@/views/404'),
      name: 'notFound',
      hidden: true,
		  meta: {
		    title: '404'
		  },
    },
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
				  name: 'ProjectList',
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
				  path: '/project/project/paymentNode',
				  component: resolve => require(['@/views/project/ProjectPaymentnode'], resolve),
				  name: 'ProjectPaymentnode',
				  meta: {
				    title: '付款节点',
				  },
				  children: null
				},
				{
				  path: '/project/project/serviceList',
				  component: resolve => require(['@/views/project/ServiceList'], resolve),
				  name: 'ProjectServiceList',
				  meta: {
				    title: '项目工单列表',
				  },
				  children: null
				},
				{
				  path: '/project/project/service/edit',
				  component: resolve => require(['@/views/project/ServiceEdit'], resolve),
				  name: 'ProjectServiceEdit',
				  meta: {
				    title: '项目发起工单',
				  },
				  children: null
				},
				{
				  path: '/project/project/service/detail',
				  component: resolve => require(['@/views/project/ServiceDetail'], resolve),
				  name: 'ProjectServiceDetail',
				  meta: {
				    title: '项目工单详情',
				  },
				  children: null
				},
				{
				  path: '/project/project/detail',
				  component: resolve => require(['@/views/project/ProjectDetail'], resolve),
				  name: 'ProjectDetail',
				  meta: {
				    title: '项目详情',
				  },
				  children: null
				},
				{
				  path: '/project/project/running',
				  component: resolve => require(['@/views/project/ProjectRunning'], resolve),
				  name: 'ProjectRunning',
				  meta: {
				    title: '进入项目实施',
				  },
				  children: null
				},
				{
				  path: '/project/project/accept',
				  component: resolve => require(['@/views/project/ProjectAccept'], resolve),
				  name: 'ProjectAccept',
				  meta: {
				    title: '进入验收流程',
				  },
				  children: null
				},
				{
				  path: '/project/project/maintenance',
				  component: resolve => require(['@/views/project/ProjectMaintenance'], resolve),
				  name: 'ProjectMaintenance',
				  meta: {
				    title: '进入项目维保',
				  },
				  children: null
				},
				{
				  path: '/project/project/recheck',
				  component: resolve => require(['@/views/project/ProjectRecheck'], resolve),
				  name: 'ProjectRecheck',
				  meta: {
				    title: '项目提交评审',
				  },
				  children: null
				},
				{
				  path: '/project/project/recheckList',
				  component: resolve => require(['@/views/project/ProjectRecheckList'], resolve),
				  name: 'ProjectRecheckList',
				  meta: {
				    title: '项目评审列表',
				  },
				  children: null
				},
				{
				  path: '/project/project/processList',
				  component: resolve => require(['@/views/project/ProjectProcessList'], resolve),
				  name: 'ProjectProcessList',
				  meta: {
				    title: '项目进度列表',
				  },
				  children: null
				},
				{
				  path: '/project/project/processDetail',
				  component: resolve => require(['@/views/project/ProjectProcessDetail'], resolve),
				  name: 'ProjectProcessDetail',
				  meta: {
				    title: '项目进度详情',
				  },
				  children: null
				},
				{
				  path: '/project/project/applyResource',
				  component: resolve => require(['@/views/project/ProjectApplyresource'], resolve),
				  name: 'ProjectApplyresource',
				  meta: {
				    title: '项目申请资源',
				  },
				  children: null
				},


				// 资源列表
				{
				  path: '/project/resource',
				  component: resolve => require(['@/views/project/resource/Resource'], resolve),
				  name: 'Resource',
				  meta: {
				    title: '资源列表',
				  },
				  children: null
				},
				// 编辑资源
				{
				  path: '/project/resource/edit',
				  component: resolve => require(['@/views/project/resource/ResourceEdit'], resolve),
				  name: 'ResourceEdit',
				  meta: {
				    title: '编辑资源',
				  },
				  children: null
				},
				// 项目资源详情
				{
				  path: '/project/resource/p_detail',
				  component: resolve => require(['@/views/project/resource/ResourceProjectDetail'], resolve),
				  name: 'ResourceProjectDetail',
				  meta: {
				    title: '项目资源详情',
				  },
				  children: null
				},
				// 资源详情
				{
				  path: '/project/resource/detail',
				  component: resolve => require(['@/views/project/resource/ResourceDetail'], resolve),
				  name: 'ResourceDetail',
				  meta: {
				    title: '资源详情',
				  },
				  children: null
				},
				{
				  path: '/project/resource/serviceList',
				  component: resolve => require(['@/views/project/resource/ResourceServiceList'], resolve),
				  name: 'ResourceServiceList',
				  meta: {
				    title: '资源工单列表',
				  },
				  children: null
				},
				{
				  path: '/project/resource/service/edit',
				  component: resolve => require(['@/views/project/resource/ResourceServiceEdit'], resolve),
				  name: 'ResourceServiceEdit',
				  meta: {
				    title: '资源发起工单',
				  },
				  children: null
				},
				{
				  path: '/project/resource/service/detail',
				  component: resolve => require(['@/views/project/resource/ResourceServiceDetail'], resolve),
				  name: 'ResourceServiceDetail',
				  meta: {
				    title: '资源工单详情',
				  },
				  children: null
				},

				// 维保列表
				{
				  path: '/project/maintenance',
				  component: resolve => require(['@/views/project/maintenance/Maintenance'], resolve),
				  name: 'Maintenance',
				  meta: {
				    title: '维保列表',
				  },
				  children: null
				},
				// 维保详情
				{
				  path: '/project/maintenance/detail',
				  component: resolve => require(['@/views/project/maintenance/MaintenanceDetail'], resolve),
				  name: 'MaintenanceDetail',
				  meta: {
				    title: '维保详情',
				  },
				  children: null
				},
				{
				  path: '/project/maintenance/serviceList',
				  component: resolve => require(['@/views/project/maintenance/MaintenanceServiceList'], resolve),
				  name: 'MaintenanceServiceList',
				  meta: {
				    title: '维保工单列表',
				  },
				  children: null
				},
				{
				  path: '/project/maintenance/service/edit',
				  component: resolve => require(['@/views/project/maintenance/MaintenanceServiceEdit'], resolve),
				  name: 'MaintenanceServiceEdit',
				  meta: {
				    title: '维保发起工单',
				  },
				  children: null
				},
				{
				  path: '/project/maintenance/service/detail',
				  component: resolve => require(['@/views/project/maintenance/MaintenanceServiceDetail'], resolve),
				  name: 'MaintenanceServiceDetail',
				  meta: {
				    title: '维保工单详情',
				  },
				  children: null
				},
				{
				  path: '/project/maintenance/paymentNode',
				  component: resolve => require(['@/views/project/maintenance/MaintenancePaymentnode'], resolve),
				  name: 'MaintenancePaymentnode',
				  meta: {
				    title: '维保付款节点',
				  },
				  children: null
				},

				// 款项信息列表
				{
				  path: '/project/payment',
				  component: resolve => require(['@/views/project/payment/Payment'], resolve),
				  name: 'Payment',
				  meta: {
				    title: '款项信息列表'
				  },
				  children: null
				},

				// 承办列表
				{
				  path: '/project/hoster',
				  component: resolve => require(['@/views/project/hoster/Hoster'], resolve),
				  name: 'Hoster',
				  meta: {
				    title: '承办列表',
				  },
				  children: null
				},
				// 编辑承办
				{
				  path: '/project/hoster/edit',
				  component: resolve => require(['@/views/project/hoster/HosterEdit'], resolve),
				  name: 'HosterEdit',
				  meta: {
				    title: '编辑承办',
				  },
				  children: null
				},
				// 承办详情
				{
				  path: '/project/hoster/detail',
				  component: resolve => require(['@/views/project/hoster/HosterDetail'], resolve),
				  name: 'HosterDetail',
				  meta: {
				    title: '承办详情',
				  },
				  children: null
				},

				// 承办资源列表
				{
				  path: '/project/hosterResource',
				  component: resolve => require(['@/views/project/hosterResource/HosterResource'], resolve),
				  name: 'HosterResource',
				  meta: {
				    title: '承办资源列表',
				  },
				  children: null
				},
				// 承办详情
				{
				  path: '/project/hosterResource/detail',
				  component: resolve => require(['@/views/project/hosterResource/HosterResourceDetail'], resolve),
				  name: 'HosterResourceDetail',
				  meta: {
				    title: '承办资源详情',
				  },
				  children: null
				},
				// 承办资源使用列表
				{
				  path: '/project/hosterResource/useList',
				  component: resolve => require(['@/views/project/hosterResource/HosterResourceUselist'], resolve),
				  name: 'HosterResourceUselist',
				  meta: {
				    title: '承办资源使用列表'
				  },
				  children: null
				},
				// 承办资源维护记录列表
				{
				  path: '/project/hosterResource/recordList',
				  component: resolve => require(['@/views/project/hosterResource/HosterResourceRecordlist'], resolve),
				  name: 'HosterResourceRecordlist',
				  meta: {
				    title: '承办资源维护记录列表'
				  },
				  children: null
				},
				

				/*
				**部门项目
				 */
				// 项目列表
				{
				  path: '/manager/project',
				  component: resolve => require(['@/views/manager/Project'], resolve),
				  name: 'manager_ProjectList',
				  meta: {
				    title: '部门项目列表',
				  },
				  children: null
				},
				// 项目详情
				{
				  path: '/manager/project/detail',
				  component: resolve => require(['@/views/manager/ProjectDetail'], resolve),
				  name: 'manager_ProjectDetail',
				  meta: {
				    title: '部门项目详情',
				  },
				  children: null
				},
				// 维保列表
				{
				  path: '/manager/maintenance',
				  component: resolve => require(['@/views/manager/maintenance/Maintenance'], resolve),
				  name: 'manager_Maintenance',
				  meta: {
				    title: '部门维保列表',
				  },
				  children: null
				},
				// 维保详情
				{
				  path: '/manager/maintenance/detail',
				  component: resolve => require(['@/views/manager/maintenance/MaintenanceDetail'], resolve),
				  name: 'manager_MaintenanceDetail',
				  meta: {
				    title: '部门项目维保详情',
				  },
				  children: null
				},
				// 资源列表
				{
				  path: '/manager/resource',
				  component: resolve => require(['@/views/manager/hosterResource/HosterResource'], resolve),
				  name: 'manager_HosterResource',
				  meta: {
				    title: '部门资源列表',
				  },
				  children: null
				},
				// 资源详情
				{
				  path: '/manager/resource/detail',
				  component: resolve => require(['@/views/manager/hosterResource/HosterResourceDetail'], resolve),
				  name: 'manager_HosterResourceDetail',
				  meta: {
				    title: '部门资源详情',
				  },
				  children: null
				},
				// 款项信息列表
				{
				  path: '/manager/payment',
				  component: resolve => require(['@/views/manager/payment/Payment'], resolve),
				  name: 'manager_Payment',
				  meta: {
				    title: '款项信息列表'
				  },
				  children: null
				},


				/*
				**审核管理-审核列表
				 */
				// 审核列表
				{
				  path: '/check/checkList',
				  component: resolve => require(['@/views/check/CheckList'], resolve),
				  name: 'CheckList',
				  meta: {
				    title: '审核列表',
				  },
				  children: null
				},

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
				{
				  path: '/check/first/detail',
				  component: resolve => require(['@/views/check/FirstcheckDetail'], resolve),
				  name: 'FirstcheckDetail',
				  meta: {
				    title: '审核初审详情',
				  },
				  children: null
				},
				// 评审列表
				{
				  path: '/check/recheck',
				  component: resolve => require(['@/views/check/Recheck'], resolve),
				  name: 'Recheck',
				  meta: {
				    title: '评审列表',
				  },
				  children: null
				},
				{
				  path: '/check/recheck/edit',
				  component: resolve => require(['@/views/check/RecheckCheckEdit'], resolve),
				  name: 'RecheckCheckEdit',
				  meta: {
				    title: '审核编辑',
				  },
				  children: null
				},
				{
				  path: '/check/recheck/check',
				  component: resolve => require(['@/views/check/RecheckCheck'], resolve),
				  name: 'RecheckCheck',
				  meta: {
				    title: '审核',
				  },
				  children: null
				},
				{
				  path: '/check/recheck/detail',
				  component: resolve => require(['@/views/check/RecheckCheckDetail'], resolve),
				  name: 'RecheckCheckDetail',
				  meta: {
				    title: '审核详情',
				  },
				  children: null
				},

				// 实施列表
				{
				  path: '/check/force',
				  component: resolve => require(['@/views/check/Force'], resolve),
				  name: 'Force',
				  meta: {
				    title: '实施列表',
				  },
				  children: null
				},
				{
				  path: '/check/force/edit',
				  component: resolve => require(['@/views/check/ForceEdit'], resolve),
				  name: 'ForceEdit',
				  meta: {
				    title: '实施编辑',
				  },
				  children: null
				},
				{
				  path: '/check/force/check',
				  component: resolve => require(['@/views/check/ForceCheck'], resolve),
				  name: 'ForceCheck',
				  meta: {
				    title: '实施审核',
				  },
				  children: null
				},
				{
				  path: '/check/force/detail',
				  component: resolve => require(['@/views/check/ForceDetail'], resolve),
				  name: 'ForceDetail',
				  meta: {
				    title: '实施详情',
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
				{
				  path: '/check/process/check',
				  component: resolve => require(['@/views/check/ProcessCheck'], resolve),
				  name: 'ProcessCheck',
				  meta: {
				    title: '进度审核',
				  },
				  children: null
				},
				{
				  path: '/check/process/detail',
				  component: resolve => require(['@/views/check/ProcessDetail'], resolve),
				  name: 'ProcessDetail',
				  meta: {
				    title: '进度详情',
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
				{
				  path: '/check/accept/check',
				  component: resolve => require(['@/views/check/AcceptCheck'], resolve),
				  name: 'AcceptCheck',
				  meta: {
				    title: '验收审核',
				  },
				  children: null
				},
				{
				  path: '/check/accept/detail',
				  component: resolve => require(['@/views/check/AcceptDetail'], resolve),
				  name: 'AcceptDetail',
				  meta: {
				    title: '验收详情',
				  },
				  children: null
				},
				// 项目维保列表
				{
				  path: '/check/maintenance',
				  // component: resolve => require(['@/views/check/Maintenance'], resolve),  // 暂时没有这个页面
				  name: 'CheckMaintenance',
				  meta: {
				    title: '项目维保列表',
				  },
				  children: null
				},
				{
				  path: '/check/maintenance/check',
				  component: resolve => require(['@/views/check/MaintenanceCheck'], resolve),
				  name: 'MaintenanceCheck',
				  meta: {
				    title: '项目维保审核',
				  },
				  children: null
				},
				{
				  path: '/check/maintenance/edit',
				  component: resolve => require(['@/views/check/MaintenanceEdit'], resolve),
				  name: 'MaintenanceEdit',
				  meta: {
				    title: '项目维保编辑',
				  },
				  children: null
				},
				{
				  path: '/check/maintenance/detail',
				  component: resolve => require(['@/views/check/MaintenanceDetail'], resolve),
				  name: 'checkMaintenanceDetail',
				  meta: {
				    title: '项目维保详情',
				  },
				  children: null
				},
				// 资源审核
				{
				  path: '/check/resource/check',
				  component: resolve => require(['@/views/check/ResourcecheckCheck'], resolve),
				  name: 'ResourcecheckCheck',
				  meta: {
				    title: '审核-资源审核',
				  },
				  children: null
				},
				// 资源审核详情
				{
				  path: '/check/resource/detail',
				  component: resolve => require(['@/views/check/ResourcecheckDetail'], resolve),
				  name: 'ResourcecheckDetail',
				  meta: {
				    title: '审核-资源审核详情',
				  },
				  children: null
				},

				/*
				**审核管理-资源审核列表
				 */
				// 资源审核列表
				{
				  path: '/check/resourceList',
				  component: resolve => require(['@/views/check/resource/ResourceChecklist'], resolve),
				  name: 'resource-ResourceChecklist',
				  meta: {
				    title: '资源-资源审核列表',
				  },
				  children: null
				},
				{
				  path: '/check/resourceList/check',
				  component: resolve => require(['@/views/check/resource/ResourcechecklistCheck'], resolve),
				  name: 'resource-ResourcechecklistCheck',
				  meta: {
				    title: '资源-资源审核',
				  },
				  children: null
				},

				/*
				**审核管理-厂商密码更改申请
				 */
				// 厂商密码更改申请列表
				{
				  path: '/check/companyapplyList',
				  component: resolve => require(['@/views/check/company/CompanyapplyList'], resolve),
				  name: 'check-CompanyapplyList',
				  meta: {
				    title: '审核-厂商密码更改申请列表',
				  },
				  children: null
				},
				{
				  path: '/check/companyapplyList/check',
				  component: resolve => require(['@/views/check/company/CompanyapplyListCheck'], resolve),
				  name: 'resource-CompanyapplyListCheck',
				  meta: {
				    title: '审核-厂商密码更改申请',
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
				  path: '/company/myProject/detail',
				  component: resolve => require(['@/views/myProject/MyprojectDetail'], resolve),
				  name: 'MyprojectDetail',
				  meta: {
				    title: '我的项目详情',
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
				{
				  path: '/company/myProject/processList',
				  component: resolve => require(['@/views/myProject/MyprojectProcessList'], resolve),
				  name: 'MyprojectProcessList',
				  meta: {
				    title: '进度记录',
				  },
				  children: null
				},
				{
				  path: '/company/myProject/processDetail',
				  component: resolve => require(['@/views/myProject/MyprojectProcessDetail'], resolve),
				  name: 'MyprojectProcessDetail',
				  meta: {
				    title: '进度记录详情',
				  },
				  children: null
				},

				// 我的项目-维保列表
				{
				  path: '/company/maintenance',
				  component: resolve => require(['@/views/myProject/maintenance/Maintenance'], resolve),
				  name: 'MyProject-Maintenance',
				  meta: {
				    title: '我的项目-维保列表',
				  },
				  children: null
				},
				// 我的项目-维保列表
				{
				  path: '/company/maintenance/detail',
				  component: resolve => require(['@/views/myProject/maintenance/MaintenanceDetail'], resolve),
				  name: 'MyProject-MaintenanceDetail',
				  meta: {
				    title: '我的项目-维保详情',
				  },
				  children: null
				},

				/*
				**我的资源
				 */
				// 我的资源列表
				{
				  path: '/company/myResource',
				  component: resolve => require(['@/views/myResource/myResource'], resolve),
				  name: 'myResource',
				  meta: {
				    title: '我的资源列表',
				  },
				  children: null
				},
				{
				  path: '/company/myResource/record',
				  component: resolve => require(['@/views/myResource/myResourceRecord'], resolve),
				  name: 'myResourceRecord',
				  meta: {
				    title: '添加记录',
				  },
				  children: null
				},
				// 记录列表
				{
				  path: '/company/myRecord',
				  component: resolve => require(['@/views/myResource/myRecord'], resolve),
				  name: 'myRecord',
				  meta: {
				    title: '记录列表',
				  },
				  children: null
				},
				// 记录详情
				{
				  path: '/company/myRecord/detail',
				  component: resolve => require(['@/views/myResource/myRecordDetail'], resolve),
				  name: 'myRecordDetail',
				  meta: {
				    title: '记录详情',
				  },
				  children: null
				},

				/*
				**工单管理
				 */
				// 工单列表
				{
				  path: '/service/service',
				  component: resolve => require(['@/views/service/Service'], resolve),
				  name: 'Service',
				  meta: {
				    title: '工单列表',
				  },
				  children: null
				},
				// 工单详情
				{
				  path: '/service/service/detail',
				  component: resolve => require(['@/views/service/ServiceDetail'], resolve),
				  name: 'ServiceDetail',
				  meta: {
				    title: '工单详情',
				  },
				  children: null
				},

				/*
				**厂商管理
				 */
				// 厂商列表
				{
				  path: '/company/company',
				  component: resolve => require(['@/views/manufacturer/ManufacturerUser'], resolve),
				  name: 'Company',
				  meta: {
				    title: '厂商列表',
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
		var _this = new Vue();
		_this.$api.check_login({
		}).then(data=>{
			if(data.code == 0){
				console.log(data,'hi,我是单点登录后的check_login接口');
			}else{
				this.$message.error(data.msg);
			}
		});
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